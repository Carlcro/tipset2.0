import http from "./httpService";

export function createUserTournament(name: string) {
  return http.post("/api/user-tournaments", { name });
}

export function getAllUserTournaments() {
  return http.get("/api/user-tournaments");
}

export function getUserTournament(id: string) {
  return http.get(`/api/user-tournaments/api/${id}`);
}

export function addMember({ id, email }: { id: string; email: string }) {
  return http.post(`/api/user-tournaments/${id}/members`, {
    email,
  });
}

export function kickMember({ id, email }: { id: string; email: string }) {
  return http.put(`/api/user-tournaments/${id}/members`, {
    email,
  });
}

export function leaveUserTournament(id: string) {
  return http.delete(`/api/user-tournaments/${id}`);
}

export function deleteUserTournament(id: string) {
  return http.delete(`/api/user-tournaments/${id}/admin`);
}

export function joinUserTournament(id: string) {
  return http.post(`/api/user-tournaments/${id}/join`);
}

export async function getHighscore(id: string) {
  const { data } = await http.get(`/api/user-tournaments/${id}/highscore`);
  return data;
}
