"use client";

import { FC, useState } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { Social } from "./social";
import { Session } from "next-auth";

interface AccountFormProps {
  mode?: "modal" | "redirect";
}

export const AccountForm: FC<AccountFormProps> = ({ mode = "modal" }) => {
  const [form, setForm] = useState(false);

  if (mode === "redirect") {
    redirect("/sign-in");
  }

  if (form) {
    return (
      // Register!
      <div>
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl tracking-wide text-sky-600 font-bold text-center mb-6">
            Register
          </h1>
        </div>
        <div className="flex flex-col">
          <RegisterForm />
        </div>
        <div>
          <Social />
        </div>
        <div className="flex justify-center items-center mt-8 gap-x-2">
          <h3 className="text-sm font-medium">Already have an account?</h3>
          <p
            className="text-sm font-medium text-blue-400/50 hover:border-b mb-1 border-b-blue-400/50 cursor-pointer"
            onClick={() => setForm((prevValue) => !prevValue)}
          >
            Sign in here!
          </p>
        </div>
      </div>
    );
  } else {
    return (
      // Sign In!
      <div className="mt-6">
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl tracking-wide text-sky-600 font-bold text-center mb-6">
            Sign In
          </h1>
        </div>
        <div className="flex flex-col">
          <LoginForm />
        </div>
        <div>
          <Social />
        </div>
        <div className="flex justify-center items-center mt-8 gap-x-2">
          <h3 className="text-sm font-medium">Create a new account?</h3>
          <p
            className="text-sm font-medium text-blue-400/50 hover:border-b mb-1 border-b-blue-400/50 cursor-pointer"
            onClick={() => setForm((prevValue) => !prevValue)}
          >
            Register here!
          </p>
        </div>
      </div>
    );
  }
};
