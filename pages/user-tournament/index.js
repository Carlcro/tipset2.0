import React from "react";
import UserTournamentForm from "./components/UserTournamentForm";
import UserTournamentsList from "./components/UserTournamentsList";

const UserTournamentContainer = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5">
      <div>
        <UserTournamentsList />
      </div>
      <div>
        <UserTournamentForm />
      </div>
    </div>
  );
};

export default UserTournamentContainer;
