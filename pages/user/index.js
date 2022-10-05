import { useSession } from "next-auth/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { createUser } from "../../services/userService";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/router";

export default function UserContainer() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutate } = useMutation(createUser, {
    onSuccess: () => {
      router.push("/user-tournament");
    },
  });

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="mx-auto w-72 bg-white rounded-sm p-7 mt-20">
      <h2>Vad heter du?</h2>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          mutate({ ...data, email: session.user.email });
        }}
      >
        <input
          className="border border-black p-1"
          type="text"
          placeholder="Förnamn"
          name="firstName"
        ></input>
        <input
          className="border border-black p-1"
          type="text"
          placeholder="Efternamn"
          name="lastName"
        ></input>

        <button
          className="bg-blue-500 rounded-md text-white px-2 py-2"
          type="submit"
        >
          Spara
        </button>
      </form>
    </div>
  );
}
