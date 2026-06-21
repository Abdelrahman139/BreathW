using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using XRayAPI.Models;

namespace XRayAPI.Services
{
    public class PdfReportService
    {
        private readonly IWebHostEnvironment _env;

        public PdfReportService(IWebHostEnvironment env)
        {
            _env = env;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] GeneratePdfReport(Patient patient, Scan scan, User? doctor)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1.5f, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial).FontColor(Colors.Black));

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(x => ComposeContent(x, patient, scan, doctor));
                    page.Footer().Element(ComposeFooter);
                });
            });

            return document.GeneratePdf();
        }

        private void ComposeHeader(IContainer container)
        {
            container.PaddingBottom(20).Column(column =>
            {
                column.Item().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("BreathWise Diagnostics Center").FontSize(20).SemiBold().FontColor(Colors.Blue.Darken3);
                        col.Item().Text("123 Health Avenue, Medical District").FontSize(10).FontColor(Colors.Grey.Darken2);
                        col.Item().Text("Tel: +1 (555) 019-8372 | Email: radiology@BreathWise.com").FontSize(10).FontColor(Colors.Grey.Darken2);
                    });
                    
                    row.ConstantItem(150).AlignRight().Column(col =>
                    {
                        col.Item().Text("RADIOLOGY REPORT").FontSize(14).Bold().FontColor(Colors.Grey.Darken3).AlignRight();
                        col.Item().Text($"Date: {DateTime.Now:MMM dd, yyyy}").FontSize(10).AlignRight();
                        col.Item().Text($"Report ID: {Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}").FontSize(10).AlignRight();
                    });
                });
                
                column.Item().PaddingTop(10).LineHorizontal(2).LineColor(Colors.Blue.Darken2);
            });
        }

        private void ComposeContent(IContainer container, Patient patient, Scan scan, User? doctor)
        {
            container.Column(column =>
            {
                // 1. Patient & Study Details Box
                column.Item().Background(Colors.Grey.Lighten4).Padding(10).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text(t => { t.Span("Patient Name: ").SemiBold(); t.Span(patient.FullName); });
                        col.Item().Text(t => { t.Span("DOB / Age: ").SemiBold(); t.Span($"{patient.DateOfBirth:yyyy-MM-dd} ({(DateTime.Now.Year - patient.DateOfBirth.Year)} yrs)"); });
                        col.Item().Text(t => { t.Span("Gender: ").SemiBold(); t.Span(patient.Gender); });
                    });
                    
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text(t => { t.Span("Study: ").SemiBold(); t.Span("XR Chest PA/AP"); });
                        col.Item().Text(t => { t.Span("Study Date: ").SemiBold(); t.Span($"{scan.UploadedAt:MMM dd, yyyy HH:mm}"); });
                        col.Item().Text(t => { t.Span("Referring Dr: ").SemiBold(); t.Span(doctor?.FullName ?? "N/A"); });
                    });
                });

                column.Item().PaddingVertical(15).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                // 2. Clinical Indication & Notes
                column.Item().Text("CLINICAL INDICATION:").FontSize(11).SemiBold().FontColor(Colors.Blue.Darken3);
                column.Item().PaddingBottom(15).Text(string.IsNullOrEmpty(scan.Notes) ? "Routine screening / AI pre-read evaluation." : scan.Notes);

                // 3. AI Analysis Results (Visual Progress Bars)
                column.Item().Text("AI PREDICTIVE ANALYSIS:").FontSize(11).SemiBold().FontColor(Colors.Blue.Darken3);
                column.Item().PaddingBottom(5).Text("The chest radiograph was analyzed using the BreathWise deep learning algorithm. The following probability scores indicate the likelihood of specific pathophysiological findings:").FontSize(9).FontColor(Colors.Grey.Darken2);
                
                if (scan.Result != null)
                {
                    column.Item().PaddingBottom(15).Column(col => 
                    {
                        DrawConditionBar(col, "No Finding", scan.Result.NoFinding, true);
                        DrawConditionBar(col, "Pneumonia", scan.Result.Pneumonia);
                        DrawConditionBar(col, "Pleural Effusion", scan.Result.Effusion);
                        DrawConditionBar(col, "Cardiomegaly", scan.Result.Cardiomegaly);
                        DrawConditionBar(col, "Pneumothorax", scan.Result.Pneumothorax);
                    });
                }

                // 4. Dynamic Impression
                column.Item().Text("IMPRESSION:").FontSize(11).SemiBold().FontColor(Colors.Blue.Darken3);
                column.Item().PaddingBottom(15).Text(GenerateImpressionText(scan.Result));

                // 5. Images Section
                column.Item().Text("ATTACHED IMAGES:").FontSize(11).SemiBold().FontColor(Colors.Blue.Darken3);
                column.Item().PaddingTop(5).Row(row =>
                {
                    var webRoot = _env.WebRootPath ?? "wwwroot";
                    
                    var origPath = scan.ImagePath.StartsWith("/") ? scan.ImagePath.Substring(1) : scan.ImagePath;
                    var fullOrigPath = Path.Combine(webRoot, origPath);

                    if (File.Exists(fullOrigPath))
                    {
                        row.RelativeItem().PaddingRight(10).Column(col => 
                        {
                            col.Item().Border(1).BorderColor(Colors.Grey.Medium).Image(fullOrigPath);
                            col.Item().PaddingTop(5).Text("Fig 1: Original Radiograph").AlignCenter().FontSize(9).Italic();
                        });
                    }

                    if (scan.Result != null && !string.IsNullOrEmpty(scan.Result.HeatmapPath))
                    {
                        var heatPath = scan.Result.HeatmapPath.StartsWith("/") ? scan.Result.HeatmapPath.Substring(1) : scan.Result.HeatmapPath;
                        var fullHeatPath = Path.Combine(webRoot, heatPath);
                        if (File.Exists(fullHeatPath))
                        {
                            row.RelativeItem().PaddingLeft(10).Column(col => 
                            {
                                col.Item().Border(1).BorderColor(Colors.Grey.Medium).Image(fullHeatPath);
                                col.Item().PaddingTop(5).Text("Fig 2: AI Grad-CAM Heatmap Overlay").AlignCenter().FontSize(9).Italic();
                            });
                        }
                    }
                });

                // 6. Signatures
                column.Item().PaddingTop(40).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().LineHorizontal(1).LineColor(Colors.Black);
                        col.Item().PaddingTop(5).Text(doctor?.FullName != null ? $"Dr. {doctor.FullName}" : "Reviewing Physician").SemiBold();
                        col.Item().Text("Electronically Signed").FontSize(9).FontColor(Colors.Grey.Darken1);
                    });
                    row.ConstantItem(150); // empty space
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().LineHorizontal(1).LineColor(Colors.Black);
                        col.Item().PaddingTop(5).Text("BreathWise Automated System").SemiBold();
                        col.Item().Text("Deep Learning Algorithm").FontSize(9).FontColor(Colors.Grey.Darken1);
                    });
                });
            });
        }

        private void DrawConditionBar(ColumnDescriptor col, string name, double score, bool isNoFinding = false)
        {
            float percent = (float)(score * 100);
            float barFill = Math.Max(0.5f, percent);
            float barEmpty = Math.Max(0.5f, 100f - percent);

            // Determine color
            string color = Colors.Green.Medium;
            if (!isNoFinding)
            {
                if (percent > 60) color = Colors.Red.Medium;
                else if (percent > 30) color = Colors.Orange.Medium;
                else color = Colors.Grey.Darken1;
            }
            else
            {
                color = percent > 50 ? Colors.Green.Medium : Colors.Grey.Darken1;
            }

            col.Item().PaddingBottom(8).Row(row => 
            {
                row.ConstantItem(120).Text(name).SemiBold().FontSize(10);
                
                row.RelativeItem().AlignMiddle().Height(8).Background(Colors.Grey.Lighten3).Row(barRow => 
                {
                    barRow.RelativeItem(barFill).Background(color);
                    barRow.RelativeItem(barEmpty);
                });

                row.ConstantItem(45).AlignRight().Text($"{percent:F1}%").FontSize(10).SemiBold().FontColor(color);
            });
        }

        private string GenerateImpressionText(ScanResult? result)
        {
            if (result == null) return "No AI analysis data available.";

            var diseases = new[]
            {
                new { Name = "Pneumonia", Score = result.Pneumonia },
                new { Name = "Pleural Effusion", Score = result.Effusion },
                new { Name = "Cardiomegaly", Score = result.Cardiomegaly },
                new { Name = "Pneumothorax", Score = result.Pneumothorax }
            };

            var topDisease = diseases.OrderByDescending(d => d.Score).First();

            if (result.NoFinding > 0.6 && topDisease.Score < 0.4)
            {
                return "1. No acute cardiopulmonary process identified.\n" +
                       "2. Lungs are clear without focal consolidation, effusion, or pneumothorax.\n" +
                       "3. Heart size appears within normal limits.";
            }

            if (topDisease.Score > 0.6)
            {
                return $"1. The AI algorithm indicates a high probability ({topDisease.Score*100:F1}%) of {topDisease.Name}. Clinical correlation is strongly recommended.\n" +
                       $"2. Please refer to the Grad-CAM heatmap (Fig 2) for localization of the suspected pathophysiological regions.\n" +
                       $"3. Other evaluated conditions demonstrated lower predictive probabilities.";
            }

            if (topDisease.Score > 0.3)
            {
                return $"1. Mildly elevated predictive score for {topDisease.Name} ({topDisease.Score*100:F1}%). This may be an early/subtle finding or artifact.\n" +
                       "2. Recommend radiologist over-read and clinical correlation.\n" +
                       "3. No other dominant acute abnormalities detected.";
            }

            return "1. Indeterminate AI findings. No dominant pathology strongly identified.\n" +
                   "2. Manual radiological review is required to rule out subtle acute or chronic processes.";
        }

        private void ComposeFooter(IContainer container)
        {
            container.PaddingTop(10).Row(row =>
            {
                row.RelativeItem().DefaultTextStyle(x => x.FontSize(8).FontColor(Colors.Grey.Medium)).Text(x =>
                {
                    x.Span("Disclaimer: ").Bold();
                    x.Span("This report is generated with the assistance of an Artificial Intelligence algorithm. It is intended to assist, not replace, clinical judgment by a qualified healthcare professional.");
                });

                row.ConstantItem(80).AlignRight().DefaultTextStyle(x => x.FontSize(9).FontColor(Colors.Grey.Medium)).Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        }
    }
}
