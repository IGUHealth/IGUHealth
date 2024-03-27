declare global {
  interface Window {
    REACT_APP_FHIR_BASE_URL: string | undefined;
  }
}

export const REACT_APP_FHIR_BASE_URL =
  window.REACT_APP_FHIR_BASE_URL ?? process.env.REACT_APP_FHIR_BASE_URL;
