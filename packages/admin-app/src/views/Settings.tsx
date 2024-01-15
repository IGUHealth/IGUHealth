import { User, useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import { Button, Input, Loading, Toaster } from "@iguhealth/components";

function copytoClipboard(token: string | undefined) {
  if (token) {
    navigator.clipboard.writeText(token);
    Toaster.success("Access Token copied");
  }
}

interface SettingProps {
  token?: string;
  user?: User;
}

function SettingDisplay({ user, token }: SettingProps) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold mb-8">Settings</h2>
      <div className="mb-2">
        <h2 className="text-xl font-semibold ">User Information</h2>
        <div className="flex flex-col p-2">
          <div className="mb-2">
            <label className="block font-medium">Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="mb-2">
            <label className="block font-medium">Email:</label>
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Security</h2>
        <div className="flex flex-col p-2">
          <label>Access Token</label>
          <div className="flex flex-row">
            <div className="flex flex-1">
              <Input readOnly value={token} />
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                copytoClipboard(token);
              }}
              className="ml-1"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const auth0 = useAuth0();
  const [token, setToken] = useState<string>();
  useEffect(() => {
    auth0.getAccessTokenSilently().then((token) => {
      setToken(token);
    });
  }, [setToken]);

  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <SettingDisplay user={auth0.user} token={token} />
    </React.Suspense>
  );
}
