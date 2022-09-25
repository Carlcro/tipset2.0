import { useSession, signIn, signOut } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex space-x-2">
        Signed in as {session.user.email} <br />
        <button
          className="bg-red-400 border-black border-1 text-sm px-2 py-2 text-white"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
