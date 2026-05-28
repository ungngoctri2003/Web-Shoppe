using System.ComponentModel.DataAnnotations;
using ProductAPI.Constant;

namespace ProductAPI.DTOs.Auth
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(Constants.PasswordMinLength, ErrorMessage = Constants.PasswordMinLengthMessage)]
        public string Password { get; set; } = string.Empty;
    }
}
