import React, { FC, ReactNode } from "react";
import locale from "antd/locale/en_US";
import { ConfigProvider } from "antd";

export const FhirApp: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <ConfigProvider locale={locale}>
      <div className="Fhir__FhirApp">
      {children}
      </div>
    </ConfigProvider>
  );
};
