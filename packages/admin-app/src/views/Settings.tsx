import React from "react";

import {
  Button,
  Input,
  Loading,
  Toaster,
  useIGUHealth,
} from "@iguhealth/components";
import { IDTokenPayload } from "@iguhealth/jwt";

function copytoClipboard(token: string | undefined) {
  if (token) {
    navigator.clipboard.writeText(token);
    Toaster.success("Access Token copied");
  }
}

interface SettingProps {
  token?: string;
  user?: IDTokenPayload<string>;
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
  const iguhealth = useIGUHealth();

  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <SettingDisplay user={iguhealth.user} token={iguhealth.access_token} />
    </React.Suspense>
  );
}
