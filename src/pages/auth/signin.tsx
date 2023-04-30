import { SignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SignUp</title>
      </Head>
      <div className="flex h-[100vh] items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              card: { "&>:last-child": { display: "none" } },
            },
          }}
          path={"/auth/signin"}
          // routing="path"
          signUpUrl={"/auth/signup"}
        />
      </div>
    </>
  );
};

export default SignInPage;
