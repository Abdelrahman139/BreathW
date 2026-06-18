using System;
using System.Collections.Generic;

namespace XRayAPI.DTOs.Patients
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public Guid? DoctorId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PatientDetailDto : PatientDto
    {
        public List<ScanSummaryDto> Scans { get; set; } = new List<ScanSummaryDto>();
    }

    public class ScanSummaryDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
        public object Result { get; set; } // Will hold scores
    }

    public class CreatePatientRequest
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
    }
}
