import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/user-tournament");
    }
  }, [router, status]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="min-h-screenflex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="flex flex-col items-center py-4">
            <h1 className="text-3xl">Hej!</h1>

            <h2 className="mt-2">Välkommen till Bröderna Duhlins VM-tips</h2>
          </div>

          <div className="px-5 py-7">
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              E-mail
            </label>
            <input
              placeholder="Skriv din email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />

            <button
              type="button"
              onClick={() => signIn("email", { email })}
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2"> Skapa konto/Logga in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
