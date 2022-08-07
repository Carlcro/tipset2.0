import http from "./httpService";

export function getConfiguration() {
  return http.get(`/api/configuration`);
}
