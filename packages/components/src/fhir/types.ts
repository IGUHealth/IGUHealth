import { ValueSet } from "@iguhealth/fhir-types/r4/types";

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

export type TerminologyLookupProps = {
  expand?: (value: string) => Promise<ValueSet>;
};
