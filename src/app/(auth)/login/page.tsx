import LoginForm from "@/components/auth/LoginForm";
import { IMAGES } from "@/utils/images";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex w-full h-screen">
      <section className="md:w-1/2 w-full border flex flex-col items-center justify-center gap-8 p-8">
        <div className="h-[20%] flex  md:justify-start justify-center">
          <div className="relative md:hidden flex w-[200px] h-[200px]">
            <Image alt="Logo" src={IMAGES.logo} fill />
          </div>
        </div>
        <div className="flex flex-col  w-full justify-center max-w-[500px] gap-4">
          <LoginForm />
        </div>
      </section>
      <section className="w-1/2 bg-primary md:flex hidden flex-col items-center justify-center  p-8">
        {" "}
        <div className="relative w-[40%] h-[50%]">
          <Image alt="Logo" src={IMAGES.logo} fill />
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
