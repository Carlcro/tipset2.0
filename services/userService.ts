import http from "./httpService";

interface IUser {
  userId: String;
  firstName: String;
  lastName: String;
  email: String;
}

export function getUser() {
  return mockUserResponse();
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

const mockUser = {
  firstName: "Carl",
  lastName: "Cronsioe",
};

const mockUserResponse = () => Promise.resolve(mockUser);
