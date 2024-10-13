"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { account, loginWithGoogle } from "@/app/appwrite";

type Props = {};

const Login = (props: Props) => {
    const handleLogin = () => {
        loginWithGoogle();
      };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} variant={"outline"}>
            Login via{" "}
            <span className="ml-2">
              {" "}
              <FaGoogle />
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
