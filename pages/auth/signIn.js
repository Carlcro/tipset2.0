import { useState } from "react";
import { useMutation } from "react-query";
import { signUpUser } from "../../services/authService";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [password, setPassword] = useState("");
  const mutation = useMutation(signUpUser);

  const handleOnSubmit = () => {
    mutation.mutate({
      email,
      password,
      firstName,
      lastName,
    });
  };

  return (
    <form onSubmit={handleOnSubmit} className="flex flex-col space-y-2 w-60">
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        value={email}
        placeholder="email"
      />
      <input
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
        value={firstName}
        placeholder="Förnamn"
      />
      <input
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        value={lastName}
        placeholder="Efternamn"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
        placeholder="Lösenord"
      />
      <button>Sign in</button>
    </form>
  );
};

export default SignUpForm;
