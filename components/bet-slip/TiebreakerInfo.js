import React from "react";

function TiebreakerInfo() {
  const rules = [
    "Antal inspelade poäng sett till samtliga spelade gruppspelsmatcher",
    "Målskillnad sett till samtliga spelade gruppspelsmatcher",
    "Antal gjorda mål sett till samtliga spelade gruppspelsmatcher",
    "Antal inspelade poäng sett till matcherna mellan lagen i fråga",
    "Målskillnad sett till matcherna mellan lagen i fråga",
    "Antal gjorda mål sett till matcherna mellan lagen i fråga",
  ];

  return (
    <div className="bg-white shadow-lg rounded px-10 py-2 m-2">
      <h1 className="font-bold text-lg mb-2 -ml-5 ">
        Tiebreakers i gruppspelet
      </h1>
      <ol className="list-decimal space-y-2">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ol>
      <div className="-ml-5 mt-2 italic">
        OBS! Tipset tar inte hänsyn till rangordning utöver ovanstående
        kriterier. Vid tippning där lag fortfarande inte kan särskiljas efter
        kriterier 1-6 kommer alfabetisk ordning avgöra.
      </div>
    </div>
  );
}

export default TiebreakerInfo;
/*



1. Antal inspelade poäng sett till samtliga spelade gruppspelsmatcher;
2. Målskillnad sett till samtliga spelade gruppspelsmatcher;
3. Antal gjorda mål sett till samtliga spelade gruppspelsmatcher;
4. Antal inspelade poäng sett till matcherna mellan lagen i fråga;
5. Målskillnad sett till matcherna mellan lagen i fråga;
6. Antal gjorda mål sett till matcherna mellan lagen i fråga;

*/
