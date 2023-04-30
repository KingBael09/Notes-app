// import React from "react";
import {
  NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

const Avatar = () => {
  return (
    <>
      {" "}
      <SignedIn>
        {/* Mount the UserButton component */}
        {/* <UserButton /> */}
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverFooter: { display: "none" },
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
    </>
  );
};

const NavBar = () => {
  const router = useRouter();

  const hiddenif = router.pathname === "/note/[id]";
  return (
    <>
      <NavigationMenu style={{ display: hiddenif ? "none" : undefined }}>
        <NavigationMenuList>
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <NavigationMenuLink>Link</NavigationMenuLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                All Notes
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/pinned" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pinned
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/archived" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Archived
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="ml-auto mr-4">
          <Avatar />
        </div>
      </NavigationMenu>
    </>
  );
};

export default NavBar;
