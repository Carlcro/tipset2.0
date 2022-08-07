import { useState } from "react";

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
          <button
            className="rounded-sm bg-blue-500 border border-black px-3 hover:bg-blue-600 active:bg-blue-700   py-1 text-white mt-2"
            type="submit"
          >
            Lägg till
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberInput;
