import http from "./httpService";

interface IUser {
  firstName: String;
  lastName: String;
  email: String;
}

export function getUser() {
  return http.get("/api/users");
}

export function createUser(user: IUser) {
  return http.post("/api/users", { ...user });
}

export function updateUserName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return http.put("/api/users", { firstName, lastName });
}

