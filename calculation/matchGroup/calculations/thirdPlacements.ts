import { MatchResult } from "./../../matchResult";
import { GroupResult } from "../../results/groupResult";
import { TeamResult } from "../../teamResult";
import { calculateTeamRanking } from "./calculations";
import {
  getKnockoutPhaseGroups,
  mapKnockoutPhaseLineup,
} from "./knockoutPhase";
import { MatchGroup } from "../../matchGroup";
import { Team } from "../../team";

export function getBestOfThirds(
  groupResults: GroupResult[],
  matches: MatchResult[]
): Team[] {
  const thirds = calculateTopFourThirdPlaces(groupResults, matches);
  const groups = getThirdPlaceGroups(thirds);
  const knockoutPhaseLineup = mapKnockoutPhaseLineup(groups);
  return getKnockoutPhaseGroups(knockoutPhaseLineup, thirds);
}

export function getThirdPlaceGroups(teamResults: TeamResult[]): string[] {
  return teamResults.map((result) => result.team.group);
}

export function calculateTopFourThirdPlaces(
  groupResults: GroupResult[],
  matches: MatchResult[]
): TeamResult[] {
  const thirds = calculateThirdPlaces(groupResults, matches);
  return calculateTeamRanking(thirds, []).slice(0, 4);
}

export function calculateThirdPlaces(
  groupResults: GroupResult[],
  matches: MatchResult[]
): TeamResult[] {
  return groupResults.map((gr) => calculateThirdPlace(gr.results, matches));
}

export function calculateThirdPlace(
  teamResults: TeamResult[],
  matches: MatchResult[]
): TeamResult {
  return calculateTeamRanking(teamResults, matches)[2];
}

export function calculateThirdPlaceGroups(
  groupResults: GroupResult[]
): MatchGroup[] {
  return [];
}
