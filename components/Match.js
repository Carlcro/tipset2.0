import React from "react";
import GoalInput from "./GoalInput";
import { format, addHours } from "date-fns";
import {
  getMatchDrawState,
  getMatchState,
  setMatchState,
} from "../recoil/bet-slip/selectors/selectors";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { flags } from "../utils/flags";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

polyfillCountryFlagEmojis();

const Match = ({ match, matchInfo, finalsStage, mode }) => {
  const { team1, team2, matchId } = match;
  const { arena, city, time } = matchInfo;

  const matchScore = useRecoilValue(getMatchState(matchId));
  const draw = useRecoilValue(getMatchDrawState(matchId));
  const setScore = useSetRecoilState(setMatchState);

  const handleTeam1Score = (score) => {
    setScore({
      matchId,
      team1Score: score === "" ? "" : Number(score),
      team2Score:
        matchScore.team2Score === "" ? "" : Number(matchScore.team2Score),
      team1: team1,
      team2: team2,
    });
  };

  const handleTeam2Score = (score) => {
    setScore({
      matchId,
      team1Score:
        matchScore.team1Score === "" ? "" : Number(matchScore.team1Score),
      team2Score: score === "" ? "" : Number(score),
      team1: team1,
      team2: team2,
    });
  };

  const handlePenaltyWinner =
    (team) =>
    ({ target }) => {
      setScore({
        matchId,
        team1Score: Number(matchScore.team1Score),
        team2Score: Number(matchScore.team2Score),
        team1: team1,
        team2: team2,
        penaltyWinner: team,
      });
    };

  const determineWinner = (team) => {
    const { team1Score, team2Score } = matchScore;

    if (team1Score === "" || team2Score === "") {
      return null;
    }

    const score1 = Number(team1Score);
    const score2 = Number(team2Score);

    if (team === 1) {
      if (score1 > score2) {
        return "text-blue-600 font-bold";
      } else if (score1 < score2) {
        return "text-red-600 font-light";
      } else if (score1 === score2) {
        return "text-gray-600 italic";
      }
    } else if (team === 2) {
      if (score2 > score1) {
        return "text-blue-600 font-bold";
      } else if (score2 < score1) {
        return "text-red-600 font-light";
      } else if (score1 === score2) {
        return "text-gray-600 italic";
      }
    }
    return "";
  };
  const team1Style = determineWinner(1);
  const team2Style = determineWinner(2);

  return (
    <div
      className={
        mode === "placedBet"
          ? finalsStage
            ? "mb-1 grid grid-cols-[minmax(75px,_1fr)_90px_70px_minmax(70px,_1fr)_20px] md:grid-cols-[85px_110px_90px_110px_100px_15px] lg:grid-cols-[100px_150px_90px_90px_150px_50px_1fr]"
            : "mb-1 grid grid-cols-[minmax(90px,_1fr)_120px_minmax(90px,_1fr)_30px] md:grid-cols-[90px_minmax(110px,_1fr)_110px_minmax(110px,_1fr)_40px] lg:grid-cols-[100px_repeat(3,_130px)_80px_1fr]"
          : finalsStage
          ? "mb-1 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-[100px_150px_90px_90px_150px_1fr]"
          : "mb-1 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[100px_repeat(3,_160px)_1fr]"
      }
    >
      <div className="hidden md:flex md:flex-col items-center justify-center">
        <span>{format(addHours(new Date(time), 0), "dd/M H:mm")}</span>
      </div>
      <div
        className={`text-sm md:text-base flex items-center truncate justify-end px-2`}
      >
        <span className={`truncate ${team1Style}`}>{team1.name}</span>
        <span className="ml-2 text-xl xs:flex">{flags[team1.name]}</span>
      </div>
      <div className={`flex justify-center ${finalsStage && "col-span-2"}`}>
        <div
          className={`grid place-items-center ${
            finalsStage && draw ? "" : "invisible"
          }`}
        >
          <input
            checked={
              matchScore.penaltyWinner
                ? matchScore.penaltyWinner._id === team1._id
                : false
            }
            disabled={mode === "placedBet"}
            onChange={handlePenaltyWinner(team1)}
            type="checkbox"
          />
        </div>
        <div className="flex items-center justify-center">
          <GoalInput
            teamScore={matchScore.team1Score}
            setTeamScore={handleTeam1Score}
            mode={mode}
          />
        </div>
        <div className="flex justify-center items-center">-</div>
        <div className="flex items-center justify-center">
          <GoalInput
            teamScore={matchScore.team2Score}
            setTeamScore={handleTeam2Score}
            mode={mode}
          />
        </div>
        <div
          className={`grid place-items-center ${
            finalsStage && draw ? "" : "invisible"
          }`}
        >
          <input
            checked={
              matchScore.penaltyWinner
                ? matchScore.penaltyWinner._id === team2._id
                : false
            }
            disabled={mode === "placedBet"}
            onChange={handlePenaltyWinner(team2)}
            type="checkbox"
          />
        </div>
      </div>

      <div
        className={`text-sm md:text-base truncate flex items-center justify-start px-2`}
      >
        <span className="mr-2 text-xl xs:flex">{flags[team2.name]}</span>

        <span className={`truncate ${team2Style}`}>{team2.name}</span>
      </div>
      {mode === "placedBet" && (
        <div className="text-center">{matchScore.points}</div>
      )}
      <div className="hidden lg:flex flex-col truncate">
        <span className="truncate">
          {city}, {arena}
        </span>
      </div>
    </div>
  );
};

export default Match;
