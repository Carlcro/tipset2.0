import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createUser } from "../../services/userService";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/router";
import Container from "../../components/Container";
import SubmitButton from "../../components/SubmitButton";

export default function UserContainer() {
  const [missingNameError, setMissingNameError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      router.push("/user-tournament");
    },
  });

  if (status === "loading") {
    return (
      <div className="h-screen grid place-items-center">
        <Spinner width={60} height={60} />
      </div>
    );
  }

  return (
    <Container classNames="mx-auto w-72 p-7 mt-20">
      <h2>Byt namn</h2>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          if (!data.firstName || !data.lastName) {
            setMissingNameError("Du måste ha ett namn");
          } else {
            setMissingNameError("Du kan inte längre byta namn");

            // mutate({ ...data, email: session.user.email });
          }
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
        <p className="text-auroraRed">{missingNameError}</p>
        <SubmitButton type="submit">Spara</SubmitButton>
      </form>
    </Container>
  );
}
