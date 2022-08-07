import http from "./httpService";

export async function getOneChampionship() {
  const { data } = await http.get(`/api/championships`);
  return data;
}

export function saveAnswerSheet({
  answerSheet,
  password,
}: {
  answerSheet: any;
  password: string;
}) {
  return http.post(`/api/answer-sheet`, answerSheet, {
    headers: { password: password },
  });
}

export function getAnswerSheet() {
  return http.get(`/api/answer-sheet`);
}
