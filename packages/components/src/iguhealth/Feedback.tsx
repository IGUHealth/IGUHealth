import React from "react";

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
  <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        {logo && <img className="w-8 h-8 mr-2" src={logo} alt="logo" />}
        {title}
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
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
      </div>
    </div>
  </section>
);
