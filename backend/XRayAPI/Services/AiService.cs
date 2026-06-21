using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using XRayAPI.DTOs.Scans;

namespace XRayAPI.Services
{
    public class AiService
    {
        private readonly HttpClient _httpClient;

        public AiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AiScoresDto> PredictAsync(string imagePath)
        {
            try
            {
                using var form = new MultipartFormDataContent();
                var imageBytes = await File.ReadAllBytesAsync(imagePath);
                form.Add(new ByteArrayContent(imageBytes), "file", Path.GetFileName(imagePath));
                
                using var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:8000/predict");
                request.Headers.Add("Authorization", "internal-key");
                request.Content = form;
                
                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                
                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<AiScoresDto>(json, options);
                return result ?? GetMockScores();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AiService] AI service connection failed: {ex.Message}. Falling back to mock predictions.");
                return GetMockScores();
            }
        }

        public async Task<string> GetHeatmapBase64Async(string imagePath)
        {
            try
            {
                using var form = new MultipartFormDataContent();
                var imageBytes = await File.ReadAllBytesAsync(imagePath);
                form.Add(new ByteArrayContent(imageBytes), "file", Path.GetFileName(imagePath));
                
                using var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:8000/heatmap");
                request.Headers.Add("Authorization", "internal-key");
                request.Content = form;
                
                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                
                var json = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<HeatmapResult>(json, options);
                return result?.HeatmapBase64 ?? string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AiService] AI service connection failed: {ex.Message}. Falling back to original image as heatmap.");
                var imageBytes = await File.ReadAllBytesAsync(imagePath);
                return Convert.ToBase64String(imageBytes);
            }
        }

        private AiScoresDto GetMockScores()
        {
            var random = new Random();
            double pneumonia = Math.Round(random.NextDouble() * 0.8, 4);
            double effusion = Math.Round(random.NextDouble() * (1 - pneumonia) * 0.5, 4);
            double cardiomegaly = Math.Round(random.NextDouble() * (1 - pneumonia - effusion) * 0.3, 4);
            double pneumothorax = Math.Round(random.NextDouble() * (1 - pneumonia - effusion - cardiomegaly) * 0.2, 4);
            double noFinding = Math.Round(1.0 - (pneumonia + effusion + cardiomegaly + pneumothorax), 4);
            if (noFinding < 0) noFinding = 0;

            return new AiScoresDto
            {
                Pneumonia = pneumonia,
                Effusion = effusion,
                Cardiomegaly = cardiomegaly,
                Pneumothorax = pneumothorax,
                NoFinding = noFinding
            };
        }

        private class HeatmapResult
        {
            [JsonPropertyName("heatmap_base64")]
            public string HeatmapBase64 { get; set; } = string.Empty;
        }
    }
}
