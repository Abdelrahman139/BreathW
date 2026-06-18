using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XRayAPI.DTOs.Auth;
using XRayAPI.Models;
using XRayAPI.Services;

namespace XRayAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingUser = await _authService.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Role = request.Role,
                PasswordHash = _authService.HashPassword(request.Password)
            };

            await _authService.CreateUserAsync(user);

            // If patient, we could automatically create a Patient record here too
            // But we will handle that in PatientsController for simplicity or later.

            var token = _authService.GenerateJwtToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserDto { Id = user.Id, FullName = user.FullName, Email = user.Email, Role = user.Role }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.GetUserByEmailAsync(request.Email);
            if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _authService.GenerateJwtToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserDto { Id = user.Id, FullName = user.FullName, Email = user.Email, Role = user.Role }
            });
        }

        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !System.Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();

            // Check if email is being changed and if it's already taken
            if (user.Email != request.Email)
            {
                var existingUser = await _authService.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                    return BadRequest(new { message = "Email already in use" });
            }

            user.FullName = request.FullName;
            user.Email = request.Email;

            await _authService.UpdateUserAsync(user);

            var token = _authService.GenerateJwtToken(user); // Generate new token because claims might change

            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserDto { Id = user.Id, FullName = user.FullName, Email = user.Email, Role = user.Role }
            });
        }

        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !System.Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();

            if (!_authService.VerifyPassword(request.OldPassword, user.PasswordHash))
                return BadRequest(new { message = "Incorrect current password" });

            user.PasswordHash = _authService.HashPassword(request.NewPassword);
            await _authService.UpdateUserAsync(user);

            return Ok(new { message = "Password updated successfully" });
        }
    }
}
