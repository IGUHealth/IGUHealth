import { useContext } from "react";
import IGUHealthContext from "./IGUHealthContext";

export default function useIGUHealth() {
  const context = useContext(IGUHealthContext);
  return context;
}
