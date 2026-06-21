using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XRayAPI.Data;
using XRayAPI.DTOs.Patients;
using XRayAPI.Models;

namespace XRayAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Patient")
            {
                var selfPatient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId.ToString() == userId);
                if (selfPatient == null) return Ok(new object[] { });
                return Ok(new[] { selfPatient });
            }

            var patients = await _context.Patients
                .Where(p => p.DoctorId.ToString() == userId)
                .Select(p => new PatientDto {
                    Id = p.Id,
                    FullName = p.FullName,
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();

            return Ok(patients);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] CreatePatientRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var patient = new Patient
            {
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender
            };

            if (role == "Doctor")
            {
                patient.DoctorId = Guid.Parse(userId!);
            }
            else
            {
                patient.UserId = Guid.Parse(userId!);
            }

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(patient);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(Guid id)
        {
            var patient = await _context.Patients
                .Include(p => p.Scans)
                .ThenInclude(s => s.Result)
                .FirstOrDefaultAsync(p => p.Id == id || p.UserId == id);

            if (patient == null)
            {
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (role == "Patient" && !string.IsNullOrEmpty(userIdStr) && Guid.TryParse(userIdStr, out var parsedUserId) && parsedUserId == id)
                {
                    var user = await _context.Users.FindAsync(id);
                    if (user != null)
                    {
                        patient = new Patient
                        {
                            UserId = id,
                            FullName = user.FullName
                        };
                        _context.Patients.Add(patient);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            if (patient == null) return NotFound();

            var dto = new PatientDetailDto
            {
                Id = patient.Id,
                FullName = patient.FullName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Scans = patient.Scans?.Select(s => new ScanSummaryDto {
                    Id = s.Id,
                    ImageUrl = s.ImagePath,
                    UploadedAt = s.UploadedAt
                }).ToList() ?? new System.Collections.Generic.List<ScanSummaryDto>()
            };

            return Ok(dto);
        }
    }
}
