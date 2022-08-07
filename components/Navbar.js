import React from "react";

import { Menu } from "@headlessui/react";
import Link from "next/link";
import LoginButton from "./login-button";
function BurgerMenu({ user }) {
  return (
    <Menu as="div" className="relative sm:hidden">
      <Menu.Button className="inline-flex justify-center w-full rounded border border-gray-300 shadow-lg px-4 py-2 bg-white text-sm font-medium text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Menu.Button>
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
        {routesLoggedIn(user).map((item) => (
          <Menu.Item key={item.name}>
            {({ active }) => (
              <Link
                className={`${
                  active && "bg-blue-500"
                } flex items-center px-4 py-2 text-sm`}
                href={item.route}
              >
                <a>{item.name}</a>
              </Link>
            )}
          </Menu.Item>
        ))}
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active && "bg-blue-500"
              } flex items-center px-4 py-2 text-sm w-full`}
            >
              Logga ut
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

const routesLoggedIn = (user) => [
  { name: "Hem", route: "/" },
  { name: "Grupper", route: "/user-tournament" },
  {
    name: user && user.betSlip ? "Ditt tips" : "Gör ditt tips",
    route: "/bet-slip",
  },
  { name: "Poängsystem", route: "/point-system" },
  { name: "Mästerskapet", route: "/championship" },
];

const Navbar = () => {
  const { isAuthenticated, authUser } = {
    isAuthenticated: true,
    authUser: { id: 123 },
  };

  /* const { data: user } = useQuery(
    "user",
    async () => {
      const { data } = await getUser();
      return data;
    },
    { staleTime: Infinity, enabled: authUser }
  ); */

  return (
    <nav
      className="transparent border-b border-black p-3 mb-4 flex justify-end sm:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="hidden sm:flex sm:justify-between w-full">
        <div className="space-x-4">
          <Link className="mx-2" href="/">
            <a>Hem</a>
          </Link>
          <>
            <Link className="mx-2" href="/user-tournament">
              Grupper
            </Link>
            <Link className="mx-2" href="/bet-slip">
              <a>{"Gör ditt tips"}</a>
            </Link>
          </>
          <Link className="mx-2" href="/championship">
            <a>Mästerskap</a>
          </Link>
          <Link className="mx-2" href="/point-system">
            <a>Poängsystem</a>
          </Link>
          <Link className="mx-2" href="/answer-sheet">
            <a>Answer Sheet</a>
          </Link>
        </div>
        <div>
          <LoginButton></LoginButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
