import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { joinUserTournament } from "../../../services/userTournamentService";

export default function Join() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const join = async () => {
      console.log("ID!!", router.query);
      try {
        await joinUserTournament(id);
        router.push(`/user-tournament-page/${id}`);
      } catch (error) {
        toast.error("Nått fel händer");
      }
    };
    if (id) {
      join();
    }
  }, [id, router]);

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-sm px-12 py-5 flex flex-col">
        <span>Du skickas snart till din grupp...</span>
        <Link href={`/user-tournament-page/${id}`}>
          <a className="mt-6 text-blue-700">Klicka här om du inte blir det</a>
        </Link>
      </div>
    </div>
  );
}
