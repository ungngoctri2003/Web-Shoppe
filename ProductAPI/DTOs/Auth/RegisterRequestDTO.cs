using System.ComponentModel.DataAnnotations;
using ProductAPI.Constant;

public class RegisterRequestDTO
{
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(Constants.PasswordMinLength, ErrorMessage = Constants.PasswordMinLengthMessage)]
    public string Password { get; set; }

    public string? Username { get; set; }

    public string? FullName { get; set; }

    [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string Phone { get; set; }

    public string? Avatar { get; set; }
}
