export type EditableProps<T> = {
  /**
   * The value of the input.
   */
  value: T;
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
