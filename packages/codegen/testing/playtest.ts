import { Bundle } from "../r4";

interface Test {
  in_id: "Test";
  id: number;
}
interface Test2 {
  in_id: "Test2";
  add_id: string;
}
type UnionType = Test | Test2;

const union: UnionType = {
  in_id: "Test",
  id: 1,
};

const bundle: Bundle = {
  resourceType: "Bundle",
  type: "collection",
  entry: [
    {
      resource: {
        resourceType: "Patient",
        id: "Patient",
        name: [
          {
            family: "Test",
          },
        ],
      },
    },
  ],
};
