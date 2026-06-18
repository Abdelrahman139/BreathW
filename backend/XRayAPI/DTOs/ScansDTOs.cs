using System;
using Microsoft.AspNetCore.Http;

namespace XRayAPI.DTOs.Scans
{
    public class ScanUploadRequest
    {
        public Guid PatientId { get; set; }
        public IFormFile File { get; set; } = null!;
    }

    public class ScanResultDto
    {
        public ScanDto Scan { get; set; } = new ScanDto();
        public AiScoresDto Result { get; set; } = new AiScoresDto();
    }

    public class ScanDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class AiScoresDto
    {
        public double Pneumonia { get; set; }
        public double Effusion { get; set; }
        public double Atelectasis { get; set; }
        public double Cardiomegaly { get; set; }
        public double Pneumothorax { get; set; }
        public double NoFinding { get; set; }
        public string HeatmapUrl { get; set; } = string.Empty;
    }

    public class UpdateNotesRequest
    {
        public string Notes { get; set; } = string.Empty;
    }
}
