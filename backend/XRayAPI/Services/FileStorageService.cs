using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace XRayAPI.Services
{
    public class FileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveXRayScanAsync(Guid scanId, IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder);
            
            var fileName = $"{scanId}.png";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath; // absolute path used by python
        }

        public async Task SaveHeatmapAsync(Guid scanId, string base64Data)
        {
            var heatmapsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "heatmaps");
            Directory.CreateDirectory(heatmapsFolder);

            var fileName = $"{scanId}_heatmap.png";
            var filePath = Path.Combine(heatmapsFolder, fileName);

            // Decode base64 to byte array
            var cleanBase64 = base64Data.Replace("data:image/png;base64,", "");
            var imageBytes = Convert.FromBase64String(cleanBase64);

            await File.WriteAllBytesAsync(filePath, imageBytes);
        }
    }
}
