using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XRayAPI.Data;

namespace XRayAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || !System.Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            int totalPatients = 0;
            int totalScans = 0;
            int highRisk = 0;
            int scansThisWeek = 0;

            var query = _context.Scans.Include(s => s.Result).AsQueryable();

            if (role == "Patient")
            {
                query = query.Where(s => s.Patient.UserId == userId);
                totalScans = await query.CountAsync();
            }
            else
            {
                totalPatients = await _context.Patients.CountAsync(p => p.DoctorId == userId);
                query = query.Where(s => s.Patient.DoctorId == userId);
                totalScans = await query.CountAsync();
            }

            var sevenDaysAgo = System.DateTime.UtcNow.AddDays(-7);
            
            // Bring into memory to compute advanced stats easily
            var scans = await query.ToListAsync();

            scansThisWeek = scans.Count(s => s.UploadedAt >= sevenDaysAgo);

            highRisk = scans.Count(s => s.Result != null && 
                (s.Result.Pneumonia > 0.7 || s.Result.Effusion > 0.7 || s.Result.Cardiomegaly > 0.7 || s.Result.Pneumothorax > 0.7));

            // Condition Counts - Only count the absolute highest disease per scan
            int countPneumonia = 0;
            int countEffusion = 0;
            int countCardiomegaly = 0;
            int countPneumothorax = 0;

            foreach (var s in scans)
            {
                if (s.Result == null) continue;
                
                var r = s.Result;
                var conditions = new System.Collections.Generic.Dictionary<string, double>
                {
                    { "Pneumonia", r.Pneumonia },
                    { "Effusion", r.Effusion },
                    { "Cardiomegaly", r.Cardiomegaly },
                    { "Pneumothorax", r.Pneumothorax },
                    { "No Finding", r.NoFinding }
                };

                var top = conditions.OrderByDescending(kv => kv.Value).First();

                if (top.Key == "Pneumonia") countPneumonia++;
                else if (top.Key == "Effusion") countEffusion++;
                else if (top.Key == "Cardiomegaly") countCardiomegaly++;
                else if (top.Key == "Pneumothorax") countPneumothorax++;
            }

            var conditionCounts = new[] {
                new { name = "Pneumonia", count = countPneumonia },
                new { name = "Effusion", count = countEffusion },
                new { name = "Cardiomegaly", count = countCardiomegaly },
                new { name = "Pneumothorax", count = countPneumothorax }
            };

            // Scans Timeline (last 7 days)
            var scansTimeline = new System.Collections.Generic.List<object>();
            for (int i = 6; i >= 0; i--)
            {
                var date = System.DateTime.UtcNow.AddDays(-i).Date;
                var count = scans.Count(s => s.UploadedAt.Date == date);
                scansTimeline.Add(new { name = date.ToString("MMM dd"), count = count });
            }

            // Patient Status (Healthy vs At Risk)
            int healthy = scans.Count(s => s.Result != null && s.Result.NoFinding > 0.5);
            int atRisk = scans.Count(s => s.Result != null && s.Result.NoFinding <= 0.5);
            var patientStatus = new[] {
                new { name = "Healthy", value = healthy },
                new { name = "At Risk", value = atRisk }
            };

            return Ok(new {
                totalPatients,
                totalScans,
                highRisk,
                scansThisWeek,
                conditionCounts,
                scansTimeline,
                patientStatus
            });
        }

        [HttpGet("recent-scans")]
        public async Task<IActionResult> GetRecentScans()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || !System.Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var query = _context.Scans
                .Include(s => s.Patient)
                .Include(s => s.Result)
                .AsQueryable();

            if (role == "Patient")
            {
                query = query.Where(s => s.Patient.UserId == userId);
            }
            else
            {
                query = query.Where(s => s.Patient.DoctorId == userId);
            }

            var recentScansRaw = await query
                .OrderByDescending(s => s.UploadedAt)
                .Take(5)
                .ToListAsync();

            var recentScans = recentScansRaw.Select(s => 
            {
                var r = s.Result;
                var conditions = new System.Collections.Generic.Dictionary<string, double>
                {
                    { "pneumonia", r.Pneumonia },
                    { "effusion", r.Effusion },
                    { "cardiomegaly", r.Cardiomegaly },
                    { "pneumothorax", r.Pneumothorax },
                    { "no_finding", r.NoFinding }
                };
                var top = conditions.OrderByDescending(kv => kv.Value).First();

                return new
                {
                    id = s.Id,
                    patientId = s.PatientId,
                    patientName = s.Patient.FullName,
                    date = s.UploadedAt,
                    topCondition = top.Key,
                    topScore = top.Value
                };
            }).ToList();

            return Ok(recentScans);
        }
    }
}
