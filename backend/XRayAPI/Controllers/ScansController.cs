using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XRayAPI.Data;
using XRayAPI.DTOs.Scans;
using XRayAPI.Models;
using XRayAPI.Services;

namespace XRayAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ScansController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AiService _aiService;
        private readonly FileStorageService _fileService;

        public ScansController(AppDbContext context, AiService aiService, FileStorageService fileService)
        {
            _context = context;
            _aiService = aiService;
            _fileService = fileService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadScan([FromForm] ScanUploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file uploaded");

            var scan = new Scan
            {
                PatientId = request.PatientId
            };

            // Save original image
            var imagePath = await _fileService.SaveXRayScanAsync(scan.Id, request.File);
            scan.ImagePath = $"/uploads/{scan.Id}.png";

            _context.Scans.Add(scan);
            await _context.SaveChangesAsync();

            try
            {
                // Call AI
                var scores = await _aiService.PredictAsync(imagePath);
                var heatmapBase64 = await _aiService.GetHeatmapBase64Async(imagePath);

                // Save Heatmap
                await _fileService.SaveHeatmapAsync(scan.Id, heatmapBase64);

                var scanResult = new ScanResult
                {
                    ScanId = scan.Id,
                    Pneumonia = scores.Pneumonia,
                    Effusion = scores.Effusion,
                    Cardiomegaly = scores.Cardiomegaly,
                    Pneumothorax = scores.Pneumothorax,
                    NoFinding = scores.NoFinding,
                    HeatmapPath = $"/heatmaps/{scan.Id}_heatmap.png"
                };

                _context.ScanResults.Add(scanResult);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(503, new { message = "AI service temporarily unavailable", details = ex.Message });
            }

            return Ok(new { scanId = scan.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetScan(Guid id)
        {
            var scan = await _context.Scans
                .Include(s => s.Result)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (scan == null) return NotFound();

            return Ok(new ScanResultDto
            {
                Scan = new ScanDto { Id = scan.Id, PatientId = scan.PatientId, ImageUrl = scan.ImagePath, Notes = scan.Notes, UploadedAt = scan.UploadedAt },
                Result = scan.Result != null ? new AiScoresDto {
                    Pneumonia = scan.Result.Pneumonia,
                    Effusion = scan.Result.Effusion,
                    Cardiomegaly = scan.Result.Cardiomegaly,
                    Pneumothorax = scan.Result.Pneumothorax,
                    NoFinding = scan.Result.NoFinding,
                    HeatmapUrl = scan.Result.HeatmapPath
                } : new AiScoresDto()
            });
        }

        [HttpPatch("{id}/notes")]
        public async Task<IActionResult> UpdateNotes(Guid id, [FromBody] UpdateNotesRequest request)
        {
            var scan = await _context.Scans.FindAsync(id);
            if (scan == null) return NotFound();

            scan.Notes = request.Notes;
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
        [HttpGet("{id}/report")]
        public async Task<IActionResult> DownloadReport(Guid id, [FromServices] PdfReportService pdfService)
        {
            var scan = await _context.Scans
                .Include(s => s.Result)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (scan == null) return NotFound();

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == scan.PatientId);
            if (patient == null) return NotFound();

            User doctor = null;
            if (patient.DoctorId.HasValue)
            {
                doctor = await _context.Users.FirstOrDefaultAsync(u => u.Id == patient.DoctorId.Value);
            }

            var pdfBytes = pdfService.GeneratePdfReport(patient, scan, doctor);

            var fileName = $"Report_{patient.FullName.Replace(" ", "_")}_{scan.UploadedAt:yyyyMMdd}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
    }
}
