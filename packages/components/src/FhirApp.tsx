import React, { FC, ReactNode } from "react";
import locale from "antd/locale/en_US";
import { ConfigProvider } from "antd";

import styles from './index.css?inline'

export const FhirApp: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <ConfigProvider locale={locale}>
      <style>{styles}</style>
      {children}
    </ConfigProvider>
  );
};
