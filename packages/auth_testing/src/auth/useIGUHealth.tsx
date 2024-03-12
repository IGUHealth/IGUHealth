import { useContext } from "react";

import IGUHealthContext from "./IGUHealthContext";

export function useIGUHealth() {
  const context = useContext(IGUHealthContext);
  return context;
}
