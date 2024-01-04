import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@iguhealth/components";

export default function EmptyWorkspace() {
  const auth0 = useAuth0();
  return (
    <div className="h-screen w-screen flex  flex-col items-center">
      <div className=" flex justify-center items-center flex-col px-4 py-4 shadow-md -top-[15px] mt-16">
        <h1 className="text-xl font-semibold mb-4 ">
          There are no tenants associated with your account.
        </h1>
        <Button
          buttonType="secondary"
          onClick={() =>
            auth0.logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
