import { useState } from "react";
import SubmitButton from "../SubmitButton";

const AddMemberInput = ({ addMember }) => {
  const [memberInput, setMemberInput] = useState("");

  const handleAddMember = (event) => {
    event.preventDefault();
    addMember(memberInput);
    setMemberInput("");
  };

  return (
    <div>
      <h3 className="font-semibold">Lägg till ny medlem</h3>
      <div>
        <form onSubmit={handleAddMember}>
          <input
            className="h-8 w-full rounded-sm mt-1 p-2 border border-black"
            type="text"
            placeholder="E-postadress"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <SubmitButton>Lägg till</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default AddMemberInput;
