import React from "react";

export default function Group({ groupResult, groupName }) {
  return (
    <div className="shadow-lg rounded-sm m-2 w-full px-4 py-2 bg-white">
      <table className="table-fixed">
        <thead>
          <tr>
            <th className="text-left pl-2">{groupName}</th>
            <th>S</th>
            <th>V</th>
            <th>F</th>
            <th>O</th>
            <th>GM</th>
            <th>IM</th>
            <th>Diff</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          {groupResult.map((gr) => (
            <tr key={gr.team.name}>
              <td className="w-40 px-2">{gr.team.name}</td>
              <td className="px-2">{gr.played}</td>
              <td className="px-2">{gr.won}</td>
              <td className="px-2">{gr.lost}</td>
              <td className="px-2">{gr.draw}</td>
              <td className="px-2">{gr.goals}</td>
              <td className="px-2">{gr.conceded}</td>
              <td className="px-2">{gr.diff}</td>
              <td className="px-2">{gr.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
