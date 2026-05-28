import type { Rule } from 'antd/es/form';

/** Mật khẩu tối thiểu 6 ký tự */
export const passwordRules: Rule[] = [
  { required: true, message: 'Vui lòng nhập mật khẩu' },
  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
];

export const newPasswordRules: Rule[] = [
  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
];
