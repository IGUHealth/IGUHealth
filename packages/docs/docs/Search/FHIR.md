# FHIR Search

This is an overview of what we support from the FHIR search [specification](https://hl7.org/fhir/r4/search).

## Resource Parameters supported

| Type          | Supported | Description                                                                                        |
| ------------- | --------- | -------------------------------------------------------------------------------------------------- |
| Number        | Yes       | Searching on a simple numerical value in a resource                                                |
| Date/DateTime | Yes       | A date parameter searches on a date/time or period                                                 |
| String        | Yes       | Searching on simple string values in a resource                                                    |
| Token         | Yes       | A token type is a parameter that provides a close to exact match search on a string of characters. |
| Reference     | Yes       | A reference parameter refers to references between resources.                                      |
| Composite     | No        | Composite search parameters support joining single values with a $                                 |
| Quantity      | Yes       | A quantity parameter searches on the Quantity data type.                                           |
| URI           | Yes       | The uri parameter refers to an element that contains a URI                                         |

## Special Parameters

| Name            | Supported | Description                                                                                                     |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| \_id            | Yes       | Logical id of a resource                                                                                        |
| \_lastUpdated   | Yes       | Instant the resource was last updated                                                                           |
| \_tag           | Yes       | Meta.tag of the resource                                                                                        |
| \_profile       | Yes       | Meta.profile of the resource                                                                                    |
| \_security      | Yes       | Meta.security of the resource                                                                                   |
| \_text          | Yes       | Search on the narrative of the resource                                                                         |
| \_content       | Yes       | Search on the content of the resource                                                                           |
| \_list          | No        |                                                                                                                 |
| \_has           | No        | For reverse chaining                                                                                            |
| \_type          | Yes       | Filter system search on a specific set of resource types.                                                       |
| \_sort          | Yes       | Set the parameter to use for sorting. We also support sorting priority based on comma seperation of parameters. |
| \_count         | Yes       | Max it can be set to is 50.                                                                                     |
| \_include       | No        | Include related resources in bundle. Include resources referenced by current resource.                          |
| \_revinclude    | no        | Include related resources in Bundle. Include resources that reference current resource.                         |
| \_summary       | No        | Return a portion of the resource                                                                                |
| \_total         | Yes       | Return the total count of parameters matching query (including resources not returned by \_count limitation).   |
| \_element       | No        | Return summary based on parameters                                                                              |
| \_countained    | No        | Whether to return resources contained in other resources.                                                       |
| \_containedType | No        | Determine whether to return container or contained.                                                             |

## Chaining

When searching for data you may want to find resources based on data linked to a resource.
For example finding an Observation by a patients MRN identifier. To perform these kinds of searches you use chaining.
Our api supports chained parameters so in the example above you can perform the following query:

```curl
curl --request GET --url https://{my-api}/Observation?patient.identifier={mrn-system}|12345
```

To retrieve all observations for a patient with an mrn identifier of 12345. The way this is accomplised is that Observation stores a reference parameter for `patient` and the Patient resource has a token parameter for `identifier` so in above example we chain both of these parameters together. You can have chaining to any depth.

## Modifiers

Modifiers are colon seperated values that alter the behavior of search.
For example the following query: <br /> `bash curl --request GET --url https://{my-api}/Patient?name=bob` <br />
Will perform a default string search which is a case insensitive search for all patients whose name starts with bob. <br />

To make this more specific we can use the `exact` modifier as follows: <br />
`bash curl --request GET --url https://{my-api}/Patient?name:exact=Bob` <br />
This will perform a case sensitive search to find all Patients whose name exactly matches `Bob`.

### Supported Modifiers

| Name     | Supported | Types  | Description                                                    |
| -------- | --------- | ------ | -------------------------------------------------------------- |
| missing  | Yes       | token  | Search for values that don't have a value for given parameter. |
| exact    | Yes       | string | Search for an exact match of the given value.                  |
| contains | Yes       | string | Search for a value that contains given value.                  |

## Prefixes

Prefix which specifies the type of matching that occurs. This is used for odered parameter types **number**, **date** and **quantity**. <br />
For example the following query: <br /> `bash curl --request GET --url https://{my-api}/Patient?_lastUpdated=2023` <br />
Will query for all Patients who have been

###
