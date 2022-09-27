import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromGroup } from "../../recoil/bet-slip/selectors/selectors";
import { motion } from "framer-motion";

export default function Group({ groupResult, groupName }) {
  const points = useRecoilValue(getPointsFromGroup(groupName));

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      className="shadow-lg rounded-sm m-2 px-4 py-2 bg-white"
    >
      <table className="table-fixed">
        <thead>
          <tr>
            <th className="text-left pl-2">{groupName}</th>
            <th>S</th>
            <th>V</th>
            <th>F</th>
            <th>O</th>
            <th className="hidden md:inline">GM</th>
            <th className="hidden md:inline">IM</th>
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
              <td className="px-2 hidden md:inline">{gr.goals}</td>
              <td className="px-2 hidden md:inline">{gr.conceded}</td>
              <td className="px-2">{gr.diff}</td>
              <td className="px-2">{gr.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {points !== null ? (
        <div className="border-t border-black mx-2 flex justify-between">
          <span>Poäng från grupp</span>
          <span>{points}</span>
        </div>
      ) : (
        <div />
      )}
    </motion.div>
  );
}
