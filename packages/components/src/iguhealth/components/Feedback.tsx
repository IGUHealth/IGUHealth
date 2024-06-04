import React from "react";

import { Container } from "./Container";

export const Feedback = ({
  title,
  header,
  content,
  logo,
  children,
}: {
  logo?: string;
  title: string;
  header?: string;
  content: string | React.ReactNode;
  children?: React.ReactNode;
}) => (
  <Container logo={logo} title={title}>
    {header && (
      <div className="mt-2 px-4 py-2 space-y-2 md:space-y-4 ">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          {header}
        </h1>
      </div>
    )}
    <div className="space-y-4 md:space-y-6">
      <p className="p-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {content}
      </p>
    </div>
    {children}
  </Container>
);
