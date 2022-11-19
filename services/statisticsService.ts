import http from "./httpService";

export async function getMatchStatistics() {
  const { data } = await http.get(`/api/statistics/matchStatistics`);

  return data;
}
