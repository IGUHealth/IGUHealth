# History

All updates and mutations are stored within our database (including deletions). To query for the history of operations that have occured to a resource you can use the history api.

## API

### Parameters Supported

| Name            | Description                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| \_count         | Total number of returned resources                                                                     |
| \_since         | Returns resources with lastUpdated greater than the provided \_since value                             |
| \_since-version | Returns resources with versionId (which for our api is a sequential value) greater than value provided |

### System level

System level history encompasses all mutations that have happened at the system level:
Example:

```bash
curl --request GET --url https://{my-api}/_history?{parameters}
```

### Type level

Type level history encompasses all mutations that have happened at the type level:
Example:

```bash
curl --request GET --url https://{my-api}/{type}/_history?{parameters}
```

### Instance level

Instance level history encompasses all mutations that have happened to a single resource:
Example:

```bash
curl --request GET --url https://{my-api}/{type}/{id}/_history?{parameters}
```
