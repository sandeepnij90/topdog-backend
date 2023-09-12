interface RegisterUserEmailTemplate {
  verificationCode: string;
  userId: string;
}

export const registerUserEmailTemplate = ({
  userId,
  verificationCode,
}: RegisterUserEmailTemplate) => {
  return `
<h1>Congratuations you have successfully registered to dog app</h1>
<p>You must verify your account</p>
<a href="http://localhost:5000/auth/verify-email/${userId}?code=${verificationCode}">Click here to verify your account</a>
`;
};
