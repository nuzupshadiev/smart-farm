"use client";
import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUserContext } from "@/utils/user-context";
import User from "@/src/API/user";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const { setUser } = useUserContext();
  const handleLogin = React.useCallback(() => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill all the fields to continue");

      return;
    }
    User.login({ email, password })
      .then((resp) => {
        if (resp.token) {
          setErrorMessage("");
          setUser(resp);
          router.push("/plants");
        }
      })
      .catch(() => {
        setErrorMessage("Invalid email or password");
      });
  }, [email, password, setUser]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col max-w-[500px] md:w-[500px] gap-4 px-14 items-center h-full justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Welcome back to</h1>
          <p className="text-primary text-4xl font-semibold py-1 mb-3">
            Smart Farm
          </p>
        </div>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          variant="underlined"
          onValueChange={setEmail}
        />
        <Input
          label={"Password"}
          type="password"
          value={password}
          variant="underlined"
          onValueChange={setPassword}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs text-start w-full">
            {errorMessage}
          </p>
        )}
        <Button fullWidth onPress={handleLogin}>
          Login
        </Button>
        <div className="flex justify-center items-center gap-1">
          <p>{"Don't have an account yet? "}</p>
          <Link className="text-primary" href="/register">
            {"Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
