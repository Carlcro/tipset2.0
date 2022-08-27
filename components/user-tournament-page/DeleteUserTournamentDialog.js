import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  deleteUserTournament,
  leaveUserTournament,
} from "../../services/userTournamentService";
import { useRouter } from "next/router";

export default function DeleteUserTournamentDialog({
  isOpen,
  setIsOpen,
  isOwner,
}) {
  const router = useRouter();
  const { id } = router.query;
  const exitUserTournament = async () => {
    await leaveUserTournament(id);
    router.push("/");
  };

  const removeUserTournament = async () => {
    await deleteUserTournament(id);
    router.push("/");
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        className="fixed z-10 inset-0 overflow-y-auto"
        static
        open={true}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-20" />
          <div className="bg-white z-10 border border-black p-5 shadow-lg rounded max-w-sm mx-auto">
            <Dialog.Description>
              {`Är du säker på att du vill ${
                true ? "radera gruppen?" : "lämna gruppen?"
              }`}
            </Dialog.Description>
            <div className="flex justify-between mt-3">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() =>
                  true ? removeUserTournament() : exitUserTournament()
                }
              >
                {`${true ? "Radera" : "Lämna"}`}
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => setIsOpen(false)}
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
