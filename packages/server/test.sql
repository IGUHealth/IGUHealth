(SELECT r_version_id FROM reference_idx WHERE parameter_url = 'http://hl7.org/fhir/SearchParameter/clinical-patient' and r_version_id in (((SELECT r_version_id FROM string_idx WHERE parameter_url = 'http://hl7.org/fhir/SearchParameter/Patient-name' AND value = 'Eve')) intersect ((SELECT r_version_id FROM reference_idx WHERE parameter_url = 'http://hl7.org/fhir/SearchParameter/clinical-patient' ))))


[
  'http://hl7.org/fhir/SearchParameter/clinical-patient',
  'http://hl7.org/fhir/SearchParameter/clinical-patient',
  'http://hl7.org/fhir/SearchParameter/Patient-name',
  'Eve',
  '1704fc63-dd53-4d6c-8435-1a4b83ba27f7',
  'Observation'
]