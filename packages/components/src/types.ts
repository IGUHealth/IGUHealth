interface FhirWidgetProps<T> {
  value: T;
  onChange: (newValue: T | null) => void;
}
