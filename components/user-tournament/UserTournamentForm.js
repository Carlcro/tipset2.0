import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "react-query";
import { createUserTournament } from "../../services/userTournamentService";
import { motion } from "framer-motion";
import Container from "../Container";
import SubmitButton from "../SubmitButton";

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
    >
      <Container classNames="mb-5">
        <div className="text-sm mb-3">
          {`För att göra det lättare att följa ställningen mellan familj och
          vänner kan du skapa en grupp för just er. Det gör du genom att skriva
          in ett gruppnamn här och sedan och klicka på 'skapa grupp'.`}
        </div>
        <div className="font-bold mb-1">Namnge din grupp</div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            onChange={({ target }) => setUserTournamentName(target.value)}
            type="text"
            value={userTournamentName}
            className="rounded-sm mb-3 border border-polarNight px-2 py-1.5 w-full"
          ></input>
          <SubmitButton>Skapa grupp</SubmitButton>
        </form>
      </Container>
    </motion.div>
  );
};

UserTournamentForm.propTypes = {
  createUserTournament: PropTypes.func,
};

export default UserTournamentForm;
