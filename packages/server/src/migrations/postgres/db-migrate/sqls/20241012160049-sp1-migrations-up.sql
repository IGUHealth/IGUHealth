-- R4 SP1 SQL Migrations 
 
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_id_system", "resource_id_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-id'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "resource_id_system" = EXCLUDED."resource_id_system", 
        "resource_id_value" = EXCLUDED."resource_id_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_lastupdated_start", "resource_lastupdated_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-lastUpdated'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "resource_lastupdated_start" = EXCLUDED."resource_lastupdated_start", 
        "resource_lastupdated_end" = EXCLUDED."resource_lastupdated_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-source'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "resource_source" = EXCLUDED."resource_source";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "account_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "account_name" = EXCLUDED."account_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "account_period_start", "account_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "account_period_start" = EXCLUDED."account_period_start", 
        "account_period_end" = EXCLUDED."account_period_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "account_status_system", "account_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "account_status_system" = EXCLUDED."account_status_system", 
        "account_status_value" = EXCLUDED."account_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_date_start", "activitydefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "activitydefinition_date_start" = EXCLUDED."activitydefinition_date_start", 
        "activitydefinition_date_end" = EXCLUDED."activitydefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_description" = EXCLUDED."activitydefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_effective_start", "activitydefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "activitydefinition_effective_start" = EXCLUDED."activitydefinition_effective_start", 
        "activitydefinition_effective_end" = EXCLUDED."activitydefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_name" = EXCLUDED."activitydefinition_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_publisher" = EXCLUDED."activitydefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_status_system", "activitydefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "activitydefinition_status_system" = EXCLUDED."activitydefinition_status_system", 
        "activitydefinition_status_value" = EXCLUDED."activitydefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_title" = EXCLUDED."activitydefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "activitydefinition_url" = EXCLUDED."activitydefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_version_system", "activitydefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "activitydefinition_version_system" = EXCLUDED."activitydefinition_version_system", 
        "activitydefinition_version_value" = EXCLUDED."activitydefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "adverseevent_actuality_system", "adverseevent_actuality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AdverseEvent-actuality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "adverseevent_actuality_system" = EXCLUDED."adverseevent_actuality_system", 
        "adverseevent_actuality_value" = EXCLUDED."adverseevent_actuality_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "adverseevent_date_start", "adverseevent_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AdverseEvent-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "adverseevent_date_start" = EXCLUDED."adverseevent_date_start", 
        "adverseevent_date_end" = EXCLUDED."adverseevent_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "allergyintolerance_criticality_system", "allergyintolerance_criticality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AllergyIntolerance-criticality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "allergyintolerance_criticality_system" = EXCLUDED."allergyintolerance_criticality_system", 
        "allergyintolerance_criticality_value" = EXCLUDED."allergyintolerance_criticality_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "allergyintolerance_last_date_start", "allergyintolerance_last_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AllergyIntolerance-last-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "allergyintolerance_last_date_start" = EXCLUDED."allergyintolerance_last_date_start", 
        "allergyintolerance_last_date_end" = EXCLUDED."allergyintolerance_last_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "appointment_date_start", "appointment_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Appointment-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "appointment_date_start" = EXCLUDED."appointment_date_start", 
        "appointment_date_end" = EXCLUDED."appointment_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "appointment_status_system", "appointment_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Appointment-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "appointment_status_system" = EXCLUDED."appointment_status_system", 
        "appointment_status_value" = EXCLUDED."appointment_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "appointmentresponse_part_status_system", "appointmentresponse_part_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AppointmentResponse-part-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "appointmentresponse_part_status_system" = EXCLUDED."appointmentresponse_part_status_system", 
        "appointmentresponse_part_status_value" = EXCLUDED."appointmentresponse_part_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_action_system", "auditevent_action_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-action'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_action_system" = EXCLUDED."auditevent_action_system", 
        "auditevent_action_value" = EXCLUDED."auditevent_action_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_date_start", "auditevent_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "auditevent_date_start" = EXCLUDED."auditevent_date_start", 
        "auditevent_date_end" = EXCLUDED."auditevent_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_outcome_system", "auditevent_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_outcome_system" = EXCLUDED."auditevent_outcome_system", 
        "auditevent_outcome_value" = EXCLUDED."auditevent_outcome_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_site_system", "auditevent_site_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-site'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_site_system" = EXCLUDED."auditevent_site_system", 
        "auditevent_site_value" = EXCLUDED."auditevent_site_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_type_system", "auditevent_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_type_system" = EXCLUDED."auditevent_type_system", 
        "auditevent_type_value" = EXCLUDED."auditevent_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "basic_created_start", "basic_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Basic-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "basic_created_start" = EXCLUDED."basic_created_start", 
        "basic_created_end" = EXCLUDED."basic_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_identifier_system", "bundle_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "bundle_identifier_system" = EXCLUDED."bundle_identifier_system", 
        "bundle_identifier_value" = EXCLUDED."bundle_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_timestamp_start", "bundle_timestamp_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-timestamp'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "bundle_timestamp_start" = EXCLUDED."bundle_timestamp_start", 
        "bundle_timestamp_end" = EXCLUDED."bundle_timestamp_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_type_system", "bundle_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "bundle_type_system" = EXCLUDED."bundle_type_system", 
        "bundle_type_value" = EXCLUDED."bundle_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_date_start", "conformance_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "conformance_date_start" = EXCLUDED."conformance_date_start", 
        "conformance_date_end" = EXCLUDED."conformance_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_description" = EXCLUDED."conformance_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "capabilitystatement_fhirversion_system", "capabilitystatement_fhirversion_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CapabilityStatement-fhirversion'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "capabilitystatement_fhirversion_system" = EXCLUDED."capabilitystatement_fhirversion_system", 
        "capabilitystatement_fhirversion_value" = EXCLUDED."capabilitystatement_fhirversion_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_name" = EXCLUDED."conformance_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_publisher" = EXCLUDED."conformance_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "capabilitystatement_software")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CapabilityStatement-software'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "capabilitystatement_software" = EXCLUDED."capabilitystatement_software";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_status_system", "conformance_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "conformance_status_system" = EXCLUDED."conformance_status_system", 
        "conformance_status_value" = EXCLUDED."conformance_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_title" = EXCLUDED."conformance_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "conformance_url" = EXCLUDED."conformance_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_version_system", "conformance_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "conformance_version_system" = EXCLUDED."conformance_version_system", 
        "conformance_version_value" = EXCLUDED."conformance_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "careplan_intent_system", "careplan_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CarePlan-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careplan_intent_system" = EXCLUDED."careplan_intent_system", 
        "careplan_intent_value" = EXCLUDED."careplan_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "careplan_status_system", "careplan_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CarePlan-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careplan_status_system" = EXCLUDED."careplan_status_system", 
        "careplan_status_value" = EXCLUDED."careplan_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "careteam_status_system", "careteam_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CareTeam-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careteam_status_system" = EXCLUDED."careteam_status_system", 
        "careteam_status_value" = EXCLUDED."careteam_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitem_entered_date_start", "chargeitem_entered_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-entered-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitem_entered_date_start" = EXCLUDED."chargeitem_entered_date_start", 
        "chargeitem_entered_date_end" = EXCLUDED."chargeitem_entered_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitem_factor_override")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-factor-override'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "chargeitem_factor_override" = EXCLUDED."chargeitem_factor_override";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "chargeitem_price_override_start_system", 
          "chargeitem_price_override_start_code", 
          "chargeitem_price_override_start_value", 
          "chargeitem_price_override_end_system",
          "chargeitem_price_override_end_code",
          "chargeitem_price_override_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-price-override'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitem_price_override_start_system" = EXCLUDED."chargeitem_price_override_start_system", 
        "chargeitem_price_override_start_code" =   EXCLUDED."chargeitem_price_override_start_code",
        "chargeitem_price_override_start_value" =  EXCLUDED."chargeitem_price_override_start_value",
        "chargeitem_price_override_end_system" =   EXCLUDED."chargeitem_price_override_end_system", 
        "chargeitem_price_override_end_code" =     EXCLUDED."chargeitem_price_override_end_code",
        "chargeitem_price_override_end_value" =    EXCLUDED."chargeitem_price_override_end_value";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "chargeitem_quantity_start_system", 
          "chargeitem_quantity_start_code", 
          "chargeitem_quantity_start_value", 
          "chargeitem_quantity_end_system",
          "chargeitem_quantity_end_code",
          "chargeitem_quantity_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-quantity'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitem_quantity_start_system" = EXCLUDED."chargeitem_quantity_start_system", 
        "chargeitem_quantity_start_code" =   EXCLUDED."chargeitem_quantity_start_code",
        "chargeitem_quantity_start_value" =  EXCLUDED."chargeitem_quantity_start_value",
        "chargeitem_quantity_end_system" =   EXCLUDED."chargeitem_quantity_end_system", 
        "chargeitem_quantity_end_code" =     EXCLUDED."chargeitem_quantity_end_code",
        "chargeitem_quantity_end_value" =    EXCLUDED."chargeitem_quantity_end_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_date_start", "chargeitemdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitemdefinition_date_start" = EXCLUDED."chargeitemdefinition_date_start", 
        "chargeitemdefinition_date_end" = EXCLUDED."chargeitemdefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_description" = EXCLUDED."chargeitemdefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_effective_start", "chargeitemdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitemdefinition_effective_start" = EXCLUDED."chargeitemdefinition_effective_start", 
        "chargeitemdefinition_effective_end" = EXCLUDED."chargeitemdefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_publisher" = EXCLUDED."chargeitemdefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_status_system", "chargeitemdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitemdefinition_status_system" = EXCLUDED."chargeitemdefinition_status_system", 
        "chargeitemdefinition_status_value" = EXCLUDED."chargeitemdefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_title" = EXCLUDED."chargeitemdefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "chargeitemdefinition_url" = EXCLUDED."chargeitemdefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_version_system", "chargeitemdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitemdefinition_version_system" = EXCLUDED."chargeitemdefinition_version_system", 
        "chargeitemdefinition_version_value" = EXCLUDED."chargeitemdefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_created_start", "claim_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claim_created_start" = EXCLUDED."claim_created_start", 
        "claim_created_end" = EXCLUDED."claim_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_status_system", "claim_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claim_status_system" = EXCLUDED."claim_status_system", 
        "claim_status_value" = EXCLUDED."claim_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_use_system", "claim_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claim_use_system" = EXCLUDED."claim_use_system", 
        "claim_use_value" = EXCLUDED."claim_use_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_created_start", "claimresponse_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claimresponse_created_start" = EXCLUDED."claimresponse_created_start", 
        "claimresponse_created_end" = EXCLUDED."claimresponse_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "claimresponse_disposition" = EXCLUDED."claimresponse_disposition";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_outcome_system", "claimresponse_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_outcome_system" = EXCLUDED."claimresponse_outcome_system", 
        "claimresponse_outcome_value" = EXCLUDED."claimresponse_outcome_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_payment_date_start", "claimresponse_payment_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-payment-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claimresponse_payment_date_start" = EXCLUDED."claimresponse_payment_date_start", 
        "claimresponse_payment_date_end" = EXCLUDED."claimresponse_payment_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_status_system", "claimresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_status_system" = EXCLUDED."claimresponse_status_system", 
        "claimresponse_status_value" = EXCLUDED."claimresponse_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_use_system", "claimresponse_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_use_system" = EXCLUDED."claimresponse_use_system", 
        "claimresponse_use_value" = EXCLUDED."claimresponse_use_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "clinicalimpression_status_system", "clinicalimpression_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClinicalImpression-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "clinicalimpression_status_system" = EXCLUDED."clinicalimpression_status_system", 
        "clinicalimpression_status_value" = EXCLUDED."clinicalimpression_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "codesystem_content_mode_system", "codesystem_content_mode_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CodeSystem-content-mode'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "codesystem_content_mode_system" = EXCLUDED."codesystem_content_mode_system", 
        "codesystem_content_mode_value" = EXCLUDED."codesystem_content_mode_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "codesystem_system")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CodeSystem-system'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "codesystem_system" = EXCLUDED."codesystem_system";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_received_start", "communication_received_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-received'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communication_received_start" = EXCLUDED."communication_received_start", 
        "communication_received_end" = EXCLUDED."communication_received_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_sent_start", "communication_sent_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-sent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communication_sent_start" = EXCLUDED."communication_sent_start", 
        "communication_sent_end" = EXCLUDED."communication_sent_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_status_system", "communication_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communication_status_system" = EXCLUDED."communication_status_system", 
        "communication_status_value" = EXCLUDED."communication_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_authored_start", "communicationrequest_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communicationrequest_authored_start" = EXCLUDED."communicationrequest_authored_start", 
        "communicationrequest_authored_end" = EXCLUDED."communicationrequest_authored_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_group_identifier_system", "communicationrequest_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_group_identifier_system" = EXCLUDED."communicationrequest_group_identifier_system", 
        "communicationrequest_group_identifier_value" = EXCLUDED."communicationrequest_group_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_occurrence_start", "communicationrequest_occurrence_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-occurrence'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communicationrequest_occurrence_start" = EXCLUDED."communicationrequest_occurrence_start", 
        "communicationrequest_occurrence_end" = EXCLUDED."communicationrequest_occurrence_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_priority_system", "communicationrequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_priority_system" = EXCLUDED."communicationrequest_priority_system", 
        "communicationrequest_priority_value" = EXCLUDED."communicationrequest_priority_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_status_system", "communicationrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_status_system" = EXCLUDED."communicationrequest_status_system", 
        "communicationrequest_status_value" = EXCLUDED."communicationrequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "compartmentdefinition_code_system", "compartmentdefinition_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CompartmentDefinition-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "compartmentdefinition_code_system" = EXCLUDED."compartmentdefinition_code_system", 
        "compartmentdefinition_code_value" = EXCLUDED."compartmentdefinition_code_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_confidentiality_system", "composition_confidentiality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-confidentiality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "composition_confidentiality_system" = EXCLUDED."composition_confidentiality_system", 
        "composition_confidentiality_value" = EXCLUDED."composition_confidentiality_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_status_system", "composition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "composition_status_system" = EXCLUDED."composition_status_system", 
        "composition_status_value" = EXCLUDED."composition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "composition_title" = EXCLUDED."composition_title";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "condition_abatement_age_start_system", 
          "condition_abatement_age_start_code", 
          "condition_abatement_age_start_value", 
          "condition_abatement_age_end_system",
          "condition_abatement_age_end_code",
          "condition_abatement_age_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-age'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "condition_abatement_age_start_system" = EXCLUDED."condition_abatement_age_start_system", 
        "condition_abatement_age_start_code" =   EXCLUDED."condition_abatement_age_start_code",
        "condition_abatement_age_start_value" =  EXCLUDED."condition_abatement_age_start_value",
        "condition_abatement_age_end_system" =   EXCLUDED."condition_abatement_age_end_system", 
        "condition_abatement_age_end_code" =     EXCLUDED."condition_abatement_age_end_code",
        "condition_abatement_age_end_value" =    EXCLUDED."condition_abatement_age_end_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_abatement_date_start", "condition_abatement_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_abatement_date_start" = EXCLUDED."condition_abatement_date_start", 
        "condition_abatement_date_end" = EXCLUDED."condition_abatement_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_abatement_string")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-string'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "condition_abatement_string" = EXCLUDED."condition_abatement_string";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "condition_onset_age_start_system", 
          "condition_onset_age_start_code", 
          "condition_onset_age_start_value", 
          "condition_onset_age_end_system",
          "condition_onset_age_end_code",
          "condition_onset_age_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-age'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "condition_onset_age_start_system" = EXCLUDED."condition_onset_age_start_system", 
        "condition_onset_age_start_code" =   EXCLUDED."condition_onset_age_start_code",
        "condition_onset_age_start_value" =  EXCLUDED."condition_onset_age_start_value",
        "condition_onset_age_end_system" =   EXCLUDED."condition_onset_age_end_system", 
        "condition_onset_age_end_code" =     EXCLUDED."condition_onset_age_end_code",
        "condition_onset_age_end_value" =    EXCLUDED."condition_onset_age_end_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_onset_date_start", "condition_onset_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_onset_date_start" = EXCLUDED."condition_onset_date_start", 
        "condition_onset_date_end" = EXCLUDED."condition_onset_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_onset_info")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-info'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "condition_onset_info" = EXCLUDED."condition_onset_info";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_recorded_date_start", "condition_recorded_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-recorded-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_recorded_date_start" = EXCLUDED."condition_recorded_date_start", 
        "condition_recorded_date_end" = EXCLUDED."condition_recorded_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "consent_period_start", "consent_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Consent-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "consent_period_start" = EXCLUDED."consent_period_start", 
        "consent_period_end" = EXCLUDED."consent_period_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "consent_status_system", "consent_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Consent-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "consent_status_system" = EXCLUDED."consent_status_system", 
        "consent_status_value" = EXCLUDED."consent_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_instantiates")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-instantiates'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "contract_instantiates" = EXCLUDED."contract_instantiates";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_issued_start", "contract_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "contract_issued_start" = EXCLUDED."contract_issued_start", 
        "contract_issued_end" = EXCLUDED."contract_issued_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_status_system", "contract_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "contract_status_system" = EXCLUDED."contract_status_system", 
        "contract_status_value" = EXCLUDED."contract_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "contract_url" = EXCLUDED."contract_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverage_dependent")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Coverage-dependent'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "coverage_dependent" = EXCLUDED."coverage_dependent";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverage_status_system", "coverage_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Coverage-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverage_status_system" = EXCLUDED."coverage_status_system", 
        "coverage_status_value" = EXCLUDED."coverage_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityrequest_created_start", "coverageeligibilityrequest_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "coverageeligibilityrequest_created_start" = EXCLUDED."coverageeligibilityrequest_created_start", 
        "coverageeligibilityrequest_created_end" = EXCLUDED."coverageeligibilityrequest_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityrequest_status_system", "coverageeligibilityrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityrequest_status_system" = EXCLUDED."coverageeligibilityrequest_status_system", 
        "coverageeligibilityrequest_status_value" = EXCLUDED."coverageeligibilityrequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_created_start", "coverageeligibilityresponse_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "coverageeligibilityresponse_created_start" = EXCLUDED."coverageeligibilityresponse_created_start", 
        "coverageeligibilityresponse_created_end" = EXCLUDED."coverageeligibilityresponse_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "coverageeligibilityresponse_disposition" = EXCLUDED."coverageeligibilityresponse_disposition";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_outcome_system", "coverageeligibilityresponse_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityresponse_outcome_system" = EXCLUDED."coverageeligibilityresponse_outcome_system", 
        "coverageeligibilityresponse_outcome_value" = EXCLUDED."coverageeligibilityresponse_outcome_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_status_system", "coverageeligibilityresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityresponse_status_system" = EXCLUDED."coverageeligibilityresponse_status_system", 
        "coverageeligibilityresponse_status_value" = EXCLUDED."coverageeligibilityresponse_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "detectedissue_identified_start", "detectedissue_identified_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DetectedIssue-identified'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "detectedissue_identified_start" = EXCLUDED."detectedissue_identified_start", 
        "detectedissue_identified_end" = EXCLUDED."detectedissue_identified_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "device_manufacturer")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-manufacturer'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "device_manufacturer" = EXCLUDED."device_manufacturer";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "device_model")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-model'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "device_model" = EXCLUDED."device_model";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "device_status_system", "device_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "device_status_system" = EXCLUDED."device_status_system", 
        "device_status_value" = EXCLUDED."device_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "device_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "device_url" = EXCLUDED."device_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicemetric_category_system", "devicemetric_category_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceMetric-category'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicemetric_category_system" = EXCLUDED."devicemetric_category_system", 
        "devicemetric_category_value" = EXCLUDED."devicemetric_category_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_authored_on_start", "devicerequest_authored_on_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-authored-on'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "devicerequest_authored_on_start" = EXCLUDED."devicerequest_authored_on_start", 
        "devicerequest_authored_on_end" = EXCLUDED."devicerequest_authored_on_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_event_date_start", "devicerequest_event_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-event-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "devicerequest_event_date_start" = EXCLUDED."devicerequest_event_date_start", 
        "devicerequest_event_date_end" = EXCLUDED."devicerequest_event_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_group_identifier_system", "devicerequest_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_group_identifier_system" = EXCLUDED."devicerequest_group_identifier_system", 
        "devicerequest_group_identifier_value" = EXCLUDED."devicerequest_group_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_intent_system", "devicerequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_intent_system" = EXCLUDED."devicerequest_intent_system", 
        "devicerequest_intent_value" = EXCLUDED."devicerequest_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_status_system", "devicerequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_status_system" = EXCLUDED."devicerequest_status_system", 
        "devicerequest_status_value" = EXCLUDED."devicerequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "diagnosticreport_issued_start", "diagnosticreport_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DiagnosticReport-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "diagnosticreport_issued_start" = EXCLUDED."diagnosticreport_issued_start", 
        "diagnosticreport_issued_end" = EXCLUDED."diagnosticreport_issued_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "diagnosticreport_status_system", "diagnosticreport_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DiagnosticReport-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "diagnosticreport_status_system" = EXCLUDED."diagnosticreport_status_system", 
        "diagnosticreport_status_value" = EXCLUDED."diagnosticreport_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_created_start", "documentmanifest_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentmanifest_created_start" = EXCLUDED."documentmanifest_created_start", 
        "documentmanifest_created_end" = EXCLUDED."documentmanifest_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "documentmanifest_description" = EXCLUDED."documentmanifest_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-source'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "documentmanifest_source" = EXCLUDED."documentmanifest_source";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_status_system", "documentmanifest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "documentmanifest_status_system" = EXCLUDED."documentmanifest_status_system", 
        "documentmanifest_status_value" = EXCLUDED."documentmanifest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_date_start", "documentreference_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentreference_date_start" = EXCLUDED."documentreference_date_start", 
        "documentreference_date_end" = EXCLUDED."documentreference_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "documentreference_description" = EXCLUDED."documentreference_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_period_start", "documentreference_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentreference_period_start" = EXCLUDED."documentreference_period_start", 
        "documentreference_period_end" = EXCLUDED."documentreference_period_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_status_system", "documentreference_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "documentreference_status_system" = EXCLUDED."documentreference_status_system", 
        "documentreference_status_value" = EXCLUDED."documentreference_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_date_start", "effectevidencesynthesis_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "effectevidencesynthesis_date_start" = EXCLUDED."effectevidencesynthesis_date_start", 
        "effectevidencesynthesis_date_end" = EXCLUDED."effectevidencesynthesis_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "effectevidencesynthesis_description" = EXCLUDED."effectevidencesynthesis_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_effective_start", "effectevidencesynthesis_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "effectevidencesynthesis_effective_start" = EXCLUDED."effectevidencesynthesis_effective_start", 
        "effectevidencesynthesis_effective_end" = EXCLUDED."effectevidencesynthesis_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "effectevidencesynthesis_name" = EXCLUDED."effectevidencesynthesis_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "effectevidencesynthesis_publisher" = EXCLUDED."effectevidencesynthesis_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_status_system", "effectevidencesynthesis_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "effectevidencesynthesis_status_system" = EXCLUDED."effectevidencesynthesis_status_system", 
        "effectevidencesynthesis_status_value" = EXCLUDED."effectevidencesynthesis_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "effectevidencesynthesis_title" = EXCLUDED."effectevidencesynthesis_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "effectevidencesynthesis_url" = EXCLUDED."effectevidencesynthesis_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "effectevidencesynthesis_version_system", "effectevidencesynthesis_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EffectEvidenceSynthesis-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "effectevidencesynthesis_version_system" = EXCLUDED."effectevidencesynthesis_version_system", 
        "effectevidencesynthesis_version_value" = EXCLUDED."effectevidencesynthesis_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "encounter_class_system", "encounter_class_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-class'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_class_system" = EXCLUDED."encounter_class_system", 
        "encounter_class_value" = EXCLUDED."encounter_class_value";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "encounter_length_start_system", 
          "encounter_length_start_code", 
          "encounter_length_start_value", 
          "encounter_length_end_system",
          "encounter_length_end_code",
          "encounter_length_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-length'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_length_start_system" = EXCLUDED."encounter_length_start_system", 
        "encounter_length_start_code" =   EXCLUDED."encounter_length_start_code",
        "encounter_length_start_value" =  EXCLUDED."encounter_length_start_value",
        "encounter_length_end_system" =   EXCLUDED."encounter_length_end_system", 
        "encounter_length_end_code" =     EXCLUDED."encounter_length_end_code",
        "encounter_length_end_value" =    EXCLUDED."encounter_length_end_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "encounter_status_system", "encounter_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_status_system" = EXCLUDED."encounter_status_system", 
        "encounter_status_value" = EXCLUDED."encounter_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_connection_type_system", "endpoint_connection_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-connection-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "endpoint_connection_type_system" = EXCLUDED."endpoint_connection_type_system", 
        "endpoint_connection_type_value" = EXCLUDED."endpoint_connection_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "endpoint_name" = EXCLUDED."endpoint_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_status_system", "endpoint_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "endpoint_status_system" = EXCLUDED."endpoint_status_system", 
        "endpoint_status_value" = EXCLUDED."endpoint_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "enrollmentrequest_status_system", "enrollmentrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EnrollmentRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "enrollmentrequest_status_system" = EXCLUDED."enrollmentrequest_status_system", 
        "enrollmentrequest_status_value" = EXCLUDED."enrollmentrequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "enrollmentresponse_status_system", "enrollmentresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EnrollmentResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "enrollmentresponse_status_system" = EXCLUDED."enrollmentresponse_status_system", 
        "enrollmentresponse_status_value" = EXCLUDED."enrollmentresponse_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "episodeofcare_status_system", "episodeofcare_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EpisodeOfCare-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "episodeofcare_status_system" = EXCLUDED."episodeofcare_status_system", 
        "episodeofcare_status_value" = EXCLUDED."episodeofcare_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_date_start", "eventdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "eventdefinition_date_start" = EXCLUDED."eventdefinition_date_start", 
        "eventdefinition_date_end" = EXCLUDED."eventdefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_description" = EXCLUDED."eventdefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_effective_start", "eventdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "eventdefinition_effective_start" = EXCLUDED."eventdefinition_effective_start", 
        "eventdefinition_effective_end" = EXCLUDED."eventdefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_name" = EXCLUDED."eventdefinition_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_publisher" = EXCLUDED."eventdefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_status_system", "eventdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "eventdefinition_status_system" = EXCLUDED."eventdefinition_status_system", 
        "eventdefinition_status_value" = EXCLUDED."eventdefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_title" = EXCLUDED."eventdefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "eventdefinition_url" = EXCLUDED."eventdefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_version_system", "eventdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "eventdefinition_version_system" = EXCLUDED."eventdefinition_version_system", 
        "eventdefinition_version_value" = EXCLUDED."eventdefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_date_start", "evidence_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidence_date_start" = EXCLUDED."evidence_date_start", 
        "evidence_date_end" = EXCLUDED."evidence_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_description" = EXCLUDED."evidence_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_effective_start", "evidence_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidence_effective_start" = EXCLUDED."evidence_effective_start", 
        "evidence_effective_end" = EXCLUDED."evidence_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_name" = EXCLUDED."evidence_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_publisher" = EXCLUDED."evidence_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_status_system", "evidence_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidence_status_system" = EXCLUDED."evidence_status_system", 
        "evidence_status_value" = EXCLUDED."evidence_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_title" = EXCLUDED."evidence_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "evidence_url" = EXCLUDED."evidence_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_version_system", "evidence_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidence_version_system" = EXCLUDED."evidence_version_system", 
        "evidence_version_value" = EXCLUDED."evidence_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_date_start", "evidencevariable_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidencevariable_date_start" = EXCLUDED."evidencevariable_date_start", 
        "evidencevariable_date_end" = EXCLUDED."evidencevariable_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_description" = EXCLUDED."evidencevariable_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_effective_start", "evidencevariable_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidencevariable_effective_start" = EXCLUDED."evidencevariable_effective_start", 
        "evidencevariable_effective_end" = EXCLUDED."evidencevariable_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_name" = EXCLUDED."evidencevariable_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_publisher" = EXCLUDED."evidencevariable_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_status_system", "evidencevariable_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidencevariable_status_system" = EXCLUDED."evidencevariable_status_system", 
        "evidencevariable_status_value" = EXCLUDED."evidencevariable_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_title" = EXCLUDED."evidencevariable_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "evidencevariable_url" = EXCLUDED."evidencevariable_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_version_system", "evidencevariable_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidencevariable_version_system" = EXCLUDED."evidencevariable_version_system", 
        "evidencevariable_version_value" = EXCLUDED."evidencevariable_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_date_start", "examplescenario_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "examplescenario_date_start" = EXCLUDED."examplescenario_date_start", 
        "examplescenario_date_end" = EXCLUDED."examplescenario_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "examplescenario_name" = EXCLUDED."examplescenario_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "examplescenario_publisher" = EXCLUDED."examplescenario_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_status_system", "examplescenario_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "examplescenario_status_system" = EXCLUDED."examplescenario_status_system", 
        "examplescenario_status_value" = EXCLUDED."examplescenario_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "examplescenario_url" = EXCLUDED."examplescenario_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_version_system", "examplescenario_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "examplescenario_version_system" = EXCLUDED."examplescenario_version_system", 
        "examplescenario_version_value" = EXCLUDED."examplescenario_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_created_start", "explanationofbenefit_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "explanationofbenefit_created_start" = EXCLUDED."explanationofbenefit_created_start", 
        "explanationofbenefit_created_end" = EXCLUDED."explanationofbenefit_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "explanationofbenefit_disposition" = EXCLUDED."explanationofbenefit_disposition";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_status_system", "explanationofbenefit_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "explanationofbenefit_status_system" = EXCLUDED."explanationofbenefit_status_system", 
        "explanationofbenefit_status_value" = EXCLUDED."explanationofbenefit_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "familymemberhistory_status_system", "familymemberhistory_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/FamilyMemberHistory-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "familymemberhistory_status_system" = EXCLUDED."familymemberhistory_status_system", 
        "familymemberhistory_status_value" = EXCLUDED."familymemberhistory_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "goal_lifecycle_status_system", "goal_lifecycle_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Goal-lifecycle-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "goal_lifecycle_status_system" = EXCLUDED."goal_lifecycle_status_system", 
        "goal_lifecycle_status_value" = EXCLUDED."goal_lifecycle_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "goal_start_date_start", "goal_start_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Goal-start-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "goal_start_date_start" = EXCLUDED."goal_start_date_start", 
        "goal_start_date_end" = EXCLUDED."goal_start_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "graphdefinition_start_system", "graphdefinition_start_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/GraphDefinition-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "graphdefinition_start_system" = EXCLUDED."graphdefinition_start_system", 
        "graphdefinition_start_value" = EXCLUDED."graphdefinition_start_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "group_actual_system", "group_actual_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Group-actual'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "group_actual_system" = EXCLUDED."group_actual_system", 
        "group_actual_value" = EXCLUDED."group_actual_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "group_type_system", "group_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Group-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "group_type_system" = EXCLUDED."group_type_system", 
        "group_type_value" = EXCLUDED."group_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "guidanceresponse_request_system", "guidanceresponse_request_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/GuidanceResponse-request'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "guidanceresponse_request_system" = EXCLUDED."guidanceresponse_request_system", 
        "guidanceresponse_request_value" = EXCLUDED."guidanceresponse_request_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "healthcareservice_active_system", "healthcareservice_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/HealthcareService-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "healthcareservice_active_system" = EXCLUDED."healthcareservice_active_system", 
        "healthcareservice_active_value" = EXCLUDED."healthcareservice_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "healthcareservice_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/HealthcareService-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "healthcareservice_name" = EXCLUDED."healthcareservice_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "imagingstudy_started_start", "imagingstudy_started_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImagingStudy-started'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "imagingstudy_started_start" = EXCLUDED."imagingstudy_started_start", 
        "imagingstudy_started_end" = EXCLUDED."imagingstudy_started_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "imagingstudy_status_system", "imagingstudy_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImagingStudy-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "imagingstudy_status_system" = EXCLUDED."imagingstudy_status_system", 
        "imagingstudy_status_value" = EXCLUDED."imagingstudy_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "immunization_lot_number")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Immunization-lot-number'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "immunization_lot_number" = EXCLUDED."immunization_lot_number";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "immunization_status_system", "immunization_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Immunization-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "immunization_status_system" = EXCLUDED."immunization_status_system", 
        "immunization_status_value" = EXCLUDED."immunization_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationevaluation_date_start", "immunizationevaluation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "immunizationevaluation_date_start" = EXCLUDED."immunizationevaluation_date_start", 
        "immunizationevaluation_date_end" = EXCLUDED."immunizationevaluation_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationevaluation_status_system", "immunizationevaluation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "immunizationevaluation_status_system" = EXCLUDED."immunizationevaluation_status_system", 
        "immunizationevaluation_status_value" = EXCLUDED."immunizationevaluation_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationrecommendation_date_start", "immunizationrecommendation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "immunizationrecommendation_date_start" = EXCLUDED."immunizationrecommendation_date_start", 
        "immunizationrecommendation_date_end" = EXCLUDED."immunizationrecommendation_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "implementationguide_experimental_system", "implementationguide_experimental_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImplementationGuide-experimental'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "implementationguide_experimental_system" = EXCLUDED."implementationguide_experimental_system", 
        "implementationguide_experimental_value" = EXCLUDED."implementationguide_experimental_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "insuranceplan_phonetic")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/InsurancePlan-phonetic'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "insuranceplan_phonetic" = EXCLUDED."insuranceplan_phonetic";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "insuranceplan_status_system", "insuranceplan_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/InsurancePlan-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "insuranceplan_status_system" = EXCLUDED."insuranceplan_status_system", 
        "insuranceplan_status_value" = EXCLUDED."insuranceplan_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "invoice_date_start", "invoice_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "invoice_date_start" = EXCLUDED."invoice_date_start", 
        "invoice_date_end" = EXCLUDED."invoice_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "invoice_status_system", "invoice_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_status_system" = EXCLUDED."invoice_status_system", 
        "invoice_status_value" = EXCLUDED."invoice_status_value";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "invoice_totalgross_start_system", 
          "invoice_totalgross_start_code", 
          "invoice_totalgross_start_value", 
          "invoice_totalgross_end_system",
          "invoice_totalgross_end_code",
          "invoice_totalgross_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-totalgross'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_totalgross_start_system" = EXCLUDED."invoice_totalgross_start_system", 
        "invoice_totalgross_start_code" =   EXCLUDED."invoice_totalgross_start_code",
        "invoice_totalgross_start_value" =  EXCLUDED."invoice_totalgross_start_value",
        "invoice_totalgross_end_system" =   EXCLUDED."invoice_totalgross_end_system", 
        "invoice_totalgross_end_code" =     EXCLUDED."invoice_totalgross_end_code",
        "invoice_totalgross_end_value" =    EXCLUDED."invoice_totalgross_end_value";
 
        INSERT INTO "r4_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "invoice_totalnet_start_system", 
          "invoice_totalnet_start_code", 
          "invoice_totalnet_start_value", 
          "invoice_totalnet_end_system",
          "invoice_totalnet_end_code",
          "invoice_totalnet_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-totalnet'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_totalnet_start_system" = EXCLUDED."invoice_totalnet_start_system", 
        "invoice_totalnet_start_code" =   EXCLUDED."invoice_totalnet_start_code",
        "invoice_totalnet_start_value" =  EXCLUDED."invoice_totalnet_start_value",
        "invoice_totalnet_end_system" =   EXCLUDED."invoice_totalnet_end_system", 
        "invoice_totalnet_end_code" =     EXCLUDED."invoice_totalnet_end_code",
        "invoice_totalnet_end_value" =    EXCLUDED."invoice_totalnet_end_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_date_start", "library_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "library_date_start" = EXCLUDED."library_date_start", 
        "library_date_end" = EXCLUDED."library_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_description" = EXCLUDED."library_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_effective_start", "library_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "library_effective_start" = EXCLUDED."library_effective_start", 
        "library_effective_end" = EXCLUDED."library_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_name" = EXCLUDED."library_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_publisher" = EXCLUDED."library_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_status_system", "library_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "library_status_system" = EXCLUDED."library_status_system", 
        "library_status_value" = EXCLUDED."library_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_title" = EXCLUDED."library_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "library_url" = EXCLUDED."library_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "library_version_system", "library_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "library_version_system" = EXCLUDED."library_version_system", 
        "library_version_value" = EXCLUDED."library_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "list_status_system", "list_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/List-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "list_status_system" = EXCLUDED."list_status_system", 
        "list_status_value" = EXCLUDED."list_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "list_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/List-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "list_title" = EXCLUDED."list_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_city")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-city'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_city" = EXCLUDED."location_address_city";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_country")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-country'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_country" = EXCLUDED."location_address_country";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_postalcode")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-postalcode'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_postalcode" = EXCLUDED."location_address_postalcode";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_state")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-state'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_state" = EXCLUDED."location_address_state";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_use_system", "location_address_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_address_use_system" = EXCLUDED."location_address_use_system", 
        "location_address_use_value" = EXCLUDED."location_address_use_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_operational_status_system", "location_operational_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-operational-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_operational_status_system" = EXCLUDED."location_operational_status_system", 
        "location_operational_status_value" = EXCLUDED."location_operational_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "location_status_system", "location_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_status_system" = EXCLUDED."location_status_system", 
        "location_status_value" = EXCLUDED."location_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_date_start", "measure_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measure_date_start" = EXCLUDED."measure_date_start", 
        "measure_date_end" = EXCLUDED."measure_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_description" = EXCLUDED."measure_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_effective_start", "measure_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measure_effective_start" = EXCLUDED."measure_effective_start", 
        "measure_effective_end" = EXCLUDED."measure_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_name" = EXCLUDED."measure_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_publisher" = EXCLUDED."measure_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_status_system", "measure_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measure_status_system" = EXCLUDED."measure_status_system", 
        "measure_status_value" = EXCLUDED."measure_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_title" = EXCLUDED."measure_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "measure_url" = EXCLUDED."measure_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_version_system", "measure_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measure_version_system" = EXCLUDED."measure_version_system", 
        "measure_version_value" = EXCLUDED."measure_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_date_start", "measurereport_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measurereport_date_start" = EXCLUDED."measurereport_date_start", 
        "measurereport_date_end" = EXCLUDED."measurereport_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_period_start", "measurereport_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measurereport_period_start" = EXCLUDED."measurereport_period_start", 
        "measurereport_period_end" = EXCLUDED."measurereport_period_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_status_system", "measurereport_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measurereport_status_system" = EXCLUDED."measurereport_status_system", 
        "measurereport_status_value" = EXCLUDED."measurereport_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "media_created_start", "media_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Media-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "media_created_start" = EXCLUDED."media_created_start", 
        "media_created_end" = EXCLUDED."media_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "media_status_system", "media_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Media-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "media_status_system" = EXCLUDED."media_status_system", 
        "media_status_value" = EXCLUDED."media_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_expiration_date_start", "medication_expiration_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-expiration-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medication_expiration_date_start" = EXCLUDED."medication_expiration_date_start", 
        "medication_expiration_date_end" = EXCLUDED."medication_expiration_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_lot_number_system", "medication_lot_number_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-lot-number'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medication_lot_number_system" = EXCLUDED."medication_lot_number_system", 
        "medication_lot_number_value" = EXCLUDED."medication_lot_number_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_status_system", "medication_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medication_status_system" = EXCLUDED."medication_status_system", 
        "medication_status_value" = EXCLUDED."medication_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationadministration_effective_time_start", "medicationadministration_effective_time_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationAdministration-effective-time'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationadministration_effective_time_start" = EXCLUDED."medicationadministration_effective_time_start", 
        "medicationadministration_effective_time_end" = EXCLUDED."medicationadministration_effective_time_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medications_status_system", "medications_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/medications-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medications_status_system" = EXCLUDED."medications_status_system", 
        "medications_status_value" = EXCLUDED."medications_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationdispense_whenhandedover_start", "medicationdispense_whenhandedover_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationDispense-whenhandedover'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationdispense_whenhandedover_start" = EXCLUDED."medicationdispense_whenhandedover_start", 
        "medicationdispense_whenhandedover_end" = EXCLUDED."medicationdispense_whenhandedover_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationdispense_whenprepared_start", "medicationdispense_whenprepared_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationDispense-whenprepared'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationdispense_whenprepared_start" = EXCLUDED."medicationdispense_whenprepared_start", 
        "medicationdispense_whenprepared_end" = EXCLUDED."medicationdispense_whenprepared_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationknowledge_status_system", "medicationknowledge_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationKnowledge-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationknowledge_status_system" = EXCLUDED."medicationknowledge_status_system", 
        "medicationknowledge_status_value" = EXCLUDED."medicationknowledge_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_authoredon_start", "medicationrequest_authoredon_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-authoredon'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationrequest_authoredon_start" = EXCLUDED."medicationrequest_authoredon_start", 
        "medicationrequest_authoredon_end" = EXCLUDED."medicationrequest_authoredon_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_intent_system", "medicationrequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationrequest_intent_system" = EXCLUDED."medicationrequest_intent_system", 
        "medicationrequest_intent_value" = EXCLUDED."medicationrequest_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_priority_system", "medicationrequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationrequest_priority_system" = EXCLUDED."medicationrequest_priority_system", 
        "medicationrequest_priority_value" = EXCLUDED."medicationrequest_priority_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationstatement_effective_start", "medicationstatement_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationStatement-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationstatement_effective_start" = EXCLUDED."medicationstatement_effective_start", 
        "medicationstatement_effective_end" = EXCLUDED."medicationstatement_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagedefinition_category_system", "messagedefinition_category_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageDefinition-category'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagedefinition_category_system" = EXCLUDED."messagedefinition_category_system", 
        "messagedefinition_category_value" = EXCLUDED."messagedefinition_category_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagedefinition_event_system", "messagedefinition_event_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageDefinition-event'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagedefinition_event_system" = EXCLUDED."messagedefinition_event_system", 
        "messagedefinition_event_value" = EXCLUDED."messagedefinition_event_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_code_system", "messageheader_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_code_system" = EXCLUDED."messageheader_code_system", 
        "messageheader_code_value" = EXCLUDED."messageheader_code_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_event_system", "messageheader_event_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-event'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_event_system" = EXCLUDED."messageheader_event_system", 
        "messageheader_event_value" = EXCLUDED."messageheader_event_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_response_id_system", "messageheader_response_id_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-response-id'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_response_id_system" = EXCLUDED."messageheader_response_id_system", 
        "messageheader_response_id_value" = EXCLUDED."messageheader_response_id_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-source'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "messageheader_source" = EXCLUDED."messageheader_source";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_source_uri")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-source-uri'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "messageheader_source_uri" = EXCLUDED."messageheader_source_uri";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_type_system", "molecularsequence_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "molecularsequence_type_system" = EXCLUDED."molecularsequence_type_system", 
        "molecularsequence_type_value" = EXCLUDED."molecularsequence_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_window_end")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-window-end'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "molecularsequence_window_end" = EXCLUDED."molecularsequence_window_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_window_start")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-window-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "molecularsequence_window_start" = EXCLUDED."molecularsequence_window_start";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "namingsystem_kind_system", "namingsystem_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NamingSystem-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "namingsystem_kind_system" = EXCLUDED."namingsystem_kind_system", 
        "namingsystem_kind_value" = EXCLUDED."namingsystem_kind_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "namingsystem_responsible")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NamingSystem-responsible'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "namingsystem_responsible" = EXCLUDED."namingsystem_responsible";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "nutritionorder_datetime_start", "nutritionorder_datetime_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NutritionOrder-datetime'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "nutritionorder_datetime_start" = EXCLUDED."nutritionorder_datetime_start", 
        "nutritionorder_datetime_end" = EXCLUDED."nutritionorder_datetime_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "nutritionorder_status_system", "nutritionorder_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NutritionOrder-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "nutritionorder_status_system" = EXCLUDED."nutritionorder_status_system", 
        "nutritionorder_status_value" = EXCLUDED."nutritionorder_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_status_system", "observation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "observation_status_system" = EXCLUDED."observation_status_system", 
        "observation_status_value" = EXCLUDED."observation_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_value_date_start", "observation_value_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-value-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "observation_value_date_start" = EXCLUDED."observation_value_date_start", 
        "observation_value_date_end" = EXCLUDED."observation_value_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_value_string")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-value-string'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "observation_value_string" = EXCLUDED."observation_value_string";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_code_system", "operationdefinition_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_code_system" = EXCLUDED."operationdefinition_code_system", 
        "operationdefinition_code_value" = EXCLUDED."operationdefinition_code_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_instance_system", "operationdefinition_instance_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-instance'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_instance_system" = EXCLUDED."operationdefinition_instance_system", 
        "operationdefinition_instance_value" = EXCLUDED."operationdefinition_instance_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_kind_system", "operationdefinition_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_kind_system" = EXCLUDED."operationdefinition_kind_system", 
        "operationdefinition_kind_value" = EXCLUDED."operationdefinition_kind_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_system_system", "operationdefinition_system_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-system'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_system_system" = EXCLUDED."operationdefinition_system_system", 
        "operationdefinition_system_value" = EXCLUDED."operationdefinition_system_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_type_system", "operationdefinition_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_type_system" = EXCLUDED."operationdefinition_type_system", 
        "operationdefinition_type_value" = EXCLUDED."operationdefinition_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "organization_active_system", "organization_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Organization-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "organization_active_system" = EXCLUDED."organization_active_system", 
        "organization_active_value" = EXCLUDED."organization_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "organization_phonetic")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Organization-phonetic'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "organization_phonetic" = EXCLUDED."organization_phonetic";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "organizationaffiliation_active_system", "organizationaffiliation_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "organizationaffiliation_active_system" = EXCLUDED."organizationaffiliation_active_system", 
        "organizationaffiliation_active_value" = EXCLUDED."organizationaffiliation_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "organizationaffiliation_date_start", "organizationaffiliation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "organizationaffiliation_date_start" = EXCLUDED."organizationaffiliation_date_start", 
        "organizationaffiliation_date_end" = EXCLUDED."organizationaffiliation_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "patient_active_system", "patient_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Patient-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "patient_active_system" = EXCLUDED."patient_active_system", 
        "patient_active_value" = EXCLUDED."patient_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "individual_birthdate_start", "individual_birthdate_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/individual-birthdate'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "individual_birthdate_start" = EXCLUDED."individual_birthdate_start", 
        "individual_birthdate_end" = EXCLUDED."individual_birthdate_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "patient_death_date_start", "patient_death_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Patient-death-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "patient_death_date_start" = EXCLUDED."patient_death_date_start", 
        "patient_death_date_end" = EXCLUDED."patient_death_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "individual_gender_system", "individual_gender_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/individual-gender'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "individual_gender_system" = EXCLUDED."individual_gender_system", 
        "individual_gender_value" = EXCLUDED."individual_gender_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentnotice_created_start", "paymentnotice_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentNotice-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "paymentnotice_created_start" = EXCLUDED."paymentnotice_created_start", 
        "paymentnotice_created_end" = EXCLUDED."paymentnotice_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentnotice_status_system", "paymentnotice_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentNotice-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentnotice_status_system" = EXCLUDED."paymentnotice_status_system", 
        "paymentnotice_status_value" = EXCLUDED."paymentnotice_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_created_start", "paymentreconciliation_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "paymentreconciliation_created_start" = EXCLUDED."paymentreconciliation_created_start", 
        "paymentreconciliation_created_end" = EXCLUDED."paymentreconciliation_created_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "paymentreconciliation_disposition" = EXCLUDED."paymentreconciliation_disposition";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_outcome_system", "paymentreconciliation_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentreconciliation_outcome_system" = EXCLUDED."paymentreconciliation_outcome_system", 
        "paymentreconciliation_outcome_value" = EXCLUDED."paymentreconciliation_outcome_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_status_system", "paymentreconciliation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentreconciliation_status_system" = EXCLUDED."paymentreconciliation_status_system", 
        "paymentreconciliation_status_value" = EXCLUDED."paymentreconciliation_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_date_start", "plandefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "plandefinition_date_start" = EXCLUDED."plandefinition_date_start", 
        "plandefinition_date_end" = EXCLUDED."plandefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_description" = EXCLUDED."plandefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_effective_start", "plandefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "plandefinition_effective_start" = EXCLUDED."plandefinition_effective_start", 
        "plandefinition_effective_end" = EXCLUDED."plandefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_name" = EXCLUDED."plandefinition_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_publisher" = EXCLUDED."plandefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_status_system", "plandefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "plandefinition_status_system" = EXCLUDED."plandefinition_status_system", 
        "plandefinition_status_value" = EXCLUDED."plandefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_title" = EXCLUDED."plandefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "plandefinition_url" = EXCLUDED."plandefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_version_system", "plandefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "plandefinition_version_system" = EXCLUDED."plandefinition_version_system", 
        "plandefinition_version_value" = EXCLUDED."plandefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "practitioner_active_system", "practitioner_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Practitioner-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "practitioner_active_system" = EXCLUDED."practitioner_active_system", 
        "practitioner_active_value" = EXCLUDED."practitioner_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "practitionerrole_active_system", "practitionerrole_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PractitionerRole-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "practitionerrole_active_system" = EXCLUDED."practitionerrole_active_system", 
        "practitionerrole_active_value" = EXCLUDED."practitionerrole_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "practitionerrole_date_start", "practitionerrole_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PractitionerRole-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "practitionerrole_date_start" = EXCLUDED."practitionerrole_date_start", 
        "practitionerrole_date_end" = EXCLUDED."practitionerrole_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "procedure_status_system", "procedure_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Procedure-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "procedure_status_system" = EXCLUDED."procedure_status_system", 
        "procedure_status_value" = EXCLUDED."procedure_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "provenance_recorded_start", "provenance_recorded_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Provenance-recorded'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "provenance_recorded_start" = EXCLUDED."provenance_recorded_start", 
        "provenance_recorded_end" = EXCLUDED."provenance_recorded_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "provenance_when_start", "provenance_when_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Provenance-when'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "provenance_when_start" = EXCLUDED."provenance_when_start", 
        "provenance_when_end" = EXCLUDED."provenance_when_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_date_start", "questionnaire_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaire_date_start" = EXCLUDED."questionnaire_date_start", 
        "questionnaire_date_end" = EXCLUDED."questionnaire_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_description" = EXCLUDED."questionnaire_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_effective_start", "questionnaire_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaire_effective_start" = EXCLUDED."questionnaire_effective_start", 
        "questionnaire_effective_end" = EXCLUDED."questionnaire_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_name" = EXCLUDED."questionnaire_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_publisher" = EXCLUDED."questionnaire_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_status_system", "questionnaire_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaire_status_system" = EXCLUDED."questionnaire_status_system", 
        "questionnaire_status_value" = EXCLUDED."questionnaire_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_title" = EXCLUDED."questionnaire_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "questionnaire_url" = EXCLUDED."questionnaire_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_version_system", "questionnaire_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaire_version_system" = EXCLUDED."questionnaire_version_system", 
        "questionnaire_version_value" = EXCLUDED."questionnaire_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_authored_start", "questionnaireresponse_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaireresponse_authored_start" = EXCLUDED."questionnaireresponse_authored_start", 
        "questionnaireresponse_authored_end" = EXCLUDED."questionnaireresponse_authored_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_identifier_system", "questionnaireresponse_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaireresponse_identifier_system" = EXCLUDED."questionnaireresponse_identifier_system", 
        "questionnaireresponse_identifier_value" = EXCLUDED."questionnaireresponse_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_status_system", "questionnaireresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaireresponse_status_system" = EXCLUDED."questionnaireresponse_status_system", 
        "questionnaireresponse_status_value" = EXCLUDED."questionnaireresponse_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "relatedperson_active_system", "relatedperson_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RelatedPerson-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "relatedperson_active_system" = EXCLUDED."relatedperson_active_system", 
        "relatedperson_active_value" = EXCLUDED."relatedperson_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_authored_start", "requestgroup_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "requestgroup_authored_start" = EXCLUDED."requestgroup_authored_start", 
        "requestgroup_authored_end" = EXCLUDED."requestgroup_authored_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_group_identifier_system", "requestgroup_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_group_identifier_system" = EXCLUDED."requestgroup_group_identifier_system", 
        "requestgroup_group_identifier_value" = EXCLUDED."requestgroup_group_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_intent_system", "requestgroup_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_intent_system" = EXCLUDED."requestgroup_intent_system", 
        "requestgroup_intent_value" = EXCLUDED."requestgroup_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_priority_system", "requestgroup_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_priority_system" = EXCLUDED."requestgroup_priority_system", 
        "requestgroup_priority_value" = EXCLUDED."requestgroup_priority_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_status_system", "requestgroup_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_status_system" = EXCLUDED."requestgroup_status_system", 
        "requestgroup_status_value" = EXCLUDED."requestgroup_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_date_start", "researchdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchdefinition_date_start" = EXCLUDED."researchdefinition_date_start", 
        "researchdefinition_date_end" = EXCLUDED."researchdefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_description" = EXCLUDED."researchdefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_effective_start", "researchdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchdefinition_effective_start" = EXCLUDED."researchdefinition_effective_start", 
        "researchdefinition_effective_end" = EXCLUDED."researchdefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_name" = EXCLUDED."researchdefinition_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_publisher" = EXCLUDED."researchdefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_status_system", "researchdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchdefinition_status_system" = EXCLUDED."researchdefinition_status_system", 
        "researchdefinition_status_value" = EXCLUDED."researchdefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_title" = EXCLUDED."researchdefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "researchdefinition_url" = EXCLUDED."researchdefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_version_system", "researchdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchdefinition_version_system" = EXCLUDED."researchdefinition_version_system", 
        "researchdefinition_version_value" = EXCLUDED."researchdefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_date_start", "researchelementdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchelementdefinition_date_start" = EXCLUDED."researchelementdefinition_date_start", 
        "researchelementdefinition_date_end" = EXCLUDED."researchelementdefinition_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_description" = EXCLUDED."researchelementdefinition_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_effective_start", "researchelementdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchelementdefinition_effective_start" = EXCLUDED."researchelementdefinition_effective_start", 
        "researchelementdefinition_effective_end" = EXCLUDED."researchelementdefinition_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_name" = EXCLUDED."researchelementdefinition_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_publisher" = EXCLUDED."researchelementdefinition_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_status_system", "researchelementdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchelementdefinition_status_system" = EXCLUDED."researchelementdefinition_status_system", 
        "researchelementdefinition_status_value" = EXCLUDED."researchelementdefinition_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_title" = EXCLUDED."researchelementdefinition_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "researchelementdefinition_url" = EXCLUDED."researchelementdefinition_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_version_system", "researchelementdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchelementdefinition_version_system" = EXCLUDED."researchelementdefinition_version_system", 
        "researchelementdefinition_version_value" = EXCLUDED."researchelementdefinition_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_date_start", "researchstudy_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchstudy_date_start" = EXCLUDED."researchstudy_date_start", 
        "researchstudy_date_end" = EXCLUDED."researchstudy_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_status_system", "researchstudy_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchstudy_status_system" = EXCLUDED."researchstudy_status_system", 
        "researchstudy_status_value" = EXCLUDED."researchstudy_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchstudy_title" = EXCLUDED."researchstudy_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchsubject_date_start", "researchsubject_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchSubject-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchsubject_date_start" = EXCLUDED."researchsubject_date_start", 
        "researchsubject_date_end" = EXCLUDED."researchsubject_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "researchsubject_status_system", "researchsubject_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchSubject-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchsubject_status_system" = EXCLUDED."researchsubject_status_system", 
        "researchsubject_status_value" = EXCLUDED."researchsubject_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_date_start", "riskevidencesynthesis_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "riskevidencesynthesis_date_start" = EXCLUDED."riskevidencesynthesis_date_start", 
        "riskevidencesynthesis_date_end" = EXCLUDED."riskevidencesynthesis_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "riskevidencesynthesis_description" = EXCLUDED."riskevidencesynthesis_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_effective_start", "riskevidencesynthesis_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "riskevidencesynthesis_effective_start" = EXCLUDED."riskevidencesynthesis_effective_start", 
        "riskevidencesynthesis_effective_end" = EXCLUDED."riskevidencesynthesis_effective_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "riskevidencesynthesis_name" = EXCLUDED."riskevidencesynthesis_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "riskevidencesynthesis_publisher" = EXCLUDED."riskevidencesynthesis_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_status_system", "riskevidencesynthesis_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "riskevidencesynthesis_status_system" = EXCLUDED."riskevidencesynthesis_status_system", 
        "riskevidencesynthesis_status_value" = EXCLUDED."riskevidencesynthesis_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "riskevidencesynthesis_title" = EXCLUDED."riskevidencesynthesis_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "riskevidencesynthesis_url" = EXCLUDED."riskevidencesynthesis_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "riskevidencesynthesis_version_system", "riskevidencesynthesis_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RiskEvidenceSynthesis-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "riskevidencesynthesis_version_system" = EXCLUDED."riskevidencesynthesis_version_system", 
        "riskevidencesynthesis_version_value" = EXCLUDED."riskevidencesynthesis_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "schedule_active_system", "schedule_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Schedule-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "schedule_active_system" = EXCLUDED."schedule_active_system", 
        "schedule_active_value" = EXCLUDED."schedule_active_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "schedule_date_start", "schedule_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Schedule-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "schedule_date_start" = EXCLUDED."schedule_date_start", 
        "schedule_date_end" = EXCLUDED."schedule_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "searchparameter_code_system", "searchparameter_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SearchParameter-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "searchparameter_code_system" = EXCLUDED."searchparameter_code_system", 
        "searchparameter_code_value" = EXCLUDED."searchparameter_code_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "searchparameter_type_system", "searchparameter_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SearchParameter-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "searchparameter_type_system" = EXCLUDED."searchparameter_type_system", 
        "searchparameter_type_value" = EXCLUDED."searchparameter_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_authored_start", "servicerequest_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "servicerequest_authored_start" = EXCLUDED."servicerequest_authored_start", 
        "servicerequest_authored_end" = EXCLUDED."servicerequest_authored_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_intent_system", "servicerequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_intent_system" = EXCLUDED."servicerequest_intent_system", 
        "servicerequest_intent_value" = EXCLUDED."servicerequest_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_priority_system", "servicerequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_priority_system" = EXCLUDED."servicerequest_priority_system", 
        "servicerequest_priority_value" = EXCLUDED."servicerequest_priority_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_requisition_system", "servicerequest_requisition_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-requisition'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_requisition_system" = EXCLUDED."servicerequest_requisition_system", 
        "servicerequest_requisition_value" = EXCLUDED."servicerequest_requisition_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_status_system", "servicerequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_status_system" = EXCLUDED."servicerequest_status_system", 
        "servicerequest_status_value" = EXCLUDED."servicerequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "slot_start_start", "slot_start_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Slot-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "slot_start_start" = EXCLUDED."slot_start_start", 
        "slot_start_end" = EXCLUDED."slot_start_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "slot_status_system", "slot_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Slot-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "slot_status_system" = EXCLUDED."slot_status_system", 
        "slot_status_value" = EXCLUDED."slot_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_accession_system", "specimen_accession_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-accession'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimen_accession_system" = EXCLUDED."specimen_accession_system", 
        "specimen_accession_value" = EXCLUDED."specimen_accession_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_collected_start", "specimen_collected_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-collected'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "specimen_collected_start" = EXCLUDED."specimen_collected_start", 
        "specimen_collected_end" = EXCLUDED."specimen_collected_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_status_system", "specimen_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimen_status_system" = EXCLUDED."specimen_status_system", 
        "specimen_status_value" = EXCLUDED."specimen_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "specimendefinition_identifier_system", "specimendefinition_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SpecimenDefinition-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimendefinition_identifier_system" = EXCLUDED."specimendefinition_identifier_system", 
        "specimendefinition_identifier_value" = EXCLUDED."specimendefinition_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_abstract_system", "structuredefinition_abstract_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-abstract'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_abstract_system" = EXCLUDED."structuredefinition_abstract_system", 
        "structuredefinition_abstract_value" = EXCLUDED."structuredefinition_abstract_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_derivation_system", "structuredefinition_derivation_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-derivation'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_derivation_system" = EXCLUDED."structuredefinition_derivation_system", 
        "structuredefinition_derivation_value" = EXCLUDED."structuredefinition_derivation_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_experimental_system", "structuredefinition_experimental_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-experimental'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_experimental_system" = EXCLUDED."structuredefinition_experimental_system", 
        "structuredefinition_experimental_value" = EXCLUDED."structuredefinition_experimental_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_kind_system", "structuredefinition_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_kind_system" = EXCLUDED."structuredefinition_kind_system", 
        "structuredefinition_kind_value" = EXCLUDED."structuredefinition_kind_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_type")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "structuredefinition_type" = EXCLUDED."structuredefinition_type";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_criteria")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-criteria'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "subscription_criteria" = EXCLUDED."subscription_criteria";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_payload_system", "subscription_payload_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-payload'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_payload_system" = EXCLUDED."subscription_payload_system", 
        "subscription_payload_value" = EXCLUDED."subscription_payload_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_status_system", "subscription_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_status_system" = EXCLUDED."subscription_status_system", 
        "subscription_status_value" = EXCLUDED."subscription_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_type_system", "subscription_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_type_system" = EXCLUDED."subscription_type_system", 
        "subscription_type_value" = EXCLUDED."subscription_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "subscription_url" = EXCLUDED."subscription_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "substance_status_system", "substance_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Substance-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "substance_status_system" = EXCLUDED."substance_status_system", 
        "substance_status_value" = EXCLUDED."substance_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "supplydelivery_status_system", "supplydelivery_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SupplyDelivery-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "supplydelivery_status_system" = EXCLUDED."supplydelivery_status_system", 
        "supplydelivery_status_value" = EXCLUDED."supplydelivery_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "supplyrequest_status_system", "supplyrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SupplyRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "supplyrequest_status_system" = EXCLUDED."supplyrequest_status_system", 
        "supplyrequest_status_value" = EXCLUDED."supplyrequest_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_authored_on_start", "task_authored_on_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-authored-on'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_authored_on_start" = EXCLUDED."task_authored_on_start", 
        "task_authored_on_end" = EXCLUDED."task_authored_on_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_group_identifier_system", "task_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_group_identifier_system" = EXCLUDED."task_group_identifier_system", 
        "task_group_identifier_value" = EXCLUDED."task_group_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_intent_system", "task_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_intent_system" = EXCLUDED."task_intent_system", 
        "task_intent_value" = EXCLUDED."task_intent_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_modified_start", "task_modified_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-modified'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_modified_start" = EXCLUDED."task_modified_start", 
        "task_modified_end" = EXCLUDED."task_modified_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_period_start", "task_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_period_start" = EXCLUDED."task_period_start", 
        "task_period_end" = EXCLUDED."task_period_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_priority_system", "task_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_priority_system" = EXCLUDED."task_priority_system", 
        "task_priority_value" = EXCLUDED."task_priority_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "task_status_system", "task_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_status_system" = EXCLUDED."task_status_system", 
        "task_status_value" = EXCLUDED."task_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_identifier_system", "testreport_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testreport_identifier_system" = EXCLUDED."testreport_identifier_system", 
        "testreport_identifier_value" = EXCLUDED."testreport_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_issued_start", "testreport_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "testreport_issued_start" = EXCLUDED."testreport_issued_start", 
        "testreport_issued_end" = EXCLUDED."testreport_issued_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_result_system", "testreport_result_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-result'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testreport_result_system" = EXCLUDED."testreport_result_system", 
        "testreport_result_value" = EXCLUDED."testreport_result_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_tester")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-tester'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testreport_tester" = EXCLUDED."testreport_tester";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_date_start", "testscript_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "testscript_date_start" = EXCLUDED."testscript_date_start", 
        "testscript_date_end" = EXCLUDED."testscript_date_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_description" = EXCLUDED."testscript_description";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_identifier_system", "testscript_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_identifier_system" = EXCLUDED."testscript_identifier_system", 
        "testscript_identifier_value" = EXCLUDED."testscript_identifier_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_name" = EXCLUDED."testscript_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_publisher" = EXCLUDED."testscript_publisher";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_status_system", "testscript_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_status_system" = EXCLUDED."testscript_status_system", 
        "testscript_status_value" = EXCLUDED."testscript_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_title" = EXCLUDED."testscript_title";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "testscript_url" = EXCLUDED."testscript_url";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_version_system", "testscript_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_version_system" = EXCLUDED."testscript_version_system", 
        "testscript_version_value" = EXCLUDED."testscript_version_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "valueset_expansion")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ValueSet-expansion'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "valueset_expansion" = EXCLUDED."valueset_expansion";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "visionprescription_datewritten_start", "visionprescription_datewritten_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/VisionPrescription-datewritten'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "visionprescription_datewritten_start" = EXCLUDED."visionprescription_datewritten_start", 
        "visionprescription_datewritten_end" = EXCLUDED."visionprescription_datewritten_end";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "visionprescription_status_system", "visionprescription_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/VisionPrescription-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "visionprescription_status_system" = EXCLUDED."visionprescription_status_system", 
        "visionprescription_status_value" = EXCLUDED."visionprescription_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "accesspolicyv2_engine_system", "accesspolicyv2_engine_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-engine'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "accesspolicyv2_engine_system" = EXCLUDED."accesspolicyv2_engine_system", 
        "accesspolicyv2_engine_value" = EXCLUDED."accesspolicyv2_engine_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "accesspolicyv2_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/AccessPolicyV2-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "accesspolicyv2_name" = EXCLUDED."accesspolicyv2_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "accesspolicy_code_system", "accesspolicy_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/AccessPolicy-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "accesspolicy_code_system" = EXCLUDED."accesspolicy_code_system", 
        "accesspolicy_code_value" = EXCLUDED."accesspolicy_code_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "accesspolicy_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/AccessPolicy-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "accesspolicy_name" = EXCLUDED."accesspolicy_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "accesspolicy_type_system", "accesspolicy_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/AccessPolicy-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "accesspolicy_type_system" = EXCLUDED."accesspolicy_type_system", 
        "accesspolicy_type_value" = EXCLUDED."accesspolicy_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "clientapplication_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/ClientApplication-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "clientapplication_name" = EXCLUDED."clientapplication_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "identityprovider_accesstype_system", "identityprovider_accesstype_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/IdentityProvider-accessType'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "identityprovider_accesstype_system" = EXCLUDED."identityprovider_accesstype_system", 
        "identityprovider_accesstype_value" = EXCLUDED."identityprovider_accesstype_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "identityprovider_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/IdentityProvider-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "identityprovider_name" = EXCLUDED."identityprovider_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "identityprovider_status_system", "identityprovider_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/IdentityProvider-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "identityprovider_status_system" = EXCLUDED."identityprovider_status_system", 
        "identityprovider_status_value" = EXCLUDED."identityprovider_status_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "membership_email_system", "membership_email_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/Membership-email'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "membership_email_system" = EXCLUDED."membership_email_system", 
        "membership_email_value" = EXCLUDED."membership_email_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "membership_role_system", "membership_role_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/Membership-role'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "membership_role_system" = EXCLUDED."membership_role_system", 
        "membership_role_value" = EXCLUDED."membership_role_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagebroker_host")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_uri_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/MessageBroker-host'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "messagebroker_host" = EXCLUDED."messagebroker_host";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagebroker_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4_string_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/MessageBroker-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "messagebroker_name" = EXCLUDED."messagebroker_name";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagebroker_type_system", "messagebroker_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/MessageBroker-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagebroker_type_system" = EXCLUDED."messagebroker_type_system", 
        "messagebroker_type_value" = EXCLUDED."messagebroker_type_value";
 
        INSERT INTO "r4_sp1_idx" ("tenant", "r_id", "r_version_id", "messagetopic_topic_system", "messagetopic_topic_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4_token_idx" 
          WHERE ("parameter_url" = 'https://iguhealth.app/fhir/SearchParameter/MessageTopic-topic'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagetopic_topic_system" = EXCLUDED."messagetopic_topic_system", 
        "messagetopic_topic_value" = EXCLUDED."messagetopic_topic_value"; 
-- R4B SP1 SQL Migrations 

 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_id_system", "resource_id_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-id'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "resource_id_system" = EXCLUDED."resource_id_system", 
        "resource_id_value" = EXCLUDED."resource_id_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_lastupdated_start", "resource_lastupdated_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-lastUpdated'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "resource_lastupdated_start" = EXCLUDED."resource_lastupdated_start", 
        "resource_lastupdated_end" = EXCLUDED."resource_lastupdated_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "resource_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Resource-source'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "resource_source" = EXCLUDED."resource_source";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "account_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "account_name" = EXCLUDED."account_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "account_period_start", "account_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "account_period_start" = EXCLUDED."account_period_start", 
        "account_period_end" = EXCLUDED."account_period_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "account_status_system", "account_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Account-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "account_status_system" = EXCLUDED."account_status_system", 
        "account_status_value" = EXCLUDED."account_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_date_start", "activitydefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "activitydefinition_date_start" = EXCLUDED."activitydefinition_date_start", 
        "activitydefinition_date_end" = EXCLUDED."activitydefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_description" = EXCLUDED."activitydefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_effective_start", "activitydefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "activitydefinition_effective_start" = EXCLUDED."activitydefinition_effective_start", 
        "activitydefinition_effective_end" = EXCLUDED."activitydefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_name" = EXCLUDED."activitydefinition_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_publisher" = EXCLUDED."activitydefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_status_system", "activitydefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "activitydefinition_status_system" = EXCLUDED."activitydefinition_status_system", 
        "activitydefinition_status_value" = EXCLUDED."activitydefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "activitydefinition_title" = EXCLUDED."activitydefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "activitydefinition_url" = EXCLUDED."activitydefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "activitydefinition_version_system", "activitydefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ActivityDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "activitydefinition_version_system" = EXCLUDED."activitydefinition_version_system", 
        "activitydefinition_version_value" = EXCLUDED."activitydefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "adverseevent_actuality_system", "adverseevent_actuality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AdverseEvent-actuality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "adverseevent_actuality_system" = EXCLUDED."adverseevent_actuality_system", 
        "adverseevent_actuality_value" = EXCLUDED."adverseevent_actuality_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "adverseevent_date_start", "adverseevent_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AdverseEvent-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "adverseevent_date_start" = EXCLUDED."adverseevent_date_start", 
        "adverseevent_date_end" = EXCLUDED."adverseevent_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "allergyintolerance_criticality_system", "allergyintolerance_criticality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AllergyIntolerance-criticality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "allergyintolerance_criticality_system" = EXCLUDED."allergyintolerance_criticality_system", 
        "allergyintolerance_criticality_value" = EXCLUDED."allergyintolerance_criticality_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "allergyintolerance_last_date_start", "allergyintolerance_last_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AllergyIntolerance-last-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "allergyintolerance_last_date_start" = EXCLUDED."allergyintolerance_last_date_start", 
        "allergyintolerance_last_date_end" = EXCLUDED."allergyintolerance_last_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "appointment_date_start", "appointment_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Appointment-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "appointment_date_start" = EXCLUDED."appointment_date_start", 
        "appointment_date_end" = EXCLUDED."appointment_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "appointment_status_system", "appointment_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Appointment-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "appointment_status_system" = EXCLUDED."appointment_status_system", 
        "appointment_status_value" = EXCLUDED."appointment_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "appointmentresponse_part_status_system", "appointmentresponse_part_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AppointmentResponse-part-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "appointmentresponse_part_status_system" = EXCLUDED."appointmentresponse_part_status_system", 
        "appointmentresponse_part_status_value" = EXCLUDED."appointmentresponse_part_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_action_system", "auditevent_action_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-action'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_action_system" = EXCLUDED."auditevent_action_system", 
        "auditevent_action_value" = EXCLUDED."auditevent_action_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_date_start", "auditevent_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "auditevent_date_start" = EXCLUDED."auditevent_date_start", 
        "auditevent_date_end" = EXCLUDED."auditevent_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_outcome_system", "auditevent_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_outcome_system" = EXCLUDED."auditevent_outcome_system", 
        "auditevent_outcome_value" = EXCLUDED."auditevent_outcome_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_site_system", "auditevent_site_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-site'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_site_system" = EXCLUDED."auditevent_site_system", 
        "auditevent_site_value" = EXCLUDED."auditevent_site_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "auditevent_type_system", "auditevent_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/AuditEvent-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "auditevent_type_system" = EXCLUDED."auditevent_type_system", 
        "auditevent_type_value" = EXCLUDED."auditevent_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "basic_created_start", "basic_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Basic-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "basic_created_start" = EXCLUDED."basic_created_start", 
        "basic_created_end" = EXCLUDED."basic_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_identifier_system", "bundle_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "bundle_identifier_system" = EXCLUDED."bundle_identifier_system", 
        "bundle_identifier_value" = EXCLUDED."bundle_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_timestamp_start", "bundle_timestamp_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-timestamp'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "bundle_timestamp_start" = EXCLUDED."bundle_timestamp_start", 
        "bundle_timestamp_end" = EXCLUDED."bundle_timestamp_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "bundle_type_system", "bundle_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Bundle-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "bundle_type_system" = EXCLUDED."bundle_type_system", 
        "bundle_type_value" = EXCLUDED."bundle_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_date_start", "conformance_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "conformance_date_start" = EXCLUDED."conformance_date_start", 
        "conformance_date_end" = EXCLUDED."conformance_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_description" = EXCLUDED."conformance_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "capabilitystatement_fhirversion_system", "capabilitystatement_fhirversion_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CapabilityStatement-fhirversion'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "capabilitystatement_fhirversion_system" = EXCLUDED."capabilitystatement_fhirversion_system", 
        "capabilitystatement_fhirversion_value" = EXCLUDED."capabilitystatement_fhirversion_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_name" = EXCLUDED."conformance_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_publisher" = EXCLUDED."conformance_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "capabilitystatement_software")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CapabilityStatement-software'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "capabilitystatement_software" = EXCLUDED."capabilitystatement_software";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_status_system", "conformance_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "conformance_status_system" = EXCLUDED."conformance_status_system", 
        "conformance_status_value" = EXCLUDED."conformance_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "conformance_title" = EXCLUDED."conformance_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "conformance_url" = EXCLUDED."conformance_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "conformance_version_system", "conformance_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/conformance-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "conformance_version_system" = EXCLUDED."conformance_version_system", 
        "conformance_version_value" = EXCLUDED."conformance_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "careplan_intent_system", "careplan_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CarePlan-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careplan_intent_system" = EXCLUDED."careplan_intent_system", 
        "careplan_intent_value" = EXCLUDED."careplan_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "careplan_status_system", "careplan_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CarePlan-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careplan_status_system" = EXCLUDED."careplan_status_system", 
        "careplan_status_value" = EXCLUDED."careplan_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "careteam_status_system", "careteam_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CareTeam-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "careteam_status_system" = EXCLUDED."careteam_status_system", 
        "careteam_status_value" = EXCLUDED."careteam_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitem_entered_date_start", "chargeitem_entered_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-entered-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitem_entered_date_start" = EXCLUDED."chargeitem_entered_date_start", 
        "chargeitem_entered_date_end" = EXCLUDED."chargeitem_entered_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitem_factor_override")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-factor-override'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "chargeitem_factor_override" = EXCLUDED."chargeitem_factor_override";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "chargeitem_price_override_start_system", 
          "chargeitem_price_override_start_code", 
          "chargeitem_price_override_start_value", 
          "chargeitem_price_override_end_system",
          "chargeitem_price_override_end_code",
          "chargeitem_price_override_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-price-override'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitem_price_override_start_system" = EXCLUDED."chargeitem_price_override_start_system", 
        "chargeitem_price_override_start_code" =   EXCLUDED."chargeitem_price_override_start_code",
        "chargeitem_price_override_start_value" =  EXCLUDED."chargeitem_price_override_start_value",
        "chargeitem_price_override_end_system" =   EXCLUDED."chargeitem_price_override_end_system", 
        "chargeitem_price_override_end_code" =     EXCLUDED."chargeitem_price_override_end_code",
        "chargeitem_price_override_end_value" =    EXCLUDED."chargeitem_price_override_end_value";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "chargeitem_quantity_start_system", 
          "chargeitem_quantity_start_code", 
          "chargeitem_quantity_start_value", 
          "chargeitem_quantity_end_system",
          "chargeitem_quantity_end_code",
          "chargeitem_quantity_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItem-quantity'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitem_quantity_start_system" = EXCLUDED."chargeitem_quantity_start_system", 
        "chargeitem_quantity_start_code" =   EXCLUDED."chargeitem_quantity_start_code",
        "chargeitem_quantity_start_value" =  EXCLUDED."chargeitem_quantity_start_value",
        "chargeitem_quantity_end_system" =   EXCLUDED."chargeitem_quantity_end_system", 
        "chargeitem_quantity_end_code" =     EXCLUDED."chargeitem_quantity_end_code",
        "chargeitem_quantity_end_value" =    EXCLUDED."chargeitem_quantity_end_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_date_start", "chargeitemdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitemdefinition_date_start" = EXCLUDED."chargeitemdefinition_date_start", 
        "chargeitemdefinition_date_end" = EXCLUDED."chargeitemdefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_description" = EXCLUDED."chargeitemdefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_effective_start", "chargeitemdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "chargeitemdefinition_effective_start" = EXCLUDED."chargeitemdefinition_effective_start", 
        "chargeitemdefinition_effective_end" = EXCLUDED."chargeitemdefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_publisher" = EXCLUDED."chargeitemdefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_status_system", "chargeitemdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitemdefinition_status_system" = EXCLUDED."chargeitemdefinition_status_system", 
        "chargeitemdefinition_status_value" = EXCLUDED."chargeitemdefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "chargeitemdefinition_title" = EXCLUDED."chargeitemdefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "chargeitemdefinition_url" = EXCLUDED."chargeitemdefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "chargeitemdefinition_version_system", "chargeitemdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ChargeItemDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "chargeitemdefinition_version_system" = EXCLUDED."chargeitemdefinition_version_system", 
        "chargeitemdefinition_version_value" = EXCLUDED."chargeitemdefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_date_start", "citation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "citation_date_start" = EXCLUDED."citation_date_start", 
        "citation_date_end" = EXCLUDED."citation_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "citation_description" = EXCLUDED."citation_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_effective_start", "citation_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "citation_effective_start" = EXCLUDED."citation_effective_start", 
        "citation_effective_end" = EXCLUDED."citation_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "citation_name" = EXCLUDED."citation_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "citation_publisher" = EXCLUDED."citation_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_status_system", "citation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "citation_status_system" = EXCLUDED."citation_status_system", 
        "citation_status_value" = EXCLUDED."citation_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "citation_title" = EXCLUDED."citation_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "citation_url" = EXCLUDED."citation_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "citation_version_system", "citation_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Citation-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "citation_version_system" = EXCLUDED."citation_version_system", 
        "citation_version_value" = EXCLUDED."citation_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_created_start", "claim_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claim_created_start" = EXCLUDED."claim_created_start", 
        "claim_created_end" = EXCLUDED."claim_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_status_system", "claim_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claim_status_system" = EXCLUDED."claim_status_system", 
        "claim_status_value" = EXCLUDED."claim_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claim_use_system", "claim_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Claim-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claim_use_system" = EXCLUDED."claim_use_system", 
        "claim_use_value" = EXCLUDED."claim_use_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_created_start", "claimresponse_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claimresponse_created_start" = EXCLUDED."claimresponse_created_start", 
        "claimresponse_created_end" = EXCLUDED."claimresponse_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "claimresponse_disposition" = EXCLUDED."claimresponse_disposition";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_outcome_system", "claimresponse_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_outcome_system" = EXCLUDED."claimresponse_outcome_system", 
        "claimresponse_outcome_value" = EXCLUDED."claimresponse_outcome_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_payment_date_start", "claimresponse_payment_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-payment-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "claimresponse_payment_date_start" = EXCLUDED."claimresponse_payment_date_start", 
        "claimresponse_payment_date_end" = EXCLUDED."claimresponse_payment_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_status_system", "claimresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_status_system" = EXCLUDED."claimresponse_status_system", 
        "claimresponse_status_value" = EXCLUDED."claimresponse_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "claimresponse_use_system", "claimresponse_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClaimResponse-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "claimresponse_use_system" = EXCLUDED."claimresponse_use_system", 
        "claimresponse_use_value" = EXCLUDED."claimresponse_use_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "clinicalimpression_status_system", "clinicalimpression_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClinicalImpression-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "clinicalimpression_status_system" = EXCLUDED."clinicalimpression_status_system", 
        "clinicalimpression_status_value" = EXCLUDED."clinicalimpression_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "clinicalusedefinition_type_system", "clinicalusedefinition_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ClinicalUseDefinition-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "clinicalusedefinition_type_system" = EXCLUDED."clinicalusedefinition_type_system", 
        "clinicalusedefinition_type_value" = EXCLUDED."clinicalusedefinition_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "codesystem_content_mode_system", "codesystem_content_mode_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CodeSystem-content-mode'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "codesystem_content_mode_system" = EXCLUDED."codesystem_content_mode_system", 
        "codesystem_content_mode_value" = EXCLUDED."codesystem_content_mode_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "codesystem_system")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CodeSystem-system'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "codesystem_system" = EXCLUDED."codesystem_system";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_received_start", "communication_received_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-received'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communication_received_start" = EXCLUDED."communication_received_start", 
        "communication_received_end" = EXCLUDED."communication_received_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_sent_start", "communication_sent_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-sent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communication_sent_start" = EXCLUDED."communication_sent_start", 
        "communication_sent_end" = EXCLUDED."communication_sent_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communication_status_system", "communication_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Communication-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communication_status_system" = EXCLUDED."communication_status_system", 
        "communication_status_value" = EXCLUDED."communication_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_authored_start", "communicationrequest_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communicationrequest_authored_start" = EXCLUDED."communicationrequest_authored_start", 
        "communicationrequest_authored_end" = EXCLUDED."communicationrequest_authored_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_group_identifier_system", "communicationrequest_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_group_identifier_system" = EXCLUDED."communicationrequest_group_identifier_system", 
        "communicationrequest_group_identifier_value" = EXCLUDED."communicationrequest_group_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_occurrence_start", "communicationrequest_occurrence_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-occurrence'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "communicationrequest_occurrence_start" = EXCLUDED."communicationrequest_occurrence_start", 
        "communicationrequest_occurrence_end" = EXCLUDED."communicationrequest_occurrence_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_priority_system", "communicationrequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_priority_system" = EXCLUDED."communicationrequest_priority_system", 
        "communicationrequest_priority_value" = EXCLUDED."communicationrequest_priority_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "communicationrequest_status_system", "communicationrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CommunicationRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "communicationrequest_status_system" = EXCLUDED."communicationrequest_status_system", 
        "communicationrequest_status_value" = EXCLUDED."communicationrequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "compartmentdefinition_code_system", "compartmentdefinition_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CompartmentDefinition-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "compartmentdefinition_code_system" = EXCLUDED."compartmentdefinition_code_system", 
        "compartmentdefinition_code_value" = EXCLUDED."compartmentdefinition_code_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_confidentiality_system", "composition_confidentiality_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-confidentiality'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "composition_confidentiality_system" = EXCLUDED."composition_confidentiality_system", 
        "composition_confidentiality_value" = EXCLUDED."composition_confidentiality_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_status_system", "composition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "composition_status_system" = EXCLUDED."composition_status_system", 
        "composition_status_value" = EXCLUDED."composition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "composition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Composition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "composition_title" = EXCLUDED."composition_title";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "condition_abatement_age_start_system", 
          "condition_abatement_age_start_code", 
          "condition_abatement_age_start_value", 
          "condition_abatement_age_end_system",
          "condition_abatement_age_end_code",
          "condition_abatement_age_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-age'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "condition_abatement_age_start_system" = EXCLUDED."condition_abatement_age_start_system", 
        "condition_abatement_age_start_code" =   EXCLUDED."condition_abatement_age_start_code",
        "condition_abatement_age_start_value" =  EXCLUDED."condition_abatement_age_start_value",
        "condition_abatement_age_end_system" =   EXCLUDED."condition_abatement_age_end_system", 
        "condition_abatement_age_end_code" =     EXCLUDED."condition_abatement_age_end_code",
        "condition_abatement_age_end_value" =    EXCLUDED."condition_abatement_age_end_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_abatement_date_start", "condition_abatement_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_abatement_date_start" = EXCLUDED."condition_abatement_date_start", 
        "condition_abatement_date_end" = EXCLUDED."condition_abatement_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_abatement_string")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-abatement-string'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "condition_abatement_string" = EXCLUDED."condition_abatement_string";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "condition_onset_age_start_system", 
          "condition_onset_age_start_code", 
          "condition_onset_age_start_value", 
          "condition_onset_age_end_system",
          "condition_onset_age_end_code",
          "condition_onset_age_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-age'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "condition_onset_age_start_system" = EXCLUDED."condition_onset_age_start_system", 
        "condition_onset_age_start_code" =   EXCLUDED."condition_onset_age_start_code",
        "condition_onset_age_start_value" =  EXCLUDED."condition_onset_age_start_value",
        "condition_onset_age_end_system" =   EXCLUDED."condition_onset_age_end_system", 
        "condition_onset_age_end_code" =     EXCLUDED."condition_onset_age_end_code",
        "condition_onset_age_end_value" =    EXCLUDED."condition_onset_age_end_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_onset_date_start", "condition_onset_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_onset_date_start" = EXCLUDED."condition_onset_date_start", 
        "condition_onset_date_end" = EXCLUDED."condition_onset_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_onset_info")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-onset-info'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "condition_onset_info" = EXCLUDED."condition_onset_info";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "condition_recorded_date_start", "condition_recorded_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Condition-recorded-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "condition_recorded_date_start" = EXCLUDED."condition_recorded_date_start", 
        "condition_recorded_date_end" = EXCLUDED."condition_recorded_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "consent_period_start", "consent_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Consent-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "consent_period_start" = EXCLUDED."consent_period_start", 
        "consent_period_end" = EXCLUDED."consent_period_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "consent_status_system", "consent_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Consent-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "consent_status_system" = EXCLUDED."consent_status_system", 
        "consent_status_value" = EXCLUDED."consent_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_instantiates")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-instantiates'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "contract_instantiates" = EXCLUDED."contract_instantiates";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_issued_start", "contract_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "contract_issued_start" = EXCLUDED."contract_issued_start", 
        "contract_issued_end" = EXCLUDED."contract_issued_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_status_system", "contract_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "contract_status_system" = EXCLUDED."contract_status_system", 
        "contract_status_value" = EXCLUDED."contract_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "contract_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Contract-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "contract_url" = EXCLUDED."contract_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverage_dependent")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Coverage-dependent'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "coverage_dependent" = EXCLUDED."coverage_dependent";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverage_status_system", "coverage_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Coverage-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverage_status_system" = EXCLUDED."coverage_status_system", 
        "coverage_status_value" = EXCLUDED."coverage_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityrequest_created_start", "coverageeligibilityrequest_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "coverageeligibilityrequest_created_start" = EXCLUDED."coverageeligibilityrequest_created_start", 
        "coverageeligibilityrequest_created_end" = EXCLUDED."coverageeligibilityrequest_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityrequest_status_system", "coverageeligibilityrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityrequest_status_system" = EXCLUDED."coverageeligibilityrequest_status_system", 
        "coverageeligibilityrequest_status_value" = EXCLUDED."coverageeligibilityrequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_created_start", "coverageeligibilityresponse_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "coverageeligibilityresponse_created_start" = EXCLUDED."coverageeligibilityresponse_created_start", 
        "coverageeligibilityresponse_created_end" = EXCLUDED."coverageeligibilityresponse_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "coverageeligibilityresponse_disposition" = EXCLUDED."coverageeligibilityresponse_disposition";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_outcome_system", "coverageeligibilityresponse_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityresponse_outcome_system" = EXCLUDED."coverageeligibilityresponse_outcome_system", 
        "coverageeligibilityresponse_outcome_value" = EXCLUDED."coverageeligibilityresponse_outcome_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "coverageeligibilityresponse_status_system", "coverageeligibilityresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/CoverageEligibilityResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "coverageeligibilityresponse_status_system" = EXCLUDED."coverageeligibilityresponse_status_system", 
        "coverageeligibilityresponse_status_value" = EXCLUDED."coverageeligibilityresponse_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "detectedissue_identified_start", "detectedissue_identified_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DetectedIssue-identified'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "detectedissue_identified_start" = EXCLUDED."detectedissue_identified_start", 
        "detectedissue_identified_end" = EXCLUDED."detectedissue_identified_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "device_manufacturer")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-manufacturer'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "device_manufacturer" = EXCLUDED."device_manufacturer";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "device_model")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-model'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "device_model" = EXCLUDED."device_model";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "device_status_system", "device_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "device_status_system" = EXCLUDED."device_status_system", 
        "device_status_value" = EXCLUDED."device_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "device_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Device-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "device_url" = EXCLUDED."device_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicemetric_category_system", "devicemetric_category_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceMetric-category'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicemetric_category_system" = EXCLUDED."devicemetric_category_system", 
        "devicemetric_category_value" = EXCLUDED."devicemetric_category_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_authored_on_start", "devicerequest_authored_on_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-authored-on'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "devicerequest_authored_on_start" = EXCLUDED."devicerequest_authored_on_start", 
        "devicerequest_authored_on_end" = EXCLUDED."devicerequest_authored_on_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_event_date_start", "devicerequest_event_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-event-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "devicerequest_event_date_start" = EXCLUDED."devicerequest_event_date_start", 
        "devicerequest_event_date_end" = EXCLUDED."devicerequest_event_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_group_identifier_system", "devicerequest_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_group_identifier_system" = EXCLUDED."devicerequest_group_identifier_system", 
        "devicerequest_group_identifier_value" = EXCLUDED."devicerequest_group_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_intent_system", "devicerequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_intent_system" = EXCLUDED."devicerequest_intent_system", 
        "devicerequest_intent_value" = EXCLUDED."devicerequest_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "devicerequest_status_system", "devicerequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DeviceRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "devicerequest_status_system" = EXCLUDED."devicerequest_status_system", 
        "devicerequest_status_value" = EXCLUDED."devicerequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "diagnosticreport_issued_start", "diagnosticreport_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DiagnosticReport-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "diagnosticreport_issued_start" = EXCLUDED."diagnosticreport_issued_start", 
        "diagnosticreport_issued_end" = EXCLUDED."diagnosticreport_issued_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "diagnosticreport_status_system", "diagnosticreport_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DiagnosticReport-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "diagnosticreport_status_system" = EXCLUDED."diagnosticreport_status_system", 
        "diagnosticreport_status_value" = EXCLUDED."diagnosticreport_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_created_start", "documentmanifest_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentmanifest_created_start" = EXCLUDED."documentmanifest_created_start", 
        "documentmanifest_created_end" = EXCLUDED."documentmanifest_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "documentmanifest_description" = EXCLUDED."documentmanifest_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-source'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "documentmanifest_source" = EXCLUDED."documentmanifest_source";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentmanifest_status_system", "documentmanifest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentManifest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "documentmanifest_status_system" = EXCLUDED."documentmanifest_status_system", 
        "documentmanifest_status_value" = EXCLUDED."documentmanifest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_date_start", "documentreference_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentreference_date_start" = EXCLUDED."documentreference_date_start", 
        "documentreference_date_end" = EXCLUDED."documentreference_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "documentreference_description" = EXCLUDED."documentreference_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_period_start", "documentreference_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "documentreference_period_start" = EXCLUDED."documentreference_period_start", 
        "documentreference_period_end" = EXCLUDED."documentreference_period_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "documentreference_status_system", "documentreference_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/DocumentReference-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "documentreference_status_system" = EXCLUDED."documentreference_status_system", 
        "documentreference_status_value" = EXCLUDED."documentreference_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "encounter_class_system", "encounter_class_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-class'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_class_system" = EXCLUDED."encounter_class_system", 
        "encounter_class_value" = EXCLUDED."encounter_class_value";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "encounter_length_start_system", 
          "encounter_length_start_code", 
          "encounter_length_start_value", 
          "encounter_length_end_system",
          "encounter_length_end_code",
          "encounter_length_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-length'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_length_start_system" = EXCLUDED."encounter_length_start_system", 
        "encounter_length_start_code" =   EXCLUDED."encounter_length_start_code",
        "encounter_length_start_value" =  EXCLUDED."encounter_length_start_value",
        "encounter_length_end_system" =   EXCLUDED."encounter_length_end_system", 
        "encounter_length_end_code" =     EXCLUDED."encounter_length_end_code",
        "encounter_length_end_value" =    EXCLUDED."encounter_length_end_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "encounter_status_system", "encounter_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Encounter-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "encounter_status_system" = EXCLUDED."encounter_status_system", 
        "encounter_status_value" = EXCLUDED."encounter_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_connection_type_system", "endpoint_connection_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-connection-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "endpoint_connection_type_system" = EXCLUDED."endpoint_connection_type_system", 
        "endpoint_connection_type_value" = EXCLUDED."endpoint_connection_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "endpoint_name" = EXCLUDED."endpoint_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "endpoint_status_system", "endpoint_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Endpoint-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "endpoint_status_system" = EXCLUDED."endpoint_status_system", 
        "endpoint_status_value" = EXCLUDED."endpoint_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "enrollmentrequest_status_system", "enrollmentrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EnrollmentRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "enrollmentrequest_status_system" = EXCLUDED."enrollmentrequest_status_system", 
        "enrollmentrequest_status_value" = EXCLUDED."enrollmentrequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "enrollmentresponse_status_system", "enrollmentresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EnrollmentResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "enrollmentresponse_status_system" = EXCLUDED."enrollmentresponse_status_system", 
        "enrollmentresponse_status_value" = EXCLUDED."enrollmentresponse_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "episodeofcare_status_system", "episodeofcare_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EpisodeOfCare-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "episodeofcare_status_system" = EXCLUDED."episodeofcare_status_system", 
        "episodeofcare_status_value" = EXCLUDED."episodeofcare_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_date_start", "eventdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "eventdefinition_date_start" = EXCLUDED."eventdefinition_date_start", 
        "eventdefinition_date_end" = EXCLUDED."eventdefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_description" = EXCLUDED."eventdefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_effective_start", "eventdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "eventdefinition_effective_start" = EXCLUDED."eventdefinition_effective_start", 
        "eventdefinition_effective_end" = EXCLUDED."eventdefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_name" = EXCLUDED."eventdefinition_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_publisher" = EXCLUDED."eventdefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_status_system", "eventdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "eventdefinition_status_system" = EXCLUDED."eventdefinition_status_system", 
        "eventdefinition_status_value" = EXCLUDED."eventdefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "eventdefinition_title" = EXCLUDED."eventdefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "eventdefinition_url" = EXCLUDED."eventdefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "eventdefinition_version_system", "eventdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EventDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "eventdefinition_version_system" = EXCLUDED."eventdefinition_version_system", 
        "eventdefinition_version_value" = EXCLUDED."eventdefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_date_start", "evidence_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidence_date_start" = EXCLUDED."evidence_date_start", 
        "evidence_date_end" = EXCLUDED."evidence_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_description" = EXCLUDED."evidence_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_publisher" = EXCLUDED."evidence_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_status_system", "evidence_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidence_status_system" = EXCLUDED."evidence_status_system", 
        "evidence_status_value" = EXCLUDED."evidence_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidence_title" = EXCLUDED."evidence_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "evidence_url" = EXCLUDED."evidence_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidence_version_system", "evidence_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Evidence-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidence_version_system" = EXCLUDED."evidence_version_system", 
        "evidence_version_value" = EXCLUDED."evidence_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencereport_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceReport-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencereport_publisher" = EXCLUDED."evidencereport_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencereport_status_system", "evidencereport_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceReport-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidencereport_status_system" = EXCLUDED."evidencereport_status_system", 
        "evidencereport_status_value" = EXCLUDED."evidencereport_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencereport_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceReport-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "evidencereport_url" = EXCLUDED."evidencereport_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_date_start", "evidencevariable_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "evidencevariable_date_start" = EXCLUDED."evidencevariable_date_start", 
        "evidencevariable_date_end" = EXCLUDED."evidencevariable_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_description" = EXCLUDED."evidencevariable_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_name" = EXCLUDED."evidencevariable_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_publisher" = EXCLUDED."evidencevariable_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_status_system", "evidencevariable_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidencevariable_status_system" = EXCLUDED."evidencevariable_status_system", 
        "evidencevariable_status_value" = EXCLUDED."evidencevariable_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "evidencevariable_title" = EXCLUDED."evidencevariable_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "evidencevariable_url" = EXCLUDED."evidencevariable_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "evidencevariable_version_system", "evidencevariable_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/EvidenceVariable-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "evidencevariable_version_system" = EXCLUDED."evidencevariable_version_system", 
        "evidencevariable_version_value" = EXCLUDED."evidencevariable_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_date_start", "examplescenario_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "examplescenario_date_start" = EXCLUDED."examplescenario_date_start", 
        "examplescenario_date_end" = EXCLUDED."examplescenario_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "examplescenario_name" = EXCLUDED."examplescenario_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "examplescenario_publisher" = EXCLUDED."examplescenario_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_status_system", "examplescenario_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "examplescenario_status_system" = EXCLUDED."examplescenario_status_system", 
        "examplescenario_status_value" = EXCLUDED."examplescenario_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "examplescenario_url" = EXCLUDED."examplescenario_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "examplescenario_version_system", "examplescenario_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExampleScenario-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "examplescenario_version_system" = EXCLUDED."examplescenario_version_system", 
        "examplescenario_version_value" = EXCLUDED."examplescenario_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_created_start", "explanationofbenefit_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "explanationofbenefit_created_start" = EXCLUDED."explanationofbenefit_created_start", 
        "explanationofbenefit_created_end" = EXCLUDED."explanationofbenefit_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "explanationofbenefit_disposition" = EXCLUDED."explanationofbenefit_disposition";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "explanationofbenefit_status_system", "explanationofbenefit_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ExplanationOfBenefit-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "explanationofbenefit_status_system" = EXCLUDED."explanationofbenefit_status_system", 
        "explanationofbenefit_status_value" = EXCLUDED."explanationofbenefit_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "familymemberhistory_status_system", "familymemberhistory_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/FamilyMemberHistory-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "familymemberhistory_status_system" = EXCLUDED."familymemberhistory_status_system", 
        "familymemberhistory_status_value" = EXCLUDED."familymemberhistory_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "goal_lifecycle_status_system", "goal_lifecycle_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Goal-lifecycle-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "goal_lifecycle_status_system" = EXCLUDED."goal_lifecycle_status_system", 
        "goal_lifecycle_status_value" = EXCLUDED."goal_lifecycle_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "goal_start_date_start", "goal_start_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Goal-start-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "goal_start_date_start" = EXCLUDED."goal_start_date_start", 
        "goal_start_date_end" = EXCLUDED."goal_start_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "graphdefinition_start_system", "graphdefinition_start_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/GraphDefinition-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "graphdefinition_start_system" = EXCLUDED."graphdefinition_start_system", 
        "graphdefinition_start_value" = EXCLUDED."graphdefinition_start_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "group_actual_system", "group_actual_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Group-actual'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "group_actual_system" = EXCLUDED."group_actual_system", 
        "group_actual_value" = EXCLUDED."group_actual_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "group_type_system", "group_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Group-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "group_type_system" = EXCLUDED."group_type_system", 
        "group_type_value" = EXCLUDED."group_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "guidanceresponse_request_system", "guidanceresponse_request_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/GuidanceResponse-request'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "guidanceresponse_request_system" = EXCLUDED."guidanceresponse_request_system", 
        "guidanceresponse_request_value" = EXCLUDED."guidanceresponse_request_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "healthcareservice_active_system", "healthcareservice_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/HealthcareService-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "healthcareservice_active_system" = EXCLUDED."healthcareservice_active_system", 
        "healthcareservice_active_value" = EXCLUDED."healthcareservice_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "healthcareservice_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/HealthcareService-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "healthcareservice_name" = EXCLUDED."healthcareservice_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "imagingstudy_started_start", "imagingstudy_started_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImagingStudy-started'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "imagingstudy_started_start" = EXCLUDED."imagingstudy_started_start", 
        "imagingstudy_started_end" = EXCLUDED."imagingstudy_started_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "imagingstudy_status_system", "imagingstudy_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImagingStudy-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "imagingstudy_status_system" = EXCLUDED."imagingstudy_status_system", 
        "imagingstudy_status_value" = EXCLUDED."imagingstudy_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "immunization_lot_number")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Immunization-lot-number'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "immunization_lot_number" = EXCLUDED."immunization_lot_number";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "immunization_status_system", "immunization_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Immunization-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "immunization_status_system" = EXCLUDED."immunization_status_system", 
        "immunization_status_value" = EXCLUDED."immunization_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationevaluation_date_start", "immunizationevaluation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "immunizationevaluation_date_start" = EXCLUDED."immunizationevaluation_date_start", 
        "immunizationevaluation_date_end" = EXCLUDED."immunizationevaluation_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationevaluation_status_system", "immunizationevaluation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationEvaluation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "immunizationevaluation_status_system" = EXCLUDED."immunizationevaluation_status_system", 
        "immunizationevaluation_status_value" = EXCLUDED."immunizationevaluation_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "immunizationrecommendation_date_start", "immunizationrecommendation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "immunizationrecommendation_date_start" = EXCLUDED."immunizationrecommendation_date_start", 
        "immunizationrecommendation_date_end" = EXCLUDED."immunizationrecommendation_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "implementationguide_experimental_system", "implementationguide_experimental_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ImplementationGuide-experimental'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "implementationguide_experimental_system" = EXCLUDED."implementationguide_experimental_system", 
        "implementationguide_experimental_value" = EXCLUDED."implementationguide_experimental_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "ingredient_identifier_system", "ingredient_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Ingredient-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "ingredient_identifier_system" = EXCLUDED."ingredient_identifier_system", 
        "ingredient_identifier_value" = EXCLUDED."ingredient_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "insuranceplan_phonetic")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/InsurancePlan-phonetic'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "insuranceplan_phonetic" = EXCLUDED."insuranceplan_phonetic";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "insuranceplan_status_system", "insuranceplan_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/InsurancePlan-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "insuranceplan_status_system" = EXCLUDED."insuranceplan_status_system", 
        "insuranceplan_status_value" = EXCLUDED."insuranceplan_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "invoice_date_start", "invoice_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "invoice_date_start" = EXCLUDED."invoice_date_start", 
        "invoice_date_end" = EXCLUDED."invoice_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "invoice_status_system", "invoice_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_status_system" = EXCLUDED."invoice_status_system", 
        "invoice_status_value" = EXCLUDED."invoice_status_value";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "invoice_totalgross_start_system", 
          "invoice_totalgross_start_code", 
          "invoice_totalgross_start_value", 
          "invoice_totalgross_end_system",
          "invoice_totalgross_end_code",
          "invoice_totalgross_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-totalgross'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_totalgross_start_system" = EXCLUDED."invoice_totalgross_start_system", 
        "invoice_totalgross_start_code" =   EXCLUDED."invoice_totalgross_start_code",
        "invoice_totalgross_start_value" =  EXCLUDED."invoice_totalgross_start_value",
        "invoice_totalgross_end_system" =   EXCLUDED."invoice_totalgross_end_system", 
        "invoice_totalgross_end_code" =     EXCLUDED."invoice_totalgross_end_code",
        "invoice_totalgross_end_value" =    EXCLUDED."invoice_totalgross_end_value";
 
        INSERT INTO "r4b_sp1_idx" (
          "tenant",
          "r_id", 
          "r_version_id", 
          "invoice_totalnet_start_system", 
          "invoice_totalnet_start_code", 
          "invoice_totalnet_start_value", 
          "invoice_totalnet_end_system",
          "invoice_totalnet_end_code",
          "invoice_totalnet_end_value"
        )
        ( SELECT 
         "tenant",
         "r_id", 
         "r_version_id", 
         "start_system", 
         "start_code",
         "start_value",
         "end_system", 
         "end_code",
         "end_value" 
          FROM "r4b_quantity_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Invoice-totalnet'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "invoice_totalnet_start_system" = EXCLUDED."invoice_totalnet_start_system", 
        "invoice_totalnet_start_code" =   EXCLUDED."invoice_totalnet_start_code",
        "invoice_totalnet_start_value" =  EXCLUDED."invoice_totalnet_start_value",
        "invoice_totalnet_end_system" =   EXCLUDED."invoice_totalnet_end_system", 
        "invoice_totalnet_end_code" =     EXCLUDED."invoice_totalnet_end_code",
        "invoice_totalnet_end_value" =    EXCLUDED."invoice_totalnet_end_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_date_start", "library_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "library_date_start" = EXCLUDED."library_date_start", 
        "library_date_end" = EXCLUDED."library_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_description" = EXCLUDED."library_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_effective_start", "library_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "library_effective_start" = EXCLUDED."library_effective_start", 
        "library_effective_end" = EXCLUDED."library_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_name" = EXCLUDED."library_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_publisher" = EXCLUDED."library_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_status_system", "library_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "library_status_system" = EXCLUDED."library_status_system", 
        "library_status_value" = EXCLUDED."library_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "library_title" = EXCLUDED."library_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "library_url" = EXCLUDED."library_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "library_version_system", "library_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Library-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "library_version_system" = EXCLUDED."library_version_system", 
        "library_version_value" = EXCLUDED."library_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "list_status_system", "list_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/List-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "list_status_system" = EXCLUDED."list_status_system", 
        "list_status_value" = EXCLUDED."list_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "list_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/List-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "list_title" = EXCLUDED."list_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_city")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-city'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_city" = EXCLUDED."location_address_city";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_country")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-country'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_country" = EXCLUDED."location_address_country";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_postalcode")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-postalcode'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_postalcode" = EXCLUDED."location_address_postalcode";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_state")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-state'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "location_address_state" = EXCLUDED."location_address_state";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_address_use_system", "location_address_use_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-address-use'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_address_use_system" = EXCLUDED."location_address_use_system", 
        "location_address_use_value" = EXCLUDED."location_address_use_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_operational_status_system", "location_operational_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-operational-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_operational_status_system" = EXCLUDED."location_operational_status_system", 
        "location_operational_status_value" = EXCLUDED."location_operational_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "location_status_system", "location_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Location-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "location_status_system" = EXCLUDED."location_status_system", 
        "location_status_value" = EXCLUDED."location_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_date_start", "measure_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measure_date_start" = EXCLUDED."measure_date_start", 
        "measure_date_end" = EXCLUDED."measure_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_description" = EXCLUDED."measure_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_effective_start", "measure_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measure_effective_start" = EXCLUDED."measure_effective_start", 
        "measure_effective_end" = EXCLUDED."measure_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_name" = EXCLUDED."measure_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_publisher" = EXCLUDED."measure_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_status_system", "measure_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measure_status_system" = EXCLUDED."measure_status_system", 
        "measure_status_value" = EXCLUDED."measure_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "measure_title" = EXCLUDED."measure_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "measure_url" = EXCLUDED."measure_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measure_version_system", "measure_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Measure-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measure_version_system" = EXCLUDED."measure_version_system", 
        "measure_version_value" = EXCLUDED."measure_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_date_start", "measurereport_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measurereport_date_start" = EXCLUDED."measurereport_date_start", 
        "measurereport_date_end" = EXCLUDED."measurereport_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_period_start", "measurereport_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "measurereport_period_start" = EXCLUDED."measurereport_period_start", 
        "measurereport_period_end" = EXCLUDED."measurereport_period_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "measurereport_status_system", "measurereport_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MeasureReport-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "measurereport_status_system" = EXCLUDED."measurereport_status_system", 
        "measurereport_status_value" = EXCLUDED."measurereport_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "media_created_start", "media_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Media-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "media_created_start" = EXCLUDED."media_created_start", 
        "media_created_end" = EXCLUDED."media_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "media_status_system", "media_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Media-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "media_status_system" = EXCLUDED."media_status_system", 
        "media_status_value" = EXCLUDED."media_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_expiration_date_start", "medication_expiration_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-expiration-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medication_expiration_date_start" = EXCLUDED."medication_expiration_date_start", 
        "medication_expiration_date_end" = EXCLUDED."medication_expiration_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_lot_number_system", "medication_lot_number_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-lot-number'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medication_lot_number_system" = EXCLUDED."medication_lot_number_system", 
        "medication_lot_number_value" = EXCLUDED."medication_lot_number_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medication_status_system", "medication_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Medication-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medication_status_system" = EXCLUDED."medication_status_system", 
        "medication_status_value" = EXCLUDED."medication_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationadministration_effective_time_start", "medicationadministration_effective_time_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationAdministration-effective-time'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationadministration_effective_time_start" = EXCLUDED."medicationadministration_effective_time_start", 
        "medicationadministration_effective_time_end" = EXCLUDED."medicationadministration_effective_time_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medications_status_system", "medications_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/medications-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medications_status_system" = EXCLUDED."medications_status_system", 
        "medications_status_value" = EXCLUDED."medications_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationdispense_whenhandedover_start", "medicationdispense_whenhandedover_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationDispense-whenhandedover'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationdispense_whenhandedover_start" = EXCLUDED."medicationdispense_whenhandedover_start", 
        "medicationdispense_whenhandedover_end" = EXCLUDED."medicationdispense_whenhandedover_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationdispense_whenprepared_start", "medicationdispense_whenprepared_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationDispense-whenprepared'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationdispense_whenprepared_start" = EXCLUDED."medicationdispense_whenprepared_start", 
        "medicationdispense_whenprepared_end" = EXCLUDED."medicationdispense_whenprepared_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationknowledge_status_system", "medicationknowledge_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationKnowledge-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationknowledge_status_system" = EXCLUDED."medicationknowledge_status_system", 
        "medicationknowledge_status_value" = EXCLUDED."medicationknowledge_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_authoredon_start", "medicationrequest_authoredon_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-authoredon'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationrequest_authoredon_start" = EXCLUDED."medicationrequest_authoredon_start", 
        "medicationrequest_authoredon_end" = EXCLUDED."medicationrequest_authoredon_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_intent_system", "medicationrequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationrequest_intent_system" = EXCLUDED."medicationrequest_intent_system", 
        "medicationrequest_intent_value" = EXCLUDED."medicationrequest_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationrequest_priority_system", "medicationrequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "medicationrequest_priority_system" = EXCLUDED."medicationrequest_priority_system", 
        "medicationrequest_priority_value" = EXCLUDED."medicationrequest_priority_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "medicationstatement_effective_start", "medicationstatement_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MedicationStatement-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "medicationstatement_effective_start" = EXCLUDED."medicationstatement_effective_start", 
        "medicationstatement_effective_end" = EXCLUDED."medicationstatement_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messagedefinition_category_system", "messagedefinition_category_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageDefinition-category'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagedefinition_category_system" = EXCLUDED."messagedefinition_category_system", 
        "messagedefinition_category_value" = EXCLUDED."messagedefinition_category_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messagedefinition_event_system", "messagedefinition_event_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageDefinition-event'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messagedefinition_event_system" = EXCLUDED."messagedefinition_event_system", 
        "messagedefinition_event_value" = EXCLUDED."messagedefinition_event_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_code_system", "messageheader_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_code_system" = EXCLUDED."messageheader_code_system", 
        "messageheader_code_value" = EXCLUDED."messageheader_code_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_event_system", "messageheader_event_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-event'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_event_system" = EXCLUDED."messageheader_event_system", 
        "messageheader_event_value" = EXCLUDED."messageheader_event_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_response_id_system", "messageheader_response_id_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-response-id'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "messageheader_response_id_system" = EXCLUDED."messageheader_response_id_system", 
        "messageheader_response_id_value" = EXCLUDED."messageheader_response_id_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_source")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-source'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "messageheader_source" = EXCLUDED."messageheader_source";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "messageheader_source_uri")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MessageHeader-source-uri'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "messageheader_source_uri" = EXCLUDED."messageheader_source_uri";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_type_system", "molecularsequence_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "molecularsequence_type_system" = EXCLUDED."molecularsequence_type_system", 
        "molecularsequence_type_value" = EXCLUDED."molecularsequence_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_window_end")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-window-end'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "molecularsequence_window_end" = EXCLUDED."molecularsequence_window_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "molecularsequence_window_start")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_number_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/MolecularSequence-window-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "molecularsequence_window_start" = EXCLUDED."molecularsequence_window_start";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "namingsystem_kind_system", "namingsystem_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NamingSystem-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "namingsystem_kind_system" = EXCLUDED."namingsystem_kind_system", 
        "namingsystem_kind_value" = EXCLUDED."namingsystem_kind_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "namingsystem_responsible")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NamingSystem-responsible'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "namingsystem_responsible" = EXCLUDED."namingsystem_responsible";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "nutritionorder_datetime_start", "nutritionorder_datetime_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NutritionOrder-datetime'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "nutritionorder_datetime_start" = EXCLUDED."nutritionorder_datetime_start", 
        "nutritionorder_datetime_end" = EXCLUDED."nutritionorder_datetime_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "nutritionorder_status_system", "nutritionorder_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NutritionOrder-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "nutritionorder_status_system" = EXCLUDED."nutritionorder_status_system", 
        "nutritionorder_status_value" = EXCLUDED."nutritionorder_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "nutritionproduct_status_system", "nutritionproduct_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/NutritionProduct-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "nutritionproduct_status_system" = EXCLUDED."nutritionproduct_status_system", 
        "nutritionproduct_status_value" = EXCLUDED."nutritionproduct_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_status_system", "observation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "observation_status_system" = EXCLUDED."observation_status_system", 
        "observation_status_value" = EXCLUDED."observation_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_value_date_start", "observation_value_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-value-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "observation_value_date_start" = EXCLUDED."observation_value_date_start", 
        "observation_value_date_end" = EXCLUDED."observation_value_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "observation_value_string")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Observation-value-string'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "observation_value_string" = EXCLUDED."observation_value_string";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_code_system", "operationdefinition_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_code_system" = EXCLUDED."operationdefinition_code_system", 
        "operationdefinition_code_value" = EXCLUDED."operationdefinition_code_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_instance_system", "operationdefinition_instance_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-instance'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_instance_system" = EXCLUDED."operationdefinition_instance_system", 
        "operationdefinition_instance_value" = EXCLUDED."operationdefinition_instance_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_kind_system", "operationdefinition_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_kind_system" = EXCLUDED."operationdefinition_kind_system", 
        "operationdefinition_kind_value" = EXCLUDED."operationdefinition_kind_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_system_system", "operationdefinition_system_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-system'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_system_system" = EXCLUDED."operationdefinition_system_system", 
        "operationdefinition_system_value" = EXCLUDED."operationdefinition_system_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "operationdefinition_type_system", "operationdefinition_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OperationDefinition-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "operationdefinition_type_system" = EXCLUDED."operationdefinition_type_system", 
        "operationdefinition_type_value" = EXCLUDED."operationdefinition_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "organization_active_system", "organization_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Organization-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "organization_active_system" = EXCLUDED."organization_active_system", 
        "organization_active_value" = EXCLUDED."organization_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "organization_phonetic")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Organization-phonetic'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "organization_phonetic" = EXCLUDED."organization_phonetic";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "organizationaffiliation_active_system", "organizationaffiliation_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "organizationaffiliation_active_system" = EXCLUDED."organizationaffiliation_active_system", 
        "organizationaffiliation_active_value" = EXCLUDED."organizationaffiliation_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "organizationaffiliation_date_start", "organizationaffiliation_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/OrganizationAffiliation-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "organizationaffiliation_date_start" = EXCLUDED."organizationaffiliation_date_start", 
        "organizationaffiliation_date_end" = EXCLUDED."organizationaffiliation_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "packagedproductdefinition_name_system", "packagedproductdefinition_name_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PackagedProductDefinition-name'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "packagedproductdefinition_name_system" = EXCLUDED."packagedproductdefinition_name_system", 
        "packagedproductdefinition_name_value" = EXCLUDED."packagedproductdefinition_name_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "patient_active_system", "patient_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Patient-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "patient_active_system" = EXCLUDED."patient_active_system", 
        "patient_active_value" = EXCLUDED."patient_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "individual_birthdate_start", "individual_birthdate_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/individual-birthdate'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "individual_birthdate_start" = EXCLUDED."individual_birthdate_start", 
        "individual_birthdate_end" = EXCLUDED."individual_birthdate_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "patient_death_date_start", "patient_death_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Patient-death-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "patient_death_date_start" = EXCLUDED."patient_death_date_start", 
        "patient_death_date_end" = EXCLUDED."patient_death_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "individual_gender_system", "individual_gender_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/individual-gender'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "individual_gender_system" = EXCLUDED."individual_gender_system", 
        "individual_gender_value" = EXCLUDED."individual_gender_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentnotice_created_start", "paymentnotice_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentNotice-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "paymentnotice_created_start" = EXCLUDED."paymentnotice_created_start", 
        "paymentnotice_created_end" = EXCLUDED."paymentnotice_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentnotice_status_system", "paymentnotice_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentNotice-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentnotice_status_system" = EXCLUDED."paymentnotice_status_system", 
        "paymentnotice_status_value" = EXCLUDED."paymentnotice_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_created_start", "paymentreconciliation_created_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-created'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "paymentreconciliation_created_start" = EXCLUDED."paymentreconciliation_created_start", 
        "paymentreconciliation_created_end" = EXCLUDED."paymentreconciliation_created_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_disposition")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-disposition'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "paymentreconciliation_disposition" = EXCLUDED."paymentreconciliation_disposition";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_outcome_system", "paymentreconciliation_outcome_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-outcome'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentreconciliation_outcome_system" = EXCLUDED."paymentreconciliation_outcome_system", 
        "paymentreconciliation_outcome_value" = EXCLUDED."paymentreconciliation_outcome_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "paymentreconciliation_status_system", "paymentreconciliation_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PaymentReconciliation-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "paymentreconciliation_status_system" = EXCLUDED."paymentreconciliation_status_system", 
        "paymentreconciliation_status_value" = EXCLUDED."paymentreconciliation_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_date_start", "plandefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "plandefinition_date_start" = EXCLUDED."plandefinition_date_start", 
        "plandefinition_date_end" = EXCLUDED."plandefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_description" = EXCLUDED."plandefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_effective_start", "plandefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "plandefinition_effective_start" = EXCLUDED."plandefinition_effective_start", 
        "plandefinition_effective_end" = EXCLUDED."plandefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_name" = EXCLUDED."plandefinition_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_publisher" = EXCLUDED."plandefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_status_system", "plandefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "plandefinition_status_system" = EXCLUDED."plandefinition_status_system", 
        "plandefinition_status_value" = EXCLUDED."plandefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "plandefinition_title" = EXCLUDED."plandefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "plandefinition_url" = EXCLUDED."plandefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "plandefinition_version_system", "plandefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PlanDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "plandefinition_version_system" = EXCLUDED."plandefinition_version_system", 
        "plandefinition_version_value" = EXCLUDED."plandefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "practitioner_active_system", "practitioner_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Practitioner-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "practitioner_active_system" = EXCLUDED."practitioner_active_system", 
        "practitioner_active_value" = EXCLUDED."practitioner_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "practitionerrole_active_system", "practitionerrole_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PractitionerRole-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "practitionerrole_active_system" = EXCLUDED."practitionerrole_active_system", 
        "practitionerrole_active_value" = EXCLUDED."practitionerrole_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "practitionerrole_date_start", "practitionerrole_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/PractitionerRole-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "practitionerrole_date_start" = EXCLUDED."practitionerrole_date_start", 
        "practitionerrole_date_end" = EXCLUDED."practitionerrole_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "procedure_status_system", "procedure_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Procedure-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "procedure_status_system" = EXCLUDED."procedure_status_system", 
        "procedure_status_value" = EXCLUDED."procedure_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "provenance_recorded_start", "provenance_recorded_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Provenance-recorded'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "provenance_recorded_start" = EXCLUDED."provenance_recorded_start", 
        "provenance_recorded_end" = EXCLUDED."provenance_recorded_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "provenance_when_start", "provenance_when_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Provenance-when'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "provenance_when_start" = EXCLUDED."provenance_when_start", 
        "provenance_when_end" = EXCLUDED."provenance_when_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_date_start", "questionnaire_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaire_date_start" = EXCLUDED."questionnaire_date_start", 
        "questionnaire_date_end" = EXCLUDED."questionnaire_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_description" = EXCLUDED."questionnaire_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_effective_start", "questionnaire_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaire_effective_start" = EXCLUDED."questionnaire_effective_start", 
        "questionnaire_effective_end" = EXCLUDED."questionnaire_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_name" = EXCLUDED."questionnaire_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_publisher" = EXCLUDED."questionnaire_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_status_system", "questionnaire_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaire_status_system" = EXCLUDED."questionnaire_status_system", 
        "questionnaire_status_value" = EXCLUDED."questionnaire_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "questionnaire_title" = EXCLUDED."questionnaire_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "questionnaire_url" = EXCLUDED."questionnaire_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaire_version_system", "questionnaire_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Questionnaire-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaire_version_system" = EXCLUDED."questionnaire_version_system", 
        "questionnaire_version_value" = EXCLUDED."questionnaire_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_authored_start", "questionnaireresponse_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "questionnaireresponse_authored_start" = EXCLUDED."questionnaireresponse_authored_start", 
        "questionnaireresponse_authored_end" = EXCLUDED."questionnaireresponse_authored_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_identifier_system", "questionnaireresponse_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaireresponse_identifier_system" = EXCLUDED."questionnaireresponse_identifier_system", 
        "questionnaireresponse_identifier_value" = EXCLUDED."questionnaireresponse_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "questionnaireresponse_status_system", "questionnaireresponse_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/QuestionnaireResponse-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "questionnaireresponse_status_system" = EXCLUDED."questionnaireresponse_status_system", 
        "questionnaireresponse_status_value" = EXCLUDED."questionnaireresponse_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "regulatedauthorization_case_system", "regulatedauthorization_case_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RegulatedAuthorization-case'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "regulatedauthorization_case_system" = EXCLUDED."regulatedauthorization_case_system", 
        "regulatedauthorization_case_value" = EXCLUDED."regulatedauthorization_case_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "relatedperson_active_system", "relatedperson_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RelatedPerson-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "relatedperson_active_system" = EXCLUDED."relatedperson_active_system", 
        "relatedperson_active_value" = EXCLUDED."relatedperson_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_authored_start", "requestgroup_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "requestgroup_authored_start" = EXCLUDED."requestgroup_authored_start", 
        "requestgroup_authored_end" = EXCLUDED."requestgroup_authored_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_group_identifier_system", "requestgroup_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_group_identifier_system" = EXCLUDED."requestgroup_group_identifier_system", 
        "requestgroup_group_identifier_value" = EXCLUDED."requestgroup_group_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_intent_system", "requestgroup_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_intent_system" = EXCLUDED."requestgroup_intent_system", 
        "requestgroup_intent_value" = EXCLUDED."requestgroup_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_priority_system", "requestgroup_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_priority_system" = EXCLUDED."requestgroup_priority_system", 
        "requestgroup_priority_value" = EXCLUDED."requestgroup_priority_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "requestgroup_status_system", "requestgroup_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/RequestGroup-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "requestgroup_status_system" = EXCLUDED."requestgroup_status_system", 
        "requestgroup_status_value" = EXCLUDED."requestgroup_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_date_start", "researchdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchdefinition_date_start" = EXCLUDED."researchdefinition_date_start", 
        "researchdefinition_date_end" = EXCLUDED."researchdefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_description" = EXCLUDED."researchdefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_effective_start", "researchdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchdefinition_effective_start" = EXCLUDED."researchdefinition_effective_start", 
        "researchdefinition_effective_end" = EXCLUDED."researchdefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_name" = EXCLUDED."researchdefinition_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_publisher" = EXCLUDED."researchdefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_status_system", "researchdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchdefinition_status_system" = EXCLUDED."researchdefinition_status_system", 
        "researchdefinition_status_value" = EXCLUDED."researchdefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchdefinition_title" = EXCLUDED."researchdefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "researchdefinition_url" = EXCLUDED."researchdefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchdefinition_version_system", "researchdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchdefinition_version_system" = EXCLUDED."researchdefinition_version_system", 
        "researchdefinition_version_value" = EXCLUDED."researchdefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_date_start", "researchelementdefinition_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchelementdefinition_date_start" = EXCLUDED."researchelementdefinition_date_start", 
        "researchelementdefinition_date_end" = EXCLUDED."researchelementdefinition_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_description" = EXCLUDED."researchelementdefinition_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_effective_start", "researchelementdefinition_effective_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-effective'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchelementdefinition_effective_start" = EXCLUDED."researchelementdefinition_effective_start", 
        "researchelementdefinition_effective_end" = EXCLUDED."researchelementdefinition_effective_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_name" = EXCLUDED."researchelementdefinition_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_publisher" = EXCLUDED."researchelementdefinition_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_status_system", "researchelementdefinition_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchelementdefinition_status_system" = EXCLUDED."researchelementdefinition_status_system", 
        "researchelementdefinition_status_value" = EXCLUDED."researchelementdefinition_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchelementdefinition_title" = EXCLUDED."researchelementdefinition_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "researchelementdefinition_url" = EXCLUDED."researchelementdefinition_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchelementdefinition_version_system", "researchelementdefinition_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchElementDefinition-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchelementdefinition_version_system" = EXCLUDED."researchelementdefinition_version_system", 
        "researchelementdefinition_version_value" = EXCLUDED."researchelementdefinition_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_date_start", "researchstudy_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchstudy_date_start" = EXCLUDED."researchstudy_date_start", 
        "researchstudy_date_end" = EXCLUDED."researchstudy_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_status_system", "researchstudy_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchstudy_status_system" = EXCLUDED."researchstudy_status_system", 
        "researchstudy_status_value" = EXCLUDED."researchstudy_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchstudy_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchStudy-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "researchstudy_title" = EXCLUDED."researchstudy_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchsubject_date_start", "researchsubject_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchSubject-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "researchsubject_date_start" = EXCLUDED."researchsubject_date_start", 
        "researchsubject_date_end" = EXCLUDED."researchsubject_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "researchsubject_status_system", "researchsubject_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ResearchSubject-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "researchsubject_status_system" = EXCLUDED."researchsubject_status_system", 
        "researchsubject_status_value" = EXCLUDED."researchsubject_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "schedule_active_system", "schedule_active_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Schedule-active'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "schedule_active_system" = EXCLUDED."schedule_active_system", 
        "schedule_active_value" = EXCLUDED."schedule_active_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "schedule_date_start", "schedule_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Schedule-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "schedule_date_start" = EXCLUDED."schedule_date_start", 
        "schedule_date_end" = EXCLUDED."schedule_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "searchparameter_code_system", "searchparameter_code_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SearchParameter-code'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "searchparameter_code_system" = EXCLUDED."searchparameter_code_system", 
        "searchparameter_code_value" = EXCLUDED."searchparameter_code_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "searchparameter_type_system", "searchparameter_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SearchParameter-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "searchparameter_type_system" = EXCLUDED."searchparameter_type_system", 
        "searchparameter_type_value" = EXCLUDED."searchparameter_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_authored_start", "servicerequest_authored_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-authored'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "servicerequest_authored_start" = EXCLUDED."servicerequest_authored_start", 
        "servicerequest_authored_end" = EXCLUDED."servicerequest_authored_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_intent_system", "servicerequest_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_intent_system" = EXCLUDED."servicerequest_intent_system", 
        "servicerequest_intent_value" = EXCLUDED."servicerequest_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_priority_system", "servicerequest_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_priority_system" = EXCLUDED."servicerequest_priority_system", 
        "servicerequest_priority_value" = EXCLUDED."servicerequest_priority_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_requisition_system", "servicerequest_requisition_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-requisition'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_requisition_system" = EXCLUDED."servicerequest_requisition_system", 
        "servicerequest_requisition_value" = EXCLUDED."servicerequest_requisition_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "servicerequest_status_system", "servicerequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ServiceRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "servicerequest_status_system" = EXCLUDED."servicerequest_status_system", 
        "servicerequest_status_value" = EXCLUDED."servicerequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "slot_start_start", "slot_start_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Slot-start'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "slot_start_start" = EXCLUDED."slot_start_start", 
        "slot_start_end" = EXCLUDED."slot_start_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "slot_status_system", "slot_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Slot-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "slot_status_system" = EXCLUDED."slot_status_system", 
        "slot_status_value" = EXCLUDED."slot_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_accession_system", "specimen_accession_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-accession'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimen_accession_system" = EXCLUDED."specimen_accession_system", 
        "specimen_accession_value" = EXCLUDED."specimen_accession_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_collected_start", "specimen_collected_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-collected'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "specimen_collected_start" = EXCLUDED."specimen_collected_start", 
        "specimen_collected_end" = EXCLUDED."specimen_collected_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "specimen_status_system", "specimen_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Specimen-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimen_status_system" = EXCLUDED."specimen_status_system", 
        "specimen_status_value" = EXCLUDED."specimen_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "specimendefinition_identifier_system", "specimendefinition_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SpecimenDefinition-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "specimendefinition_identifier_system" = EXCLUDED."specimendefinition_identifier_system", 
        "specimendefinition_identifier_value" = EXCLUDED."specimendefinition_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_abstract_system", "structuredefinition_abstract_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-abstract'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_abstract_system" = EXCLUDED."structuredefinition_abstract_system", 
        "structuredefinition_abstract_value" = EXCLUDED."structuredefinition_abstract_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_derivation_system", "structuredefinition_derivation_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-derivation'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_derivation_system" = EXCLUDED."structuredefinition_derivation_system", 
        "structuredefinition_derivation_value" = EXCLUDED."structuredefinition_derivation_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_experimental_system", "structuredefinition_experimental_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-experimental'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_experimental_system" = EXCLUDED."structuredefinition_experimental_system", 
        "structuredefinition_experimental_value" = EXCLUDED."structuredefinition_experimental_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_kind_system", "structuredefinition_kind_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-kind'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "structuredefinition_kind_system" = EXCLUDED."structuredefinition_kind_system", 
        "structuredefinition_kind_value" = EXCLUDED."structuredefinition_kind_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "structuredefinition_type")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/StructureDefinition-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "structuredefinition_type" = EXCLUDED."structuredefinition_type";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_criteria")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-criteria'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "subscription_criteria" = EXCLUDED."subscription_criteria";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_payload_system", "subscription_payload_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-payload'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_payload_system" = EXCLUDED."subscription_payload_system", 
        "subscription_payload_value" = EXCLUDED."subscription_payload_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_status_system", "subscription_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_status_system" = EXCLUDED."subscription_status_system", 
        "subscription_status_value" = EXCLUDED."subscription_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_type_system", "subscription_type_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-type'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscription_type_system" = EXCLUDED."subscription_type_system", 
        "subscription_type_value" = EXCLUDED."subscription_type_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscription_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Subscription-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "subscription_url" = EXCLUDED."subscription_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscriptiontopic_date_start", "subscriptiontopic_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SubscriptionTopic-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "subscriptiontopic_date_start" = EXCLUDED."subscriptiontopic_date_start", 
        "subscriptiontopic_date_end" = EXCLUDED."subscriptiontopic_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscriptiontopic_status_system", "subscriptiontopic_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SubscriptionTopic-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscriptiontopic_status_system" = EXCLUDED."subscriptiontopic_status_system", 
        "subscriptiontopic_status_value" = EXCLUDED."subscriptiontopic_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscriptiontopic_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SubscriptionTopic-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "subscriptiontopic_title" = EXCLUDED."subscriptiontopic_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscriptiontopic_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SubscriptionTopic-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "subscriptiontopic_url" = EXCLUDED."subscriptiontopic_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "subscriptiontopic_version_system", "subscriptiontopic_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SubscriptionTopic-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "subscriptiontopic_version_system" = EXCLUDED."subscriptiontopic_version_system", 
        "subscriptiontopic_version_value" = EXCLUDED."subscriptiontopic_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "substance_status_system", "substance_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Substance-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "substance_status_system" = EXCLUDED."substance_status_system", 
        "substance_status_value" = EXCLUDED."substance_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "supplydelivery_status_system", "supplydelivery_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SupplyDelivery-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "supplydelivery_status_system" = EXCLUDED."supplydelivery_status_system", 
        "supplydelivery_status_value" = EXCLUDED."supplydelivery_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "supplyrequest_status_system", "supplyrequest_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/SupplyRequest-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "supplyrequest_status_system" = EXCLUDED."supplyrequest_status_system", 
        "supplyrequest_status_value" = EXCLUDED."supplyrequest_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_authored_on_start", "task_authored_on_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-authored-on'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_authored_on_start" = EXCLUDED."task_authored_on_start", 
        "task_authored_on_end" = EXCLUDED."task_authored_on_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_group_identifier_system", "task_group_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-group-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_group_identifier_system" = EXCLUDED."task_group_identifier_system", 
        "task_group_identifier_value" = EXCLUDED."task_group_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_intent_system", "task_intent_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-intent'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_intent_system" = EXCLUDED."task_intent_system", 
        "task_intent_value" = EXCLUDED."task_intent_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_modified_start", "task_modified_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-modified'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_modified_start" = EXCLUDED."task_modified_start", 
        "task_modified_end" = EXCLUDED."task_modified_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_period_start", "task_period_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-period'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "task_period_start" = EXCLUDED."task_period_start", 
        "task_period_end" = EXCLUDED."task_period_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_priority_system", "task_priority_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-priority'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_priority_system" = EXCLUDED."task_priority_system", 
        "task_priority_value" = EXCLUDED."task_priority_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "task_status_system", "task_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/Task-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "task_status_system" = EXCLUDED."task_status_system", 
        "task_status_value" = EXCLUDED."task_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_identifier_system", "testreport_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testreport_identifier_system" = EXCLUDED."testreport_identifier_system", 
        "testreport_identifier_value" = EXCLUDED."testreport_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_issued_start", "testreport_issued_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-issued'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "testreport_issued_start" = EXCLUDED."testreport_issued_start", 
        "testreport_issued_end" = EXCLUDED."testreport_issued_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_result_system", "testreport_result_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-result'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testreport_result_system" = EXCLUDED."testreport_result_system", 
        "testreport_result_value" = EXCLUDED."testreport_result_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testreport_tester")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestReport-tester'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testreport_tester" = EXCLUDED."testreport_tester";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_date_start", "testscript_date_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-date'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "testscript_date_start" = EXCLUDED."testscript_date_start", 
        "testscript_date_end" = EXCLUDED."testscript_date_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_description")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-description'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_description" = EXCLUDED."testscript_description";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_identifier_system", "testscript_identifier_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-identifier'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_identifier_system" = EXCLUDED."testscript_identifier_system", 
        "testscript_identifier_value" = EXCLUDED."testscript_identifier_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_name")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-name'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_name" = EXCLUDED."testscript_name";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_publisher")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-publisher'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_publisher" = EXCLUDED."testscript_publisher";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_status_system", "testscript_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_status_system" = EXCLUDED."testscript_status_system", 
        "testscript_status_value" = EXCLUDED."testscript_status_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_title")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_string_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-title'))
        ON CONFLICT("tenant", "r_id")
        DO UPDATE SET "testscript_title" = EXCLUDED."testscript_title";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_url")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-url'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "testscript_url" = EXCLUDED."testscript_url";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "testscript_version_system", "testscript_version_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/TestScript-version'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "testscript_version_system" = EXCLUDED."testscript_version_system", 
        "testscript_version_value" = EXCLUDED."testscript_version_value";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "valueset_expansion")
        ( SELECT "tenant", "r_id", "r_version_id", "value"
          FROM "r4b_uri_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/ValueSet-expansion'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET "valueset_expansion" = EXCLUDED."valueset_expansion";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "visionprescription_datewritten_start", "visionprescription_datewritten_end")
        ( SELECT "tenant", "r_id", "r_version_id", "start_date", "end_date"
          FROM "r4b_date_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/VisionPrescription-datewritten'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET
        "visionprescription_datewritten_start" = EXCLUDED."visionprescription_datewritten_start", 
        "visionprescription_datewritten_end" = EXCLUDED."visionprescription_datewritten_end";
 
        INSERT INTO "r4b_sp1_idx" ("tenant", "r_id", "r_version_id", "visionprescription_status_system", "visionprescription_status_value")
        ( SELECT "tenant", "r_id", "r_version_id", "system", "value"
          FROM "r4b_token_idx" 
          WHERE ("parameter_url" = 'http://hl7.org/fhir/SearchParameter/VisionPrescription-status'))
        ON CONFLICT("tenant", "r_id") DO UPDATE SET 
        "visionprescription_status_system" = EXCLUDED."visionprescription_status_system", 
        "visionprescription_status_value" = EXCLUDED."visionprescription_status_value";