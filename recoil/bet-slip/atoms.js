import { atom } from "recoil";

export const betSlipState = atom({
  key: "betSlipState",
  default: [],
});

export const pointsFromGroupState = atom({
  key: "pointsFromGroup",
  default: [],
});

export const pointsFromAdvancementState = atom({
  key: "pointsFromAdvancement",
  default: [],
});

export const pointsFromGoalscorerState = atom({
  key: "pointsFromGoalscorer",
  default: null,
});

export const goalscorerState = atom({
  key: "goalsScorerState",
  default: null,
});
