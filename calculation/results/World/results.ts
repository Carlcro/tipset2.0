import {
  calculateResults,
  getGroupResults,
  getGroupScores,
  getScores,
} from "../common";
import { GroupResult } from "../groupResult";
import { Team } from "../../types/team";
import { RawMatchResult } from "../../types/rawMatchResult";
import { MatchGroup } from "../../types/matchGroup";

export function calculateGroupResults(
  results: RawMatchResult[],
  matchGroups: MatchGroup[]
): GroupResult[] {
  const scores = getScores(results, 1, 48);
  const groupScores = matchGroups.map(getGroupScores(scores));
  return groupScores.map(getGroupResults());
}

export function calculateGroupOf16Results(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 49, 56);
}

export function calculateGroupOf8Results(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 57, 60);
}

export function calculateSemiFinalsResults(results: RawMatchResult[]): Team[] {
  return calculateResults(results, 61, 62);
}
