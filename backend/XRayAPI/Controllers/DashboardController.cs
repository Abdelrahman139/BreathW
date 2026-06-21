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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;



            int totalPatients = 0;
            int totalScans = 0;

            if (role == "Patient")
            {
                totalScans = await _context.Scans.CountAsync(s => s.PatientId.ToString() == userId);
            }
            else
            {
                totalPatients = await _context.Patients.CountAsync(p => p.DoctorId.ToString() == userId);
                totalScans = await _context.Scans.CountAsync(s => s.Patient.DoctorId.ToString() == userId);
            }

            // Mocked stats for simplicity matching frontend DashboardStats interface
            return Ok(new {
                totalPatients,
                totalScans,
                highRisk = 2,
                scansThisWeek = 5,
                conditionCounts = new[] {
                    new { name = "Pneumonia", count = 1 },
                    new { name = "Effusion", count = 0 },
                    new { name = "Cardiomegaly", count = 0 },
                    new { name = "Pneumothorax", count = 0 }
                }
            });
        }

        [HttpGet("recent-scans")]
        public async Task<IActionResult> GetRecentScans()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var query = _context.Scans
                .Include(s => s.Patient)
                .Include(s => s.Result)
                .AsQueryable();

            if (role == "Patient")
            {
                query = query.Where(s => s.Patient.UserId.ToString() == userId);
            }
            else
            {
                query = query.Where(s => s.Patient.DoctorId.ToString() == userId);
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
