CREATE INDEX resources_type_fitler on resources (tenant, fhir_version, resource_type);

DROP INDEX idx_number_idx_sort;

CREATE INDEX r4_idx_number_idx_sort on r4_number_idx (tenant, parameter_url);

DROP INDEX idx_uri_idx_sort;

CREATE INDEX r4_idx_uri_idx_sort on r4_uri_idx (tenant, parameter_url);

DROP INDEX idx_quantity_idx_sort;

CREATE INDEX r4_idx_quantity_idx_sort on r4_quantity_idx (tenant, parameter_url);

DROP INDEX idx_reference_idx_sort;

CREATE INDEX r4_idx_reference_idx_sort on r4_reference_idx (tenant, parameter_url);

DROP INDEX idx_date_idx_sort;

CREATE INDEX r4_idx_date_idx_sort on r4_date_idx (tenant, parameter_url);

DROP INDEX idx_token_idx_sort;

CREATE INDEX r4_idx_token_idx_sort on r4_token_idx (tenant, parameter_url);

DROP INDEX idx_string_idx_sort;

CREATE INDEX r4_idx_string_idx_sort on r4_string_idx (tenant, parameter_url);