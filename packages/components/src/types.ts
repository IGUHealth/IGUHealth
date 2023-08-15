export interface FhirWidgetProps<T> {
  value: T | undefined;
  onChange?: (newValue: T | undefined) => void;
}
