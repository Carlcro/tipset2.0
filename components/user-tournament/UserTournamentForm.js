import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "react-query";
import { createUserTournament } from "../../services/userTournamentService";
import { motion } from "framer-motion";

const UserTournamentForm = () => {
  const [userTournamentName, setUserTournamentName] = useState("");
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createUserTournament, {
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["userTournaments"], (old) => [...old, data]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(userTournamentName);
    setUserTournamentName("");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="shadow-lg rounded-sm p-3 bg-white"
    >
      <div>
        <div className="font-bold mb-1">Namnge din grupp</div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            onChange={({ target }) => setUserTournamentName(target.value)}
            type="text"
            value={userTournamentName}
            className="rounded-sm mb-3 border border-black px-2 py-1.5"
          ></input>
          <input
            className="rounded-sm bg-blue-500 px-3 py-2 mx-auto text-white"
            type="submit"
            value="Skapa grupp"
          />
        </form>
      </div>
    </motion.div>
  );
};

UserTournamentForm.propTypes = {
  createUserTournament: PropTypes.func,
};

export default UserTournamentForm;
