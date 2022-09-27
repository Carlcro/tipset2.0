import React, { useEffect } from "react";
import { forwardRef } from "react";

import { Menu } from "@headlessui/react";
import Link from "next/link";
import LoginButton from "./login-button";
import { useQuery } from "react-query";
import { signOut, useSession } from "next-auth/react";
import { getUser } from "../services/userService";
import { useRouter } from "next/router";

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
        {user ? (
          routesLoggedIn(user).map((item) => (
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
          ))
        ) : (
          <Menu.Item>
            {({ active, hover }) => (
              <MyLink
                className={`${
                  active && "bg-blue-500"
                } flex items-center px-4 py-2 text-sm`}
                href={"/"}
              >
                Hem
              </MyLink>
            )}
          </Menu.Item>
        )}
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
  { name: "Byt namn", route: "/user" },
];

const Navbar = () => {
  const { status, data } = useSession();
  const router = useRouter();

  const { data: user } = useQuery(
    ["user"],
    async () => {
      const { data } = await getUser();
      return data;
    },
    { enabled: status === "authenticated" }
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated" && user && !user.firstName) {
      router.push("/user");
    }
  }, [user, router, status]);

  if (status === "loading") {
    return null;
  }

  return (
    <nav
      className=" p-3 mb-4 flex justify-between sm:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      {user && (
        <>
          <div className="flex-1 mr-5 space-x-3  sm:hidden">
            <button
              className="bg-red-400 border-black border-1 text-sm px-2 py-2 text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logga ut
            </button>
            <span>{data.user.email}</span>
          </div>

          <BurgerMenu user={user} />
        </>
      )}

      <div className="hidden sm:flex sm:justify-between w-full">
        {status === "authenticated" ? (
          <div className="flex gap-4 flex-1">
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
            <Link href="/user">
              <a>Byt namn</a>
            </Link>

            <div className="text-right flex-1 mr-5">
              <button
                className="bg-red-400 border-black border-1 text-sm px-2 py-2 text-white"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logga ut
              </button>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
