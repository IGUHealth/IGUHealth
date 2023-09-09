import React from "react";
import toast, { Toaster } from "react-hot-toast";

export const notify = (message: string) => toast(message);
export const loading = (message: string) => toast.loading(message);
export const error = (message: string) => toast.error(message);
export const success = (message: string) => toast.success(message);
export const promise = (...args: Parameters<typeof toast.promise>) =>
  toast.promise(...args);

export { Toaster };
