using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XRayAPI.Models
{
    public class ScanResult
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ScanId { get; set; }
        [ForeignKey("ScanId")]
        public Scan? Scan { get; set; }

        public double Pneumonia { get; set; }
        public double Effusion { get; set; }
        public double Atelectasis { get; set; }
        public double Cardiomegaly { get; set; }
        public double Pneumothorax { get; set; }
        public double NoFinding { get; set; }

        [Required]
        [MaxLength(500)]
        public string HeatmapPath { get; set; } = string.Empty;

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
