import { SignUp } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const SignUpPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SignUp</title>
      </Head>
      <div className="flex h-[100vh] items-center justify-center">
        <SignUp
          appearance={{
            elements: {
              card: { "&>:last-child": { display: "none" } },
            },
          }}
          path="/auth/signup"
          // routing="path"
          signInUrl="/auth/signin"
        />
      </div>
    </>
  );
};

export default SignUpPage;
