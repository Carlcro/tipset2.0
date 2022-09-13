import React from "react";
import { forwardRef } from "react";

import { Menu } from "@headlessui/react";
import Link from "next/link";
import LoginButton from "./login-button";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { getUser } from "../services/userService";

const MyLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

MyLink.displayName = "MyLink";

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
            {({ active, hover }) => (
              <MyLink
                className={`${
                  active && "bg-blue-500"
                } flex items-center px-4 py-2 text-sm`}
                href={item.route}
              >
                {item.name}
              </MyLink>
            )}
          </Menu.Item>
        ))}
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
  const { data: session, status } = useSession();

  const { data: user } = useQuery(
    "user",
    async () => {
      const { data } = await getUser();
      return data;
    },
    { staleTime: Infinity, enabled: status === "authenticated" }
  );

  return (
    <nav
      className="border-b border-black p-3 mb-4 flex justify-end sm:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      <BurgerMenu></BurgerMenu>
      <div className="hidden sm:flex sm:justify-between w-full">
        <div className="space-x-4">
          <Link href="/">
            <a>Hem</a>
          </Link>
          <>
            <Link href="/user-tournament">Grupper</Link>
            <Link href="/bet-slip">
              <a>{"Gör ditt tips"}</a>
            </Link>
          </>
          <Link href="/championship">
            <a>Mästerskap</a>
          </Link>
          <Link href="/point-system">
            <a>Poängsystem</a>
          </Link>
          <Link href="/answer-sheet">
            <a>Answer Sheet</a>
          </Link>
          <LoginButton></LoginButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
