import http from "./httpService";

export async function getConfig() {
  const { data } = await http.get(`/api/config`);

  return data;
}
