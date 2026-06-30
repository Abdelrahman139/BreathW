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
            if (result == null)
            {
                throw new Exception("Failed to deserialize AI service response.");
            }
            return result;
        }

        public async Task<string> GetHeatmapBase64Async(string imagePath)
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
            
            if (result == null || string.IsNullOrEmpty(result.HeatmapBase64))
            {
                 throw new Exception("Failed to extract heatmap from AI service response.");
            }
            return result.HeatmapBase64;
        }

        private class HeatmapResult
        {
            [JsonPropertyName("heatmap_base64")]
            public string HeatmapBase64 { get; set; } = string.Empty;
        }
    }
}
