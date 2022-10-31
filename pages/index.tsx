import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getUser } from "../services/userService";
import Container from "../components/Container";
import SubmitButton from "../components/SubmitButton";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const { status } = useSession();

  const { data: user } = useQuery(
    ["user"],
    async () => {
      const { data } = await getUser();
      return data;
    },
    { enabled: status === "authenticated" }
  );

  useEffect(() => {
    if (status === "authenticated") {
      if (user && !user.fullName) {
        router.push("/user");
      } else {
        router.push("/user-tournament");
      }
    }
  }, [router, status, user]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await signIn("email", { email });
      setEmailSent(true);
    } catch (error) {
      toast.error("Hoppsan, det blev något fel. Försök igen senare");
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen grid place-items-center">
        <Spinner width={60} height={60} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screenflex flex-col justify-center sm:py-12">
        <div className="p-4 xs:p-0 mx-auto md:w-full md:max-w-md">
          <Container classNames="w-full divide-y divide-gray-200">
            <div className="flex flex-col items-center py-4">
              <h1 className="text-3xl">Hej!</h1>

              <h2 className="mt-2">Välkommen till Bröderna Duhlins VM-tips</h2>
            </div>

            {emailSent ? (
              <div className="py-6 px-5 flex flex-col items-center space-y-3">
                <span> Email skickat!</span>
                <span> Följ länken i mailen för att logga in.</span>
              </div>
            ) : (
              <div className="px-5 py-7">
                <form className="flex flex-col items-center">
                  <label className="self-start font-semibold text-sm pb-1 block">
                    E-mail
                  </label>
                  <input
                    placeholder="Skriv din email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-sm px-3 py-2 mt-1 mb-5 text-sm w-full"
                  />

                  <SubmitButton type="submit" onClick={handleSubmit}>
                    <span className="inline-block mr-2">
                      Skapa konto/Logga in
                    </span>
                  </SubmitButton>
                </form>
              </div>
            )}
          </Container>
        </div>
      </div>
    );
  }

  return null;
};

export default Home;
