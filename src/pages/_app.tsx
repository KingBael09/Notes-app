import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Navbar from "../components/navbar/index";
import { useRouter } from "next/router";
import { FullScreenLoading } from "../components/loading/index";
import { Toaster } from "~/components/toaster";
import { TooltipProvider } from "~/components/ui/tooltip";

const publicPages: Array<string> = ["/auth/signin", "/auth/signup"];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  if (pathname === "/_error") {
    return <Component {...pageProps} />;
  }

  const Loading = () => (
    <ClerkLoading>
      <FullScreenLoading />
    </ClerkLoading>
  );

  return (
    <TooltipProvider>
      <Toaster />
      <ClerkProvider {...pageProps}>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <Loading />
            <ClerkLoaded>
              <SignedIn>
                <Navbar />
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </ClerkLoaded>
          </>
        )}
      </ClerkProvider>
    </TooltipProvider>
  );
};

export default api.withTRPC(MyApp);
