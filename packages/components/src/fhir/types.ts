import createHTTPClient from "@iguhealth/client/http";

type HTTPClient = ReturnType<typeof createHTTPClient>;

export type EditableProps<T> = {
  /**
   * The value of the input.
   */
  value?: T;
  /**
   * Issues
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: T | undefined) => void;
  /**
   * Label string.
   */
  label?: string;
};

export type ClientProps = {
  client: HTTPClient;
};
