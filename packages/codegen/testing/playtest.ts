import { Bundle } from "../r4";


const bundle: Bundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: [
        {
            resource: {
                resourceType: "StructureDefinition",
                id: "Patient",
                url: "http://hl7.org/fhir/StructureDefinition/Patient",
                name: "Patient",
                title: "Patient"
            }
        }
    ]
}