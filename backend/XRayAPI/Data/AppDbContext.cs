using Microsoft.EntityFrameworkCore;
using XRayAPI.Models;

namespace XRayAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Scan> Scans { get; set; }
        public DbSet<ScanResult> ScanResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Email is Unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // One-to-one relationship between Scan and ScanResult
            modelBuilder.Entity<Scan>()
                .HasOne(s => s.Result)
                .WithOne(r => r.Scan)
                .HasForeignKey<ScanResult>(r => r.ScanId);
        }
    }
}
