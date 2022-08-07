import React from "react";

function TiebreakerInfo() {
  return (
    <div className="bg-white shadow-lg rounded px-10 py-2 m-2 w-full">
      <h1 className="font-bold text-lg mb-2 -ml-5 ">
        Tiebreakers i gruppspelet
      </h1>
      <ol className="list-decimal space-y-2">
        <li>
          <span className="font-bold">Högre antal inspelade poäng,</span>
          (3p för vinst, 1p för oavgjort, 0p för förlust) i matcherna som
          spelats lagen emellan
        </li>
        <li>
          <span className="font-bold">Bättre målskillnad, </span>
          sett till matcherna som spelats lagen emellan
        </li>
        <li>
          <span className="font-bold">Fler gjorda mål, </span>
          sett till matcherna som spelats lagen emellan
        </li>
        <li>
          Om det, efter att ha applicerat kriterium 1-3, fortfarande finns lag
          med likadan ranking ska 1-3 återigen appliceras för dessa lag
          uteslutande. Om detta heller inte kan särskilja lagens ranking ska
          kriterium 5-10 appliceras
        </li>
        <li>
          <span className="font-bold">Bättre målskillnad </span>i samtliga
          gruppspelsmatcher
        </li>
        <li>
          <span className="font-bold">Fler gjorda mål </span>i samtliga
          gruppspelsmatcher
        </li>
      </ol>
      <div className="-ml-5 mt-2 italic">
        OBS! Tipset tar inte hänsyn till rangordning utöver ovanstående
        kriterier
      </div>
    </div>
  );
}

export default TiebreakerInfo;
