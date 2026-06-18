using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XRayAPI.Models
{
    public class Patient
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        [MaxLength(10)]
        public string Gender { get; set; } = "Unknown";

        // If created by a doctor, linked to doctor
        public Guid? DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public User? Doctor { get; set; }

        // If the patient registers themselves, link to their User login
        public Guid? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? UserAccount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Scan> Scans { get; set; } = new List<Scan>();
    }
}
