export interface ResetPasswordDTO {
  newPassword: string;
  confirmNewPassword: string;
  token: string;
}
