import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Base } from "@iguhealth/components";

function copytoClipboard(token: string | undefined) {
  if (token) {
    navigator.clipboard.writeText(token);
    Base.Toaster.success("Access Token copied");
  }
}

interface SettingProps {
  token?: string;
}

function SettingDisplay({ token }: SettingProps) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="flex flex-col">
        <label>Access Token</label>
        <div className="flex flex-row">
          <div className="flex flex-1">
            <Base.InputContainer inlineLabel>
              <Base.Input readOnly value={token} />
            </Base.InputContainer>
          </div>
          <Base.Button
            onClick={(e) => {
              e.preventDefault();
              copytoClipboard(token);
            }}
            className="ml-1"
          >
            Copy
          </Base.Button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const auth0 = useAuth0();
  const [token, setToken] = useState<string>();
  const refreshToken = useEffect(() => {
    auth0.getAccessTokenSilently().then((token) => {
      setToken(token);
    });
  }, [setToken]);
  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Base.Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <SettingDisplay token={token} />
    </React.Suspense>
  );
}
