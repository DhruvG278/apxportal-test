"use client";
import React, { useState } from "react";
import { Input } from "../common/Input";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
    extra: "",
  });
  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setError({
      email: emailError,
      password: passwordError,
      extra: "",
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async () => {
    // Reset previous errors
    setError({ email: "", password: "", extra: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/zoho/login", {
        email,
        password,
      });

      // Handle successful login
      toast.success("Login successful", {
        position: "top-center",
      });
      router.push("/enquiries");
      // Redirect to dashboard or home page
      setIsLoading(false);
    } catch (submitError) {
      let errorMessage = "Login failed";
      if (
        typeof submitError === "object" &&
        submitError !== null &&
        "message" in submitError &&
        typeof (submitError as any).response?.data === "string"
      ) {
        console.log("first", submitError as any);
        errorMessage = (submitError as any).response.data;
      }

      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error.email) {
      setError((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error.password) {
      setError((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="w-full gap-4 flex flex-col !p-8 md:items-baseline items-center justify-center">
      <p className="font-bold text-2xl">Sign In</p>
      <div className="flex flex-col gap-4 w-full ">
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          iconPosition="left"
          variant="outlined"
          error={error.email}
        />

        {/* Password input with auto eye icon */}
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          variant="outlined"
          error={error.password}
        />
        {/* <Link href={"/auth/forgotPassword"} className="w-full">
          <p className=" text-secondary my-4 cursor-pointer text-left">
            forgot password?
          </p>
        </Link> */}
      </div>
      <button
        disabled={isLoading}
        className={`w-full  !py-3 ${
          isLoading ? "!bg-secondary" : "!bg-primary"
        } !text-white !font-semibold !rounded-2xl cursor-pointer`}
        onClick={handleSubmit}
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {error.extra && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error.extra}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
