"use client";

import React from "react";
import { ThemeChanger } from "./ThemeChanger";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

type Props = {};

const Navbar = (props: Props) => {
  const { data: session } = useSession();
  return (
    <div className="w-full flex justify-end items-center gap-4 px-4 h-16 border-b shadow-md">
      {session ? (
        <Button onClick={() => signOut()} className="btn">
          <LogOutIcon className="size-5 mr-2" /> Logout
        </Button>
      ) : (
        <Button onClick={() => signIn()} className="btn">
          Login
        </Button>
      )}
      <ThemeChanger />
    </div>
  );
};

export default Navbar;
