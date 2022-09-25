import http from "./httpService";

interface ISignUpForm {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
}

export function signUpUser(user: ISignUpForm) {
  return http.post("/api/auth/signup", { ...user });
}
