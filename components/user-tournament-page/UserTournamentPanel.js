import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addMember } from "../../services/userTournamentService";
import AddMemberInput from "./AddMemberInput";
import DeleteUserTournamentDialog from "./DeleteUserTournamentDialog";

const UserTournamentPanel = () => {
  const queryClient = useQueryClient();
  const [dialogIsOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const mutation = useMutation(addMember, {
    onSuccess: () => {
      queryClient.invalidateQueries("highscoreData");
    },
    onError: ({ response }) => console.error(response.data),
  });

  const handleAddMember = (email) => {
    mutation.mutate({ id, email });
  };

  return (
    <>
      <DeleteUserTournamentDialog
        isOpen={dialogIsOpen}
        setIsOpen={setIsDialogOpen}
      ></DeleteUserTournamentDialog>
      <div className="flex flex-col w-[400px]">
        <div className="space-y-2">
          <div className="shadow-lg p-3 rounded-sm bg-white">
            <div>
              <AddMemberInput addMember={handleAddMember} />
            </div>
          </div>
          <div className="shadow-md p-3 rounded-sm bg-white">
            För att bjuda in familj och vänner till den här gruppen behöver de
            klicka på länken du ser här nedanför. Klicka helt enkelt på länken
            för att kopiera den, och skicka den sedan till dem du vill bjuda in.
            T.ex. via SMS, mail eller Messenger.
            <span className="font-bold">
              {
                " OBS! Tänk på att de måste ha skapat ett konto innan de använder länken."
              }
            </span>
          </div>

          <div className="shadow-md p-3 rounded-sm bg-white flex flex-col">
            {/*       <span className="text-sm">
              {window && window.location.href + "/join"}
            </span>
            <button
              className="cursor-pointer font-bold text-left active:text-gray-500"
              onClick={() => {
                navigator.clipboard.writeText(
                  window && window.location.href + "/join"
                );
              }}
            >
              Klicka här för att kopiera
            </button> */}
          </div>
          <div>
            <button
              className="bg-red-500 text-white hover:bg-red-700 py-1 px-2 rounded-sm border border-black  "
              onClick={() => setIsDialogOpen(true)}
            >
              {`${true ? "Radera grupp" : "Lämna grupp"}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTournamentPanel;
