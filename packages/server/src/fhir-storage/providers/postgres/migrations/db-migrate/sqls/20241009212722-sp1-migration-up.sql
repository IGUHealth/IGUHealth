-- R4 SP1 SQL 
 
CREATE TABLE IF NOT EXISTS r4_sp1_idx (
  r_id           TEXT         NOT NULL,
  r_version_id   INTEGER      NOT NULL PRIMARY KEY,
  tenant         TEXT         NOT NULL, 
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  UNIQUE (tenant, r_id),
  CONSTRAINT sp1_fk_resource
      FOREIGN KEY(r_version_id) 
	REFERENCES resources(version_id),
  CONSTRAINT sp1_fk_tenant
      FOREIGN KEY(tenant) 
	REFERENCES tenants(id)
);
 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS resource_id_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS resource_id_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_resource_id_system
        ON r4_sp1_idx 
        USING btree (tenant, resource_id_system);

        CREATE INDEX r4_sp1_idx_resource_id_value
        ON r4_sp1_idx 
        USING btree (tenant, resource_id_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS resource_lastupdated_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS resource_lastupdated_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_resource_lastupdated_start
        ON r4_sp1_idx 
        USING btree (tenant, resource_lastupdated_start);
        
        CREATE INDEX r4_sp1_idx_resource_lastupdated_end
        ON r4_sp1_idx 
        USING btree (tenant, resource_lastupdated_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS resource_source TEXT; 
 
        CREATE INDEX r4_sp1_idx_resource_source 
        ON r4_sp1_idx 
        USING btree (tenant, resource_source); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_account_name 
        ON r4_sp1_idx 
        USING btree (tenant, account_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_account_period_start
        ON r4_sp1_idx 
        USING btree (tenant, account_period_start);
        
        CREATE INDEX r4_sp1_idx_account_period_end
        ON r4_sp1_idx 
        USING btree (tenant, account_period_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_account_status_system
        ON r4_sp1_idx 
        USING btree (tenant, account_status_system);

        CREATE INDEX r4_sp1_idx_account_status_value
        ON r4_sp1_idx 
        USING btree (tenant, account_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS account_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_account_type_system
        ON r4_sp1_idx 
        USING btree (tenant, account_type_system);

        CREATE INDEX r4_sp1_idx_account_type_value
        ON r4_sp1_idx 
        USING btree (tenant, account_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_activitydefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_activitydefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_name 
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_status_system);

        CREATE INDEX r4_sp1_idx_activitydefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_activitydefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_version_system);

        CREATE INDEX r4_sp1_idx_activitydefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, activitydefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_actuality_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_actuality_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_adverseevent_actuality_system
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_actuality_system);

        CREATE INDEX r4_sp1_idx_adverseevent_actuality_value
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_actuality_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_adverseevent_date_start
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_date_start);
        
        CREATE INDEX r4_sp1_idx_adverseevent_date_end
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_event_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_event_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_adverseevent_event_system
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_event_system);

        CREATE INDEX r4_sp1_idx_adverseevent_event_value
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_event_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_seriousness_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_seriousness_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_adverseevent_seriousness_system
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_seriousness_system);

        CREATE INDEX r4_sp1_idx_adverseevent_seriousness_value
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_seriousness_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_severity_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_severity_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_adverseevent_severity_system
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_severity_system);

        CREATE INDEX r4_sp1_idx_adverseevent_severity_value
        ON r4_sp1_idx 
        USING btree (tenant, adverseevent_severity_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_clinical_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_clinical_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_allergyintolerance_clinical_status_system
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_clinical_status_system);

        CREATE INDEX r4_sp1_idx_allergyintolerance_clinical_status_value
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_clinical_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_criticality_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_criticality_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_allergyintolerance_criticality_system
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_criticality_system);

        CREATE INDEX r4_sp1_idx_allergyintolerance_criticality_value
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_criticality_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS clinical_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS clinical_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_clinical_date_start
        ON r4_sp1_idx 
        USING btree (tenant, clinical_date_start);
        
        CREATE INDEX r4_sp1_idx_clinical_date_end
        ON r4_sp1_idx 
        USING btree (tenant, clinical_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_last_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_last_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_allergyintolerance_last_date_start
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_last_date_start);
        
        CREATE INDEX r4_sp1_idx_allergyintolerance_last_date_end
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_last_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_verification_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_verification_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_allergyintolerance_verification_status_system
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_verification_status_system);

        CREATE INDEX r4_sp1_idx_allergyintolerance_verification_status_value
        ON r4_sp1_idx 
        USING btree (tenant, allergyintolerance_verification_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_appointment_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_appointment_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_appointment_appointment_type_system
        ON r4_sp1_idx 
        USING btree (tenant, appointment_appointment_type_system);

        CREATE INDEX r4_sp1_idx_appointment_appointment_type_value
        ON r4_sp1_idx 
        USING btree (tenant, appointment_appointment_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_appointment_date_start
        ON r4_sp1_idx 
        USING btree (tenant, appointment_date_start);
        
        CREATE INDEX r4_sp1_idx_appointment_date_end
        ON r4_sp1_idx 
        USING btree (tenant, appointment_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointment_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_appointment_status_system
        ON r4_sp1_idx 
        USING btree (tenant, appointment_status_system);

        CREATE INDEX r4_sp1_idx_appointment_status_value
        ON r4_sp1_idx 
        USING btree (tenant, appointment_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointmentresponse_part_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS appointmentresponse_part_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_appointmentresponse_part_status_system
        ON r4_sp1_idx 
        USING btree (tenant, appointmentresponse_part_status_system);

        CREATE INDEX r4_sp1_idx_appointmentresponse_part_status_value
        ON r4_sp1_idx 
        USING btree (tenant, appointmentresponse_part_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_action_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_action_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_auditevent_action_system
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_action_system);

        CREATE INDEX r4_sp1_idx_auditevent_action_value
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_action_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_auditevent_date_start
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_date_start);
        
        CREATE INDEX r4_sp1_idx_auditevent_date_end
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_outcome_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_outcome_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_auditevent_outcome_system
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_outcome_system);

        CREATE INDEX r4_sp1_idx_auditevent_outcome_value
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_outcome_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_site_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_site_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_auditevent_site_system
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_site_system);

        CREATE INDEX r4_sp1_idx_auditevent_site_value
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_site_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_auditevent_type_system
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_type_system);

        CREATE INDEX r4_sp1_idx_auditevent_type_value
        ON r4_sp1_idx 
        USING btree (tenant, auditevent_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS basic_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS basic_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_basic_code_system
        ON r4_sp1_idx 
        USING btree (tenant, basic_code_system);

        CREATE INDEX r4_sp1_idx_basic_code_value
        ON r4_sp1_idx 
        USING btree (tenant, basic_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS basic_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS basic_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_basic_created_start
        ON r4_sp1_idx 
        USING btree (tenant, basic_created_start);
        
        CREATE INDEX r4_sp1_idx_basic_created_end
        ON r4_sp1_idx 
        USING btree (tenant, basic_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_location_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_location_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_bodystructure_location_system
        ON r4_sp1_idx 
        USING btree (tenant, bodystructure_location_system);

        CREATE INDEX r4_sp1_idx_bodystructure_location_value
        ON r4_sp1_idx 
        USING btree (tenant, bodystructure_location_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_morphology_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_morphology_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_bodystructure_morphology_system
        ON r4_sp1_idx 
        USING btree (tenant, bodystructure_morphology_system);

        CREATE INDEX r4_sp1_idx_bodystructure_morphology_value
        ON r4_sp1_idx 
        USING btree (tenant, bodystructure_morphology_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_bundle_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, bundle_identifier_system);

        CREATE INDEX r4_sp1_idx_bundle_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, bundle_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_timestamp_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_timestamp_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_bundle_timestamp_start
        ON r4_sp1_idx 
        USING btree (tenant, bundle_timestamp_start);
        
        CREATE INDEX r4_sp1_idx_bundle_timestamp_end
        ON r4_sp1_idx 
        USING btree (tenant, bundle_timestamp_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS bundle_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_bundle_type_system
        ON r4_sp1_idx 
        USING btree (tenant, bundle_type_system);

        CREATE INDEX r4_sp1_idx_bundle_type_value
        ON r4_sp1_idx 
        USING btree (tenant, bundle_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_conformance_date_start
        ON r4_sp1_idx 
        USING btree (tenant, conformance_date_start);
        
        CREATE INDEX r4_sp1_idx_conformance_date_end
        ON r4_sp1_idx 
        USING btree (tenant, conformance_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_description 
        ON r4_sp1_idx 
        USING btree (tenant, conformance_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_fhirversion_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_fhirversion_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_capabilitystatement_fhirversion_system
        ON r4_sp1_idx 
        USING btree (tenant, capabilitystatement_fhirversion_system);

        CREATE INDEX r4_sp1_idx_capabilitystatement_fhirversion_value
        ON r4_sp1_idx 
        USING btree (tenant, capabilitystatement_fhirversion_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_name 
        ON r4_sp1_idx 
        USING btree (tenant, conformance_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, conformance_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_software TEXT; 
 
        CREATE INDEX r4_sp1_idx_capabilitystatement_software 
        ON r4_sp1_idx 
        USING btree (tenant, capabilitystatement_software); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_status_system
        ON r4_sp1_idx 
        USING btree (tenant, conformance_status_system);

        CREATE INDEX r4_sp1_idx_conformance_status_value
        ON r4_sp1_idx 
        USING btree (tenant, conformance_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_title 
        ON r4_sp1_idx 
        USING btree (tenant, conformance_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_url 
        ON r4_sp1_idx 
        USING btree (tenant, conformance_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS conformance_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_conformance_version_system
        ON r4_sp1_idx 
        USING btree (tenant, conformance_version_system);

        CREATE INDEX r4_sp1_idx_conformance_version_value
        ON r4_sp1_idx 
        USING btree (tenant, conformance_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careplan_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careplan_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_careplan_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, careplan_intent_system);

        CREATE INDEX r4_sp1_idx_careplan_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, careplan_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careplan_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careplan_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_careplan_status_system
        ON r4_sp1_idx 
        USING btree (tenant, careplan_status_system);

        CREATE INDEX r4_sp1_idx_careplan_status_value
        ON r4_sp1_idx 
        USING btree (tenant, careplan_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careteam_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS careteam_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_careteam_status_system
        ON r4_sp1_idx 
        USING btree (tenant, careteam_status_system);

        CREATE INDEX r4_sp1_idx_careteam_status_value
        ON r4_sp1_idx 
        USING btree (tenant, careteam_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_code_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_code_system);

        CREATE INDEX r4_sp1_idx_chargeitem_code_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_entered_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_entered_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_entered_date_start
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_entered_date_start);
        
        CREATE INDEX r4_sp1_idx_chargeitem_entered_date_end
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_entered_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_factor_override NUMERIC; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_factor_override 
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_factor_override); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_occurrence_start
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_occurrence_start);
        
        CREATE INDEX r4_sp1_idx_chargeitem_occurrence_end
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_occurrence_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_price_override_start_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_value);
        
        CREATE INDEX r4_sp1_idx_chargeitem_price_override_start_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_system);

        CREATE INDEX r4_sp1_idx_chargeitem_price_override_start_code
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_code);

        CREATE INDEX r4_sp1_idx_chargeitem_price_override_end_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_value);
        
        CREATE INDEX r4_sp1_idx_chargeitem_price_override_end_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_system);

        CREATE INDEX r4_sp1_idx_chargeitem_price_override_end_code
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitem_quantity_start_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_value);
        
        CREATE INDEX r4_sp1_idx_chargeitem_quantity_start_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_system);

        CREATE INDEX r4_sp1_idx_chargeitem_quantity_start_code
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_code);

        CREATE INDEX r4_sp1_idx_chargeitem_quantity_end_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_value);
        
        CREATE INDEX r4_sp1_idx_chargeitem_quantity_end_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_system);

        CREATE INDEX r4_sp1_idx_chargeitem_quantity_end_code
        ON r4_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_status_system);

        CREATE INDEX r4_sp1_idx_chargeitemdefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_chargeitemdefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_version_system);

        CREATE INDEX r4_sp1_idx_chargeitemdefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, chargeitemdefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_claim_created_start
        ON r4_sp1_idx 
        USING btree (tenant, claim_created_start);
        
        CREATE INDEX r4_sp1_idx_claim_created_end
        ON r4_sp1_idx 
        USING btree (tenant, claim_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claim_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, claim_priority_system);

        CREATE INDEX r4_sp1_idx_claim_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, claim_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claim_status_system
        ON r4_sp1_idx 
        USING btree (tenant, claim_status_system);

        CREATE INDEX r4_sp1_idx_claim_status_value
        ON r4_sp1_idx 
        USING btree (tenant, claim_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_use_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claim_use_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claim_use_system
        ON r4_sp1_idx 
        USING btree (tenant, claim_use_system);

        CREATE INDEX r4_sp1_idx_claim_use_value
        ON r4_sp1_idx 
        USING btree (tenant, claim_use_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_created_start
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_created_start);
        
        CREATE INDEX r4_sp1_idx_claimresponse_created_end
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_disposition TEXT; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_disposition 
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_disposition); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_outcome_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_outcome_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_outcome_system
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_outcome_system);

        CREATE INDEX r4_sp1_idx_claimresponse_outcome_value
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_outcome_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_payment_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_payment_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_payment_date_start
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_payment_date_start);
        
        CREATE INDEX r4_sp1_idx_claimresponse_payment_date_end
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_payment_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_status_system
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_status_system);

        CREATE INDEX r4_sp1_idx_claimresponse_status_value
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_use_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_use_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_claimresponse_use_system
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_use_system);

        CREATE INDEX r4_sp1_idx_claimresponse_use_value
        ON r4_sp1_idx 
        USING btree (tenant, claimresponse_use_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS clinicalimpression_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS clinicalimpression_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_clinicalimpression_status_system
        ON r4_sp1_idx 
        USING btree (tenant, clinicalimpression_status_system);

        CREATE INDEX r4_sp1_idx_clinicalimpression_status_value
        ON r4_sp1_idx 
        USING btree (tenant, clinicalimpression_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_content_mode_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_content_mode_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_codesystem_content_mode_system
        ON r4_sp1_idx 
        USING btree (tenant, codesystem_content_mode_system);

        CREATE INDEX r4_sp1_idx_codesystem_content_mode_value
        ON r4_sp1_idx 
        USING btree (tenant, codesystem_content_mode_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_system TEXT; 
 
        CREATE INDEX r4_sp1_idx_codesystem_system 
        ON r4_sp1_idx 
        USING btree (tenant, codesystem_system); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_received_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_received_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_communication_received_start
        ON r4_sp1_idx 
        USING btree (tenant, communication_received_start);
        
        CREATE INDEX r4_sp1_idx_communication_received_end
        ON r4_sp1_idx 
        USING btree (tenant, communication_received_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_sent_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_sent_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_communication_sent_start
        ON r4_sp1_idx 
        USING btree (tenant, communication_sent_start);
        
        CREATE INDEX r4_sp1_idx_communication_sent_end
        ON r4_sp1_idx 
        USING btree (tenant, communication_sent_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communication_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_communication_status_system
        ON r4_sp1_idx 
        USING btree (tenant, communication_status_system);

        CREATE INDEX r4_sp1_idx_communication_status_value
        ON r4_sp1_idx 
        USING btree (tenant, communication_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_communicationrequest_authored_start
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_authored_start);
        
        CREATE INDEX r4_sp1_idx_communicationrequest_authored_end
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_authored_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_group_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_group_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_communicationrequest_group_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_group_identifier_system);

        CREATE INDEX r4_sp1_idx_communicationrequest_group_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_group_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_communicationrequest_occurrence_start
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_occurrence_start);
        
        CREATE INDEX r4_sp1_idx_communicationrequest_occurrence_end
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_occurrence_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_communicationrequest_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_priority_system);

        CREATE INDEX r4_sp1_idx_communicationrequest_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_communicationrequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_status_system);

        CREATE INDEX r4_sp1_idx_communicationrequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, communicationrequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS compartmentdefinition_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS compartmentdefinition_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_compartmentdefinition_code_system
        ON r4_sp1_idx 
        USING btree (tenant, compartmentdefinition_code_system);

        CREATE INDEX r4_sp1_idx_compartmentdefinition_code_value
        ON r4_sp1_idx 
        USING btree (tenant, compartmentdefinition_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS composition_confidentiality_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS composition_confidentiality_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_composition_confidentiality_system
        ON r4_sp1_idx 
        USING btree (tenant, composition_confidentiality_system);

        CREATE INDEX r4_sp1_idx_composition_confidentiality_value
        ON r4_sp1_idx 
        USING btree (tenant, composition_confidentiality_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS composition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS composition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_composition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, composition_status_system);

        CREATE INDEX r4_sp1_idx_composition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, composition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS composition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_composition_title 
        ON r4_sp1_idx 
        USING btree (tenant, composition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_abatement_age_start_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_value);
        
        CREATE INDEX r4_sp1_idx_condition_abatement_age_start_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_system);

        CREATE INDEX r4_sp1_idx_condition_abatement_age_start_code
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_code);

        CREATE INDEX r4_sp1_idx_condition_abatement_age_end_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_value);
        
        CREATE INDEX r4_sp1_idx_condition_abatement_age_end_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_system);

        CREATE INDEX r4_sp1_idx_condition_abatement_age_end_code
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_condition_abatement_date_start
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_date_start);
        
        CREATE INDEX r4_sp1_idx_condition_abatement_date_end
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_string TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_abatement_string 
        ON r4_sp1_idx 
        USING btree (tenant, condition_abatement_string); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_clinical_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_clinical_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_clinical_status_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_clinical_status_system);

        CREATE INDEX r4_sp1_idx_condition_clinical_status_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_clinical_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_onset_age_start_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_start_value);
        
        CREATE INDEX r4_sp1_idx_condition_onset_age_start_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_start_system);

        CREATE INDEX r4_sp1_idx_condition_onset_age_start_code
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_start_code);

        CREATE INDEX r4_sp1_idx_condition_onset_age_end_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_end_value);
        
        CREATE INDEX r4_sp1_idx_condition_onset_age_end_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_end_system);

        CREATE INDEX r4_sp1_idx_condition_onset_age_end_code
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_age_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_condition_onset_date_start
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_date_start);
        
        CREATE INDEX r4_sp1_idx_condition_onset_date_end
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_info TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_onset_info 
        ON r4_sp1_idx 
        USING btree (tenant, condition_onset_info); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_recorded_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_recorded_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_condition_recorded_date_start
        ON r4_sp1_idx 
        USING btree (tenant, condition_recorded_date_start);
        
        CREATE INDEX r4_sp1_idx_condition_recorded_date_end
        ON r4_sp1_idx 
        USING btree (tenant, condition_recorded_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_severity_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_severity_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_severity_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_severity_system);

        CREATE INDEX r4_sp1_idx_condition_severity_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_severity_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_verification_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS condition_verification_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_condition_verification_status_system
        ON r4_sp1_idx 
        USING btree (tenant, condition_verification_status_system);

        CREATE INDEX r4_sp1_idx_condition_verification_status_value
        ON r4_sp1_idx 
        USING btree (tenant, condition_verification_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_consent_period_start
        ON r4_sp1_idx 
        USING btree (tenant, consent_period_start);
        
        CREATE INDEX r4_sp1_idx_consent_period_end
        ON r4_sp1_idx 
        USING btree (tenant, consent_period_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_scope_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_scope_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_consent_scope_system
        ON r4_sp1_idx 
        USING btree (tenant, consent_scope_system);

        CREATE INDEX r4_sp1_idx_consent_scope_value
        ON r4_sp1_idx 
        USING btree (tenant, consent_scope_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS consent_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_consent_status_system
        ON r4_sp1_idx 
        USING btree (tenant, consent_status_system);

        CREATE INDEX r4_sp1_idx_consent_status_value
        ON r4_sp1_idx 
        USING btree (tenant, consent_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_instantiates TEXT; 
 
        CREATE INDEX r4_sp1_idx_contract_instantiates 
        ON r4_sp1_idx 
        USING btree (tenant, contract_instantiates); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_contract_issued_start
        ON r4_sp1_idx 
        USING btree (tenant, contract_issued_start);
        
        CREATE INDEX r4_sp1_idx_contract_issued_end
        ON r4_sp1_idx 
        USING btree (tenant, contract_issued_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_contract_status_system
        ON r4_sp1_idx 
        USING btree (tenant, contract_status_system);

        CREATE INDEX r4_sp1_idx_contract_status_value
        ON r4_sp1_idx 
        USING btree (tenant, contract_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS contract_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_contract_url 
        ON r4_sp1_idx 
        USING btree (tenant, contract_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverage_dependent TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverage_dependent 
        ON r4_sp1_idx 
        USING btree (tenant, coverage_dependent); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverage_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverage_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverage_status_system
        ON r4_sp1_idx 
        USING btree (tenant, coverage_status_system);

        CREATE INDEX r4_sp1_idx_coverage_status_value
        ON r4_sp1_idx 
        USING btree (tenant, coverage_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverage_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverage_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverage_type_system
        ON r4_sp1_idx 
        USING btree (tenant, coverage_type_system);

        CREATE INDEX r4_sp1_idx_coverage_type_value
        ON r4_sp1_idx 
        USING btree (tenant, coverage_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityrequest_created_start
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_created_start);
        
        CREATE INDEX r4_sp1_idx_coverageeligibilityrequest_created_end
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityrequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_status_system);

        CREATE INDEX r4_sp1_idx_coverageeligibilityrequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_created_start
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_created_start);
        
        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_created_end
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_disposition TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_disposition 
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_disposition); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_outcome_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_outcome_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_outcome_system
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_outcome_system);

        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_outcome_value
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_outcome_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_status_system
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_status_system);

        CREATE INDEX r4_sp1_idx_coverageeligibilityresponse_status_value
        ON r4_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_detectedissue_code_system
        ON r4_sp1_idx 
        USING btree (tenant, detectedissue_code_system);

        CREATE INDEX r4_sp1_idx_detectedissue_code_value
        ON r4_sp1_idx 
        USING btree (tenant, detectedissue_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_identified_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_identified_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_detectedissue_identified_start
        ON r4_sp1_idx 
        USING btree (tenant, detectedissue_identified_start);
        
        CREATE INDEX r4_sp1_idx_detectedissue_identified_end
        ON r4_sp1_idx 
        USING btree (tenant, detectedissue_identified_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_manufacturer TEXT; 
 
        CREATE INDEX r4_sp1_idx_device_manufacturer 
        ON r4_sp1_idx 
        USING btree (tenant, device_manufacturer); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_model TEXT; 
 
        CREATE INDEX r4_sp1_idx_device_model 
        ON r4_sp1_idx 
        USING btree (tenant, device_model); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_device_status_system
        ON r4_sp1_idx 
        USING btree (tenant, device_status_system);

        CREATE INDEX r4_sp1_idx_device_status_value
        ON r4_sp1_idx 
        USING btree (tenant, device_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_device_type_system
        ON r4_sp1_idx 
        USING btree (tenant, device_type_system);

        CREATE INDEX r4_sp1_idx_device_type_value
        ON r4_sp1_idx 
        USING btree (tenant, device_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS device_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_device_url 
        ON r4_sp1_idx 
        USING btree (tenant, device_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicedefinition_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicedefinition_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicedefinition_type_system
        ON r4_sp1_idx 
        USING btree (tenant, devicedefinition_type_system);

        CREATE INDEX r4_sp1_idx_devicedefinition_type_value
        ON r4_sp1_idx 
        USING btree (tenant, devicedefinition_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_category_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_category_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicemetric_category_system
        ON r4_sp1_idx 
        USING btree (tenant, devicemetric_category_system);

        CREATE INDEX r4_sp1_idx_devicemetric_category_value
        ON r4_sp1_idx 
        USING btree (tenant, devicemetric_category_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicemetric_type_system
        ON r4_sp1_idx 
        USING btree (tenant, devicemetric_type_system);

        CREATE INDEX r4_sp1_idx_devicemetric_type_value
        ON r4_sp1_idx 
        USING btree (tenant, devicemetric_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_authored_on_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_authored_on_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_devicerequest_authored_on_start
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_authored_on_start);
        
        CREATE INDEX r4_sp1_idx_devicerequest_authored_on_end
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_authored_on_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_event_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_event_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_devicerequest_event_date_start
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_event_date_start);
        
        CREATE INDEX r4_sp1_idx_devicerequest_event_date_end
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_event_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_group_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_group_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicerequest_group_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_group_identifier_system);

        CREATE INDEX r4_sp1_idx_devicerequest_group_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_group_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicerequest_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_intent_system);

        CREATE INDEX r4_sp1_idx_devicerequest_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_devicerequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_status_system);

        CREATE INDEX r4_sp1_idx_devicerequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, devicerequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_diagnosticreport_issued_start
        ON r4_sp1_idx 
        USING btree (tenant, diagnosticreport_issued_start);
        
        CREATE INDEX r4_sp1_idx_diagnosticreport_issued_end
        ON r4_sp1_idx 
        USING btree (tenant, diagnosticreport_issued_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_diagnosticreport_status_system
        ON r4_sp1_idx 
        USING btree (tenant, diagnosticreport_status_system);

        CREATE INDEX r4_sp1_idx_diagnosticreport_status_value
        ON r4_sp1_idx 
        USING btree (tenant, diagnosticreport_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_documentmanifest_created_start
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_created_start);
        
        CREATE INDEX r4_sp1_idx_documentmanifest_created_end
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentmanifest_description 
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_source TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentmanifest_source 
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_source); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentmanifest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_status_system);

        CREATE INDEX r4_sp1_idx_documentmanifest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, documentmanifest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_documentreference_date_start
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_date_start);
        
        CREATE INDEX r4_sp1_idx_documentreference_date_end
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentreference_description 
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_facility_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_facility_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentreference_facility_system
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_facility_system);

        CREATE INDEX r4_sp1_idx_documentreference_facility_value
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_facility_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_documentreference_period_start
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_period_start);
        
        CREATE INDEX r4_sp1_idx_documentreference_period_end
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_period_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_setting_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_setting_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentreference_setting_system
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_setting_system);

        CREATE INDEX r4_sp1_idx_documentreference_setting_value
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_setting_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_documentreference_status_system
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_status_system);

        CREATE INDEX r4_sp1_idx_documentreference_status_value
        ON r4_sp1_idx 
        USING btree (tenant, documentreference_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_date_start
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_date_start);
        
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_date_end
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_description 
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_effective_start);
        
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_name 
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_status_system
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_status_system);

        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_status_value
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_title 
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_url 
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS effectevidencesynthesis_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_version_system
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_version_system);

        CREATE INDEX r4_sp1_idx_effectevidencesynthesis_version_value
        ON r4_sp1_idx 
        USING btree (tenant, effectevidencesynthesis_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_class_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_class_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_encounter_class_system
        ON r4_sp1_idx 
        USING btree (tenant, encounter_class_system);

        CREATE INDEX r4_sp1_idx_encounter_class_value
        ON r4_sp1_idx 
        USING btree (tenant, encounter_class_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_encounter_length_start_value
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_start_value);
        
        CREATE INDEX r4_sp1_idx_encounter_length_start_system
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_start_system);

        CREATE INDEX r4_sp1_idx_encounter_length_start_code
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_start_code);

        CREATE INDEX r4_sp1_idx_encounter_length_end_value
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_end_value);
        
        CREATE INDEX r4_sp1_idx_encounter_length_end_system
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_end_system);

        CREATE INDEX r4_sp1_idx_encounter_length_end_code
        ON r4_sp1_idx 
        USING btree (tenant, encounter_length_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS encounter_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_encounter_status_system
        ON r4_sp1_idx 
        USING btree (tenant, encounter_status_system);

        CREATE INDEX r4_sp1_idx_encounter_status_value
        ON r4_sp1_idx 
        USING btree (tenant, encounter_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_connection_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_connection_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_endpoint_connection_type_system
        ON r4_sp1_idx 
        USING btree (tenant, endpoint_connection_type_system);

        CREATE INDEX r4_sp1_idx_endpoint_connection_type_value
        ON r4_sp1_idx 
        USING btree (tenant, endpoint_connection_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_endpoint_name 
        ON r4_sp1_idx 
        USING btree (tenant, endpoint_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_endpoint_status_system
        ON r4_sp1_idx 
        USING btree (tenant, endpoint_status_system);

        CREATE INDEX r4_sp1_idx_endpoint_status_value
        ON r4_sp1_idx 
        USING btree (tenant, endpoint_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentrequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentrequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_enrollmentrequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, enrollmentrequest_status_system);

        CREATE INDEX r4_sp1_idx_enrollmentrequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, enrollmentrequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentresponse_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentresponse_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_enrollmentresponse_status_system
        ON r4_sp1_idx 
        USING btree (tenant, enrollmentresponse_status_system);

        CREATE INDEX r4_sp1_idx_enrollmentresponse_status_value
        ON r4_sp1_idx 
        USING btree (tenant, enrollmentresponse_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS episodeofcare_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS episodeofcare_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_episodeofcare_status_system
        ON r4_sp1_idx 
        USING btree (tenant, episodeofcare_status_system);

        CREATE INDEX r4_sp1_idx_episodeofcare_status_value
        ON r4_sp1_idx 
        USING btree (tenant, episodeofcare_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_eventdefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_eventdefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_name 
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_status_system);

        CREATE INDEX r4_sp1_idx_eventdefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_eventdefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_version_system);

        CREATE INDEX r4_sp1_idx_eventdefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, eventdefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_evidence_date_start
        ON r4_sp1_idx 
        USING btree (tenant, evidence_date_start);
        
        CREATE INDEX r4_sp1_idx_evidence_date_end
        ON r4_sp1_idx 
        USING btree (tenant, evidence_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_description 
        ON r4_sp1_idx 
        USING btree (tenant, evidence_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_evidence_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, evidence_effective_start);
        
        CREATE INDEX r4_sp1_idx_evidence_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, evidence_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_name 
        ON r4_sp1_idx 
        USING btree (tenant, evidence_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, evidence_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_status_system
        ON r4_sp1_idx 
        USING btree (tenant, evidence_status_system);

        CREATE INDEX r4_sp1_idx_evidence_status_value
        ON r4_sp1_idx 
        USING btree (tenant, evidence_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_title 
        ON r4_sp1_idx 
        USING btree (tenant, evidence_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_url 
        ON r4_sp1_idx 
        USING btree (tenant, evidence_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidence_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidence_version_system
        ON r4_sp1_idx 
        USING btree (tenant, evidence_version_system);

        CREATE INDEX r4_sp1_idx_evidence_version_value
        ON r4_sp1_idx 
        USING btree (tenant, evidence_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_date_start
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_date_start);
        
        CREATE INDEX r4_sp1_idx_evidencevariable_date_end
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_description 
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_effective_start);
        
        CREATE INDEX r4_sp1_idx_evidencevariable_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_name 
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_status_system
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_status_system);

        CREATE INDEX r4_sp1_idx_evidencevariable_status_value
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_title 
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_url 
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_evidencevariable_version_system
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_version_system);

        CREATE INDEX r4_sp1_idx_evidencevariable_version_value
        ON r4_sp1_idx 
        USING btree (tenant, evidencevariable_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_date_start
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_date_start);
        
        CREATE INDEX r4_sp1_idx_examplescenario_date_end
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_name 
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_status_system
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_status_system);

        CREATE INDEX r4_sp1_idx_examplescenario_status_value
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_url 
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_examplescenario_version_system
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_version_system);

        CREATE INDEX r4_sp1_idx_examplescenario_version_value
        ON r4_sp1_idx 
        USING btree (tenant, examplescenario_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_explanationofbenefit_created_start
        ON r4_sp1_idx 
        USING btree (tenant, explanationofbenefit_created_start);
        
        CREATE INDEX r4_sp1_idx_explanationofbenefit_created_end
        ON r4_sp1_idx 
        USING btree (tenant, explanationofbenefit_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_disposition TEXT; 
 
        CREATE INDEX r4_sp1_idx_explanationofbenefit_disposition 
        ON r4_sp1_idx 
        USING btree (tenant, explanationofbenefit_disposition); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_explanationofbenefit_status_system
        ON r4_sp1_idx 
        USING btree (tenant, explanationofbenefit_status_system);

        CREATE INDEX r4_sp1_idx_explanationofbenefit_status_value
        ON r4_sp1_idx 
        USING btree (tenant, explanationofbenefit_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_relationship_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_relationship_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_familymemberhistory_relationship_system
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_relationship_system);

        CREATE INDEX r4_sp1_idx_familymemberhistory_relationship_value
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_relationship_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_sex_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_sex_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_familymemberhistory_sex_system
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_sex_system);

        CREATE INDEX r4_sp1_idx_familymemberhistory_sex_value
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_sex_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_familymemberhistory_status_system
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_status_system);

        CREATE INDEX r4_sp1_idx_familymemberhistory_status_value
        ON r4_sp1_idx 
        USING btree (tenant, familymemberhistory_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_achievement_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_achievement_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_goal_achievement_status_system
        ON r4_sp1_idx 
        USING btree (tenant, goal_achievement_status_system);

        CREATE INDEX r4_sp1_idx_goal_achievement_status_value
        ON r4_sp1_idx 
        USING btree (tenant, goal_achievement_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_lifecycle_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_lifecycle_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_goal_lifecycle_status_system
        ON r4_sp1_idx 
        USING btree (tenant, goal_lifecycle_status_system);

        CREATE INDEX r4_sp1_idx_goal_lifecycle_status_value
        ON r4_sp1_idx 
        USING btree (tenant, goal_lifecycle_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_start_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS goal_start_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_goal_start_date_start
        ON r4_sp1_idx 
        USING btree (tenant, goal_start_date_start);
        
        CREATE INDEX r4_sp1_idx_goal_start_date_end
        ON r4_sp1_idx 
        USING btree (tenant, goal_start_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS graphdefinition_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS graphdefinition_start_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_graphdefinition_start_system
        ON r4_sp1_idx 
        USING btree (tenant, graphdefinition_start_system);

        CREATE INDEX r4_sp1_idx_graphdefinition_start_value
        ON r4_sp1_idx 
        USING btree (tenant, graphdefinition_start_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_actual_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_actual_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_group_actual_system
        ON r4_sp1_idx 
        USING btree (tenant, group_actual_system);

        CREATE INDEX r4_sp1_idx_group_actual_value
        ON r4_sp1_idx 
        USING btree (tenant, group_actual_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_group_code_system
        ON r4_sp1_idx 
        USING btree (tenant, group_code_system);

        CREATE INDEX r4_sp1_idx_group_code_value
        ON r4_sp1_idx 
        USING btree (tenant, group_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS group_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_group_type_system
        ON r4_sp1_idx 
        USING btree (tenant, group_type_system);

        CREATE INDEX r4_sp1_idx_group_type_value
        ON r4_sp1_idx 
        USING btree (tenant, group_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS guidanceresponse_request_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS guidanceresponse_request_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_guidanceresponse_request_system
        ON r4_sp1_idx 
        USING btree (tenant, guidanceresponse_request_system);

        CREATE INDEX r4_sp1_idx_guidanceresponse_request_value
        ON r4_sp1_idx 
        USING btree (tenant, guidanceresponse_request_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_healthcareservice_active_system
        ON r4_sp1_idx 
        USING btree (tenant, healthcareservice_active_system);

        CREATE INDEX r4_sp1_idx_healthcareservice_active_value
        ON r4_sp1_idx 
        USING btree (tenant, healthcareservice_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_healthcareservice_name 
        ON r4_sp1_idx 
        USING btree (tenant, healthcareservice_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_started_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_started_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_imagingstudy_started_start
        ON r4_sp1_idx 
        USING btree (tenant, imagingstudy_started_start);
        
        CREATE INDEX r4_sp1_idx_imagingstudy_started_end
        ON r4_sp1_idx 
        USING btree (tenant, imagingstudy_started_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_imagingstudy_status_system
        ON r4_sp1_idx 
        USING btree (tenant, imagingstudy_status_system);

        CREATE INDEX r4_sp1_idx_imagingstudy_status_value
        ON r4_sp1_idx 
        USING btree (tenant, imagingstudy_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_lot_number TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunization_lot_number 
        ON r4_sp1_idx 
        USING btree (tenant, immunization_lot_number); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunization_status_system
        ON r4_sp1_idx 
        USING btree (tenant, immunization_status_system);

        CREATE INDEX r4_sp1_idx_immunization_status_value
        ON r4_sp1_idx 
        USING btree (tenant, immunization_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_reason_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_reason_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunization_status_reason_system
        ON r4_sp1_idx 
        USING btree (tenant, immunization_status_reason_system);

        CREATE INDEX r4_sp1_idx_immunization_status_reason_value
        ON r4_sp1_idx 
        USING btree (tenant, immunization_status_reason_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_vaccine_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunization_vaccine_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunization_vaccine_code_system
        ON r4_sp1_idx 
        USING btree (tenant, immunization_vaccine_code_system);

        CREATE INDEX r4_sp1_idx_immunization_vaccine_code_value
        ON r4_sp1_idx 
        USING btree (tenant, immunization_vaccine_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_immunizationevaluation_date_start
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_date_start);
        
        CREATE INDEX r4_sp1_idx_immunizationevaluation_date_end
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_dose_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_dose_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunizationevaluation_dose_status_system
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_dose_status_system);

        CREATE INDEX r4_sp1_idx_immunizationevaluation_dose_status_value
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_dose_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunizationevaluation_status_system
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_status_system);

        CREATE INDEX r4_sp1_idx_immunizationevaluation_status_value
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_target_disease_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_target_disease_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_immunizationevaluation_target_disease_system
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_target_disease_system);

        CREATE INDEX r4_sp1_idx_immunizationevaluation_target_disease_value
        ON r4_sp1_idx 
        USING btree (tenant, immunizationevaluation_target_disease_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationrecommendation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS immunizationrecommendation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_immunizationrecommendation_date_start
        ON r4_sp1_idx 
        USING btree (tenant, immunizationrecommendation_date_start);
        
        CREATE INDEX r4_sp1_idx_immunizationrecommendation_date_end
        ON r4_sp1_idx 
        USING btree (tenant, immunizationrecommendation_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS implementationguide_experimental_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS implementationguide_experimental_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_implementationguide_experimental_system
        ON r4_sp1_idx 
        USING btree (tenant, implementationguide_experimental_system);

        CREATE INDEX r4_sp1_idx_implementationguide_experimental_value
        ON r4_sp1_idx 
        USING btree (tenant, implementationguide_experimental_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_phonetic TEXT; 
 
        CREATE INDEX r4_sp1_idx_insuranceplan_phonetic 
        ON r4_sp1_idx 
        USING btree (tenant, insuranceplan_phonetic); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_insuranceplan_status_system
        ON r4_sp1_idx 
        USING btree (tenant, insuranceplan_status_system);

        CREATE INDEX r4_sp1_idx_insuranceplan_status_value
        ON r4_sp1_idx 
        USING btree (tenant, insuranceplan_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_invoice_date_start
        ON r4_sp1_idx 
        USING btree (tenant, invoice_date_start);
        
        CREATE INDEX r4_sp1_idx_invoice_date_end
        ON r4_sp1_idx 
        USING btree (tenant, invoice_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_invoice_status_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_status_system);

        CREATE INDEX r4_sp1_idx_invoice_status_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_invoice_totalgross_start_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_value);
        
        CREATE INDEX r4_sp1_idx_invoice_totalgross_start_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_system);

        CREATE INDEX r4_sp1_idx_invoice_totalgross_start_code
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_code);

        CREATE INDEX r4_sp1_idx_invoice_totalgross_end_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_value);
        
        CREATE INDEX r4_sp1_idx_invoice_totalgross_end_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_system);

        CREATE INDEX r4_sp1_idx_invoice_totalgross_end_code
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_invoice_totalnet_start_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_value);
        
        CREATE INDEX r4_sp1_idx_invoice_totalnet_start_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_system);

        CREATE INDEX r4_sp1_idx_invoice_totalnet_start_code
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_code);

        CREATE INDEX r4_sp1_idx_invoice_totalnet_end_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_value);
        
        CREATE INDEX r4_sp1_idx_invoice_totalnet_end_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_system);

        CREATE INDEX r4_sp1_idx_invoice_totalnet_end_code
        ON r4_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS invoice_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_invoice_type_system
        ON r4_sp1_idx 
        USING btree (tenant, invoice_type_system);

        CREATE INDEX r4_sp1_idx_invoice_type_value
        ON r4_sp1_idx 
        USING btree (tenant, invoice_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_library_date_start
        ON r4_sp1_idx 
        USING btree (tenant, library_date_start);
        
        CREATE INDEX r4_sp1_idx_library_date_end
        ON r4_sp1_idx 
        USING btree (tenant, library_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_description 
        ON r4_sp1_idx 
        USING btree (tenant, library_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_library_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, library_effective_start);
        
        CREATE INDEX r4_sp1_idx_library_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, library_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_name 
        ON r4_sp1_idx 
        USING btree (tenant, library_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, library_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_status_system
        ON r4_sp1_idx 
        USING btree (tenant, library_status_system);

        CREATE INDEX r4_sp1_idx_library_status_value
        ON r4_sp1_idx 
        USING btree (tenant, library_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_title 
        ON r4_sp1_idx 
        USING btree (tenant, library_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_type_system
        ON r4_sp1_idx 
        USING btree (tenant, library_type_system);

        CREATE INDEX r4_sp1_idx_library_type_value
        ON r4_sp1_idx 
        USING btree (tenant, library_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_url 
        ON r4_sp1_idx 
        USING btree (tenant, library_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS library_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_library_version_system
        ON r4_sp1_idx 
        USING btree (tenant, library_version_system);

        CREATE INDEX r4_sp1_idx_library_version_value
        ON r4_sp1_idx 
        USING btree (tenant, library_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS list_empty_reason_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS list_empty_reason_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_list_empty_reason_system
        ON r4_sp1_idx 
        USING btree (tenant, list_empty_reason_system);

        CREATE INDEX r4_sp1_idx_list_empty_reason_value
        ON r4_sp1_idx 
        USING btree (tenant, list_empty_reason_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS list_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS list_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_list_status_system
        ON r4_sp1_idx 
        USING btree (tenant, list_status_system);

        CREATE INDEX r4_sp1_idx_list_status_value
        ON r4_sp1_idx 
        USING btree (tenant, list_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS list_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_list_title 
        ON r4_sp1_idx 
        USING btree (tenant, list_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address 
        ON r4_sp1_idx 
        USING btree (tenant, location_address); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_city TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address_city 
        ON r4_sp1_idx 
        USING btree (tenant, location_address_city); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_country TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address_country 
        ON r4_sp1_idx 
        USING btree (tenant, location_address_country); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_postalcode TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address_postalcode 
        ON r4_sp1_idx 
        USING btree (tenant, location_address_postalcode); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_state TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address_state 
        ON r4_sp1_idx 
        USING btree (tenant, location_address_state); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_use_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_address_use_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_address_use_system
        ON r4_sp1_idx 
        USING btree (tenant, location_address_use_system);

        CREATE INDEX r4_sp1_idx_location_address_use_value
        ON r4_sp1_idx 
        USING btree (tenant, location_address_use_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_operational_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_operational_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_operational_status_system
        ON r4_sp1_idx 
        USING btree (tenant, location_operational_status_system);

        CREATE INDEX r4_sp1_idx_location_operational_status_value
        ON r4_sp1_idx 
        USING btree (tenant, location_operational_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS location_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_location_status_system
        ON r4_sp1_idx 
        USING btree (tenant, location_status_system);

        CREATE INDEX r4_sp1_idx_location_status_value
        ON r4_sp1_idx 
        USING btree (tenant, location_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_measure_date_start
        ON r4_sp1_idx 
        USING btree (tenant, measure_date_start);
        
        CREATE INDEX r4_sp1_idx_measure_date_end
        ON r4_sp1_idx 
        USING btree (tenant, measure_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_description 
        ON r4_sp1_idx 
        USING btree (tenant, measure_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_measure_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, measure_effective_start);
        
        CREATE INDEX r4_sp1_idx_measure_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, measure_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_name 
        ON r4_sp1_idx 
        USING btree (tenant, measure_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, measure_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_status_system
        ON r4_sp1_idx 
        USING btree (tenant, measure_status_system);

        CREATE INDEX r4_sp1_idx_measure_status_value
        ON r4_sp1_idx 
        USING btree (tenant, measure_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_title 
        ON r4_sp1_idx 
        USING btree (tenant, measure_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_url 
        ON r4_sp1_idx 
        USING btree (tenant, measure_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measure_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_measure_version_system
        ON r4_sp1_idx 
        USING btree (tenant, measure_version_system);

        CREATE INDEX r4_sp1_idx_measure_version_value
        ON r4_sp1_idx 
        USING btree (tenant, measure_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_measurereport_date_start
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_date_start);
        
        CREATE INDEX r4_sp1_idx_measurereport_date_end
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_measurereport_period_start
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_period_start);
        
        CREATE INDEX r4_sp1_idx_measurereport_period_end
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_period_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_measurereport_status_system
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_status_system);

        CREATE INDEX r4_sp1_idx_measurereport_status_value
        ON r4_sp1_idx 
        USING btree (tenant, measurereport_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_media_created_start
        ON r4_sp1_idx 
        USING btree (tenant, media_created_start);
        
        CREATE INDEX r4_sp1_idx_media_created_end
        ON r4_sp1_idx 
        USING btree (tenant, media_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_modality_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_modality_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_media_modality_system
        ON r4_sp1_idx 
        USING btree (tenant, media_modality_system);

        CREATE INDEX r4_sp1_idx_media_modality_value
        ON r4_sp1_idx 
        USING btree (tenant, media_modality_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_site_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_site_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_media_site_system
        ON r4_sp1_idx 
        USING btree (tenant, media_site_system);

        CREATE INDEX r4_sp1_idx_media_site_value
        ON r4_sp1_idx 
        USING btree (tenant, media_site_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_media_status_system
        ON r4_sp1_idx 
        USING btree (tenant, media_status_system);

        CREATE INDEX r4_sp1_idx_media_status_value
        ON r4_sp1_idx 
        USING btree (tenant, media_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_media_type_system
        ON r4_sp1_idx 
        USING btree (tenant, media_type_system);

        CREATE INDEX r4_sp1_idx_media_type_value
        ON r4_sp1_idx 
        USING btree (tenant, media_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_view_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS media_view_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_media_view_system
        ON r4_sp1_idx 
        USING btree (tenant, media_view_system);

        CREATE INDEX r4_sp1_idx_media_view_value
        ON r4_sp1_idx 
        USING btree (tenant, media_view_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_expiration_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_expiration_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medication_expiration_date_start
        ON r4_sp1_idx 
        USING btree (tenant, medication_expiration_date_start);
        
        CREATE INDEX r4_sp1_idx_medication_expiration_date_end
        ON r4_sp1_idx 
        USING btree (tenant, medication_expiration_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_form_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_form_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medication_form_system
        ON r4_sp1_idx 
        USING btree (tenant, medication_form_system);

        CREATE INDEX r4_sp1_idx_medication_form_value
        ON r4_sp1_idx 
        USING btree (tenant, medication_form_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_lot_number_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_lot_number_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medication_lot_number_system
        ON r4_sp1_idx 
        USING btree (tenant, medication_lot_number_system);

        CREATE INDEX r4_sp1_idx_medication_lot_number_value
        ON r4_sp1_idx 
        USING btree (tenant, medication_lot_number_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medication_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medication_status_system
        ON r4_sp1_idx 
        USING btree (tenant, medication_status_system);

        CREATE INDEX r4_sp1_idx_medication_status_value
        ON r4_sp1_idx 
        USING btree (tenant, medication_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationadministration_effective_time_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationadministration_effective_time_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medicationadministration_effective_time_start
        ON r4_sp1_idx 
        USING btree (tenant, medicationadministration_effective_time_start);
        
        CREATE INDEX r4_sp1_idx_medicationadministration_effective_time_end
        ON r4_sp1_idx 
        USING btree (tenant, medicationadministration_effective_time_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medications_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medications_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medications_status_system
        ON r4_sp1_idx 
        USING btree (tenant, medications_status_system);

        CREATE INDEX r4_sp1_idx_medications_status_value
        ON r4_sp1_idx 
        USING btree (tenant, medications_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationdispense_type_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_type_system);

        CREATE INDEX r4_sp1_idx_medicationdispense_type_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenhandedover_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenhandedover_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medicationdispense_whenhandedover_start
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_whenhandedover_start);
        
        CREATE INDEX r4_sp1_idx_medicationdispense_whenhandedover_end
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_whenhandedover_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenprepared_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenprepared_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medicationdispense_whenprepared_start
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_whenprepared_start);
        
        CREATE INDEX r4_sp1_idx_medicationdispense_whenprepared_end
        ON r4_sp1_idx 
        USING btree (tenant, medicationdispense_whenprepared_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationknowledge_code_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_code_system);

        CREATE INDEX r4_sp1_idx_medicationknowledge_code_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_doseform_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_doseform_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationknowledge_doseform_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_doseform_system);

        CREATE INDEX r4_sp1_idx_medicationknowledge_doseform_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_doseform_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationknowledge_status_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_status_system);

        CREATE INDEX r4_sp1_idx_medicationknowledge_status_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationknowledge_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_authoredon_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_authoredon_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medicationrequest_authoredon_start
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_authoredon_start);
        
        CREATE INDEX r4_sp1_idx_medicationrequest_authoredon_end
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_authoredon_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intended_performertype_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intended_performertype_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationrequest_intended_performertype_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_intended_performertype_system);

        CREATE INDEX r4_sp1_idx_medicationrequest_intended_performertype_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_intended_performertype_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationrequest_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_intent_system);

        CREATE INDEX r4_sp1_idx_medicationrequest_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationrequest_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_priority_system);

        CREATE INDEX r4_sp1_idx_medicationrequest_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationrequest_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_category_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_category_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicationstatement_category_system
        ON r4_sp1_idx 
        USING btree (tenant, medicationstatement_category_system);

        CREATE INDEX r4_sp1_idx_medicationstatement_category_value
        ON r4_sp1_idx 
        USING btree (tenant, medicationstatement_category_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_medicationstatement_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, medicationstatement_effective_start);
        
        CREATE INDEX r4_sp1_idx_medicationstatement_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, medicationstatement_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductauthorization_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductauthorization_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_medicinalproductauthorization_status_system
        ON r4_sp1_idx 
        USING btree (tenant, medicinalproductauthorization_status_system);

        CREATE INDEX r4_sp1_idx_medicinalproductauthorization_status_value
        ON r4_sp1_idx 
        USING btree (tenant, medicinalproductauthorization_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_category_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_category_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagedefinition_category_system
        ON r4_sp1_idx 
        USING btree (tenant, messagedefinition_category_system);

        CREATE INDEX r4_sp1_idx_messagedefinition_category_value
        ON r4_sp1_idx 
        USING btree (tenant, messagedefinition_category_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_event_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_event_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagedefinition_event_system
        ON r4_sp1_idx 
        USING btree (tenant, messagedefinition_event_system);

        CREATE INDEX r4_sp1_idx_messagedefinition_event_value
        ON r4_sp1_idx 
        USING btree (tenant, messagedefinition_event_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messageheader_code_system
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_code_system);

        CREATE INDEX r4_sp1_idx_messageheader_code_value
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_event_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_event_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messageheader_event_system
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_event_system);

        CREATE INDEX r4_sp1_idx_messageheader_event_value
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_event_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_response_id_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_response_id_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messageheader_response_id_system
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_response_id_system);

        CREATE INDEX r4_sp1_idx_messageheader_response_id_value
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_response_id_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_source TEXT; 
 
        CREATE INDEX r4_sp1_idx_messageheader_source 
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_source); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_source_uri TEXT; 
 
        CREATE INDEX r4_sp1_idx_messageheader_source_uri 
        ON r4_sp1_idx 
        USING btree (tenant, messageheader_source_uri); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_chromosome_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_chromosome_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_molecularsequence_chromosome_system
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_chromosome_system);

        CREATE INDEX r4_sp1_idx_molecularsequence_chromosome_value
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_chromosome_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_referenceseqid_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_referenceseqid_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_molecularsequence_referenceseqid_system
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_referenceseqid_system);

        CREATE INDEX r4_sp1_idx_molecularsequence_referenceseqid_value
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_referenceseqid_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_molecularsequence_type_system
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_type_system);

        CREATE INDEX r4_sp1_idx_molecularsequence_type_value
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_window_end NUMERIC; 
 
        CREATE INDEX r4_sp1_idx_molecularsequence_window_end 
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_window_end); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_window_start NUMERIC; 
 
        CREATE INDEX r4_sp1_idx_molecularsequence_window_start 
        ON r4_sp1_idx 
        USING btree (tenant, molecularsequence_window_start); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_kind_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_kind_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_namingsystem_kind_system
        ON r4_sp1_idx 
        USING btree (tenant, namingsystem_kind_system);

        CREATE INDEX r4_sp1_idx_namingsystem_kind_value
        ON r4_sp1_idx 
        USING btree (tenant, namingsystem_kind_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_responsible TEXT; 
 
        CREATE INDEX r4_sp1_idx_namingsystem_responsible 
        ON r4_sp1_idx 
        USING btree (tenant, namingsystem_responsible); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_namingsystem_type_system
        ON r4_sp1_idx 
        USING btree (tenant, namingsystem_type_system);

        CREATE INDEX r4_sp1_idx_namingsystem_type_value
        ON r4_sp1_idx 
        USING btree (tenant, namingsystem_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_additive_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_additive_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_nutritionorder_additive_system
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_additive_system);

        CREATE INDEX r4_sp1_idx_nutritionorder_additive_value
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_additive_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_datetime_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_datetime_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_nutritionorder_datetime_start
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_datetime_start);
        
        CREATE INDEX r4_sp1_idx_nutritionorder_datetime_end
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_datetime_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_formula_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_formula_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_nutritionorder_formula_system
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_formula_system);

        CREATE INDEX r4_sp1_idx_nutritionorder_formula_value
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_formula_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_nutritionorder_status_system
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_status_system);

        CREATE INDEX r4_sp1_idx_nutritionorder_status_value
        ON r4_sp1_idx 
        USING btree (tenant, nutritionorder_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_data_absent_reason_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_data_absent_reason_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_data_absent_reason_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_data_absent_reason_system);

        CREATE INDEX r4_sp1_idx_observation_data_absent_reason_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_data_absent_reason_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_method_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_method_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_method_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_method_system);

        CREATE INDEX r4_sp1_idx_observation_method_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_method_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_status_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_status_system);

        CREATE INDEX r4_sp1_idx_observation_status_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_concept_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_concept_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_value_concept_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_concept_system);

        CREATE INDEX r4_sp1_idx_observation_value_concept_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_concept_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_observation_value_date_start
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_date_start);
        
        CREATE INDEX r4_sp1_idx_observation_value_date_end
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_code TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_value NUMERIC; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_code TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_value_quantity_start_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_value);
        
        CREATE INDEX r4_sp1_idx_observation_value_quantity_start_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_system);

        CREATE INDEX r4_sp1_idx_observation_value_quantity_start_code
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_code);

        CREATE INDEX r4_sp1_idx_observation_value_quantity_end_value
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_value);
        
        CREATE INDEX r4_sp1_idx_observation_value_quantity_end_system
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_system);

        CREATE INDEX r4_sp1_idx_observation_value_quantity_end_code
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_code);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_string TEXT; 
 
        CREATE INDEX r4_sp1_idx_observation_value_string 
        ON r4_sp1_idx 
        USING btree (tenant, observation_value_string); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_operationdefinition_code_system
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_code_system);

        CREATE INDEX r4_sp1_idx_operationdefinition_code_value
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_instance_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_instance_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_operationdefinition_instance_system
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_instance_system);

        CREATE INDEX r4_sp1_idx_operationdefinition_instance_value
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_instance_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_kind_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_kind_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_operationdefinition_kind_system
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_kind_system);

        CREATE INDEX r4_sp1_idx_operationdefinition_kind_value
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_kind_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_system_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_system_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_operationdefinition_system_system
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_system_system);

        CREATE INDEX r4_sp1_idx_operationdefinition_system_value
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_system_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_operationdefinition_type_system
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_type_system);

        CREATE INDEX r4_sp1_idx_operationdefinition_type_value
        ON r4_sp1_idx 
        USING btree (tenant, operationdefinition_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organization_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organization_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_organization_active_system
        ON r4_sp1_idx 
        USING btree (tenant, organization_active_system);

        CREATE INDEX r4_sp1_idx_organization_active_value
        ON r4_sp1_idx 
        USING btree (tenant, organization_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organization_phonetic TEXT; 
 
        CREATE INDEX r4_sp1_idx_organization_phonetic 
        ON r4_sp1_idx 
        USING btree (tenant, organization_phonetic); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_organizationaffiliation_active_system
        ON r4_sp1_idx 
        USING btree (tenant, organizationaffiliation_active_system);

        CREATE INDEX r4_sp1_idx_organizationaffiliation_active_value
        ON r4_sp1_idx 
        USING btree (tenant, organizationaffiliation_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_organizationaffiliation_date_start
        ON r4_sp1_idx 
        USING btree (tenant, organizationaffiliation_date_start);
        
        CREATE INDEX r4_sp1_idx_organizationaffiliation_date_end
        ON r4_sp1_idx 
        USING btree (tenant, organizationaffiliation_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS patient_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS patient_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_patient_active_system
        ON r4_sp1_idx 
        USING btree (tenant, patient_active_system);

        CREATE INDEX r4_sp1_idx_patient_active_value
        ON r4_sp1_idx 
        USING btree (tenant, patient_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS individual_birthdate_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS individual_birthdate_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_individual_birthdate_start
        ON r4_sp1_idx 
        USING btree (tenant, individual_birthdate_start);
        
        CREATE INDEX r4_sp1_idx_individual_birthdate_end
        ON r4_sp1_idx 
        USING btree (tenant, individual_birthdate_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS patient_death_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS patient_death_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_patient_death_date_start
        ON r4_sp1_idx 
        USING btree (tenant, patient_death_date_start);
        
        CREATE INDEX r4_sp1_idx_patient_death_date_end
        ON r4_sp1_idx 
        USING btree (tenant, patient_death_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS individual_gender_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS individual_gender_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_individual_gender_system
        ON r4_sp1_idx 
        USING btree (tenant, individual_gender_system);

        CREATE INDEX r4_sp1_idx_individual_gender_value
        ON r4_sp1_idx 
        USING btree (tenant, individual_gender_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_paymentnotice_created_start
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_created_start);
        
        CREATE INDEX r4_sp1_idx_paymentnotice_created_end
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_payment_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_payment_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_paymentnotice_payment_status_system
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_payment_status_system);

        CREATE INDEX r4_sp1_idx_paymentnotice_payment_status_value
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_payment_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_paymentnotice_status_system
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_status_system);

        CREATE INDEX r4_sp1_idx_paymentnotice_status_value
        ON r4_sp1_idx 
        USING btree (tenant, paymentnotice_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_paymentreconciliation_created_start
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_created_start);
        
        CREATE INDEX r4_sp1_idx_paymentreconciliation_created_end
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_created_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_disposition TEXT; 
 
        CREATE INDEX r4_sp1_idx_paymentreconciliation_disposition 
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_disposition); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_outcome_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_outcome_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_paymentreconciliation_outcome_system
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_outcome_system);

        CREATE INDEX r4_sp1_idx_paymentreconciliation_outcome_value
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_outcome_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_paymentreconciliation_status_system
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_status_system);

        CREATE INDEX r4_sp1_idx_paymentreconciliation_status_value
        ON r4_sp1_idx 
        USING btree (tenant, paymentreconciliation_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_plandefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_plandefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_name 
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_status_system);

        CREATE INDEX r4_sp1_idx_plandefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_type_system
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_type_system);

        CREATE INDEX r4_sp1_idx_plandefinition_type_value
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_plandefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_version_system);

        CREATE INDEX r4_sp1_idx_plandefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, plandefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitioner_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitioner_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_practitioner_active_system
        ON r4_sp1_idx 
        USING btree (tenant, practitioner_active_system);

        CREATE INDEX r4_sp1_idx_practitioner_active_value
        ON r4_sp1_idx 
        USING btree (tenant, practitioner_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_practitionerrole_active_system
        ON r4_sp1_idx 
        USING btree (tenant, practitionerrole_active_system);

        CREATE INDEX r4_sp1_idx_practitionerrole_active_value
        ON r4_sp1_idx 
        USING btree (tenant, practitionerrole_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_practitionerrole_date_start
        ON r4_sp1_idx 
        USING btree (tenant, practitionerrole_date_start);
        
        CREATE INDEX r4_sp1_idx_practitionerrole_date_end
        ON r4_sp1_idx 
        USING btree (tenant, practitionerrole_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS procedure_category_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS procedure_category_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_procedure_category_system
        ON r4_sp1_idx 
        USING btree (tenant, procedure_category_system);

        CREATE INDEX r4_sp1_idx_procedure_category_value
        ON r4_sp1_idx 
        USING btree (tenant, procedure_category_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS procedure_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS procedure_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_procedure_status_system
        ON r4_sp1_idx 
        USING btree (tenant, procedure_status_system);

        CREATE INDEX r4_sp1_idx_procedure_status_value
        ON r4_sp1_idx 
        USING btree (tenant, procedure_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS provenance_recorded_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS provenance_recorded_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_provenance_recorded_start
        ON r4_sp1_idx 
        USING btree (tenant, provenance_recorded_start);
        
        CREATE INDEX r4_sp1_idx_provenance_recorded_end
        ON r4_sp1_idx 
        USING btree (tenant, provenance_recorded_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS provenance_when_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS provenance_when_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_provenance_when_start
        ON r4_sp1_idx 
        USING btree (tenant, provenance_when_start);
        
        CREATE INDEX r4_sp1_idx_provenance_when_end
        ON r4_sp1_idx 
        USING btree (tenant, provenance_when_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_date_start
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_date_start);
        
        CREATE INDEX r4_sp1_idx_questionnaire_date_end
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_description 
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_effective_start);
        
        CREATE INDEX r4_sp1_idx_questionnaire_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_name 
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_status_system
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_status_system);

        CREATE INDEX r4_sp1_idx_questionnaire_status_value
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_title 
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_url 
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaire_version_system
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_version_system);

        CREATE INDEX r4_sp1_idx_questionnaire_version_value
        ON r4_sp1_idx 
        USING btree (tenant, questionnaire_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_questionnaireresponse_authored_start
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_authored_start);
        
        CREATE INDEX r4_sp1_idx_questionnaireresponse_authored_end
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_authored_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaireresponse_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_identifier_system);

        CREATE INDEX r4_sp1_idx_questionnaireresponse_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_questionnaireresponse_status_system
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_status_system);

        CREATE INDEX r4_sp1_idx_questionnaireresponse_status_value
        ON r4_sp1_idx 
        USING btree (tenant, questionnaireresponse_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS relatedperson_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS relatedperson_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_relatedperson_active_system
        ON r4_sp1_idx 
        USING btree (tenant, relatedperson_active_system);

        CREATE INDEX r4_sp1_idx_relatedperson_active_value
        ON r4_sp1_idx 
        USING btree (tenant, relatedperson_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_authored_start
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_authored_start);
        
        CREATE INDEX r4_sp1_idx_requestgroup_authored_end
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_authored_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_code_system
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_code_system);

        CREATE INDEX r4_sp1_idx_requestgroup_code_value
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_group_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_group_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_group_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_group_identifier_system);

        CREATE INDEX r4_sp1_idx_requestgroup_group_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_group_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_intent_system);

        CREATE INDEX r4_sp1_idx_requestgroup_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_priority_system);

        CREATE INDEX r4_sp1_idx_requestgroup_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_requestgroup_status_system
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_status_system);

        CREATE INDEX r4_sp1_idx_requestgroup_status_value
        ON r4_sp1_idx 
        USING btree (tenant, requestgroup_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_researchdefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_researchdefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_name 
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_status_system);

        CREATE INDEX r4_sp1_idx_researchdefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchdefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_version_system);

        CREATE INDEX r4_sp1_idx_researchdefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, researchdefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_date_start
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_date_start);
        
        CREATE INDEX r4_sp1_idx_researchelementdefinition_date_end
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_description 
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_effective_start);
        
        CREATE INDEX r4_sp1_idx_researchelementdefinition_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_name 
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_status_system
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_status_system);

        CREATE INDEX r4_sp1_idx_researchelementdefinition_status_value
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_title 
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_url 
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchelementdefinition_version_system
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_version_system);

        CREATE INDEX r4_sp1_idx_researchelementdefinition_version_value
        ON r4_sp1_idx 
        USING btree (tenant, researchelementdefinition_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchstudy_date_start
        ON r4_sp1_idx 
        USING btree (tenant, researchstudy_date_start);
        
        CREATE INDEX r4_sp1_idx_researchstudy_date_end
        ON r4_sp1_idx 
        USING btree (tenant, researchstudy_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchstudy_status_system
        ON r4_sp1_idx 
        USING btree (tenant, researchstudy_status_system);

        CREATE INDEX r4_sp1_idx_researchstudy_status_value
        ON r4_sp1_idx 
        USING btree (tenant, researchstudy_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchstudy_title 
        ON r4_sp1_idx 
        USING btree (tenant, researchstudy_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_researchsubject_date_start
        ON r4_sp1_idx 
        USING btree (tenant, researchsubject_date_start);
        
        CREATE INDEX r4_sp1_idx_researchsubject_date_end
        ON r4_sp1_idx 
        USING btree (tenant, researchsubject_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_researchsubject_status_system
        ON r4_sp1_idx 
        USING btree (tenant, researchsubject_status_system);

        CREATE INDEX r4_sp1_idx_researchsubject_status_value
        ON r4_sp1_idx 
        USING btree (tenant, researchsubject_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskassessment_method_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskassessment_method_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskassessment_method_system
        ON r4_sp1_idx 
        USING btree (tenant, riskassessment_method_system);

        CREATE INDEX r4_sp1_idx_riskassessment_method_value
        ON r4_sp1_idx 
        USING btree (tenant, riskassessment_method_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_date_start
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_date_start);
        
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_date_end
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_description 
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_effective_start
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_effective_start);
        
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_effective_end
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_effective_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_name 
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_status_system
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_status_system);

        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_status_value
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_title 
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_url 
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS riskevidencesynthesis_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_version_system
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_version_system);

        CREATE INDEX r4_sp1_idx_riskevidencesynthesis_version_value
        ON r4_sp1_idx 
        USING btree (tenant, riskevidencesynthesis_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS schedule_active_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS schedule_active_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_schedule_active_system
        ON r4_sp1_idx 
        USING btree (tenant, schedule_active_system);

        CREATE INDEX r4_sp1_idx_schedule_active_value
        ON r4_sp1_idx 
        USING btree (tenant, schedule_active_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS schedule_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS schedule_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_schedule_date_start
        ON r4_sp1_idx 
        USING btree (tenant, schedule_date_start);
        
        CREATE INDEX r4_sp1_idx_schedule_date_end
        ON r4_sp1_idx 
        USING btree (tenant, schedule_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_searchparameter_code_system
        ON r4_sp1_idx 
        USING btree (tenant, searchparameter_code_system);

        CREATE INDEX r4_sp1_idx_searchparameter_code_value
        ON r4_sp1_idx 
        USING btree (tenant, searchparameter_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_searchparameter_type_system
        ON r4_sp1_idx 
        USING btree (tenant, searchparameter_type_system);

        CREATE INDEX r4_sp1_idx_searchparameter_type_value
        ON r4_sp1_idx 
        USING btree (tenant, searchparameter_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_authored_start
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_authored_start);
        
        CREATE INDEX r4_sp1_idx_servicerequest_authored_end
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_authored_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_intent_system);

        CREATE INDEX r4_sp1_idx_servicerequest_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_occurrence_start
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_occurrence_start);
        
        CREATE INDEX r4_sp1_idx_servicerequest_occurrence_end
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_occurrence_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_performer_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_performer_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_performer_type_system
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_performer_type_system);

        CREATE INDEX r4_sp1_idx_servicerequest_performer_type_value
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_performer_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_priority_system);

        CREATE INDEX r4_sp1_idx_servicerequest_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_requisition_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_requisition_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_requisition_system
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_requisition_system);

        CREATE INDEX r4_sp1_idx_servicerequest_requisition_value
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_requisition_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_servicerequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_status_system);

        CREATE INDEX r4_sp1_idx_servicerequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, servicerequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_appointment_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_appointment_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_slot_appointment_type_system
        ON r4_sp1_idx 
        USING btree (tenant, slot_appointment_type_system);

        CREATE INDEX r4_sp1_idx_slot_appointment_type_value
        ON r4_sp1_idx 
        USING btree (tenant, slot_appointment_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_start_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_start_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_slot_start_start
        ON r4_sp1_idx 
        USING btree (tenant, slot_start_start);
        
        CREATE INDEX r4_sp1_idx_slot_start_end
        ON r4_sp1_idx 
        USING btree (tenant, slot_start_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS slot_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_slot_status_system
        ON r4_sp1_idx 
        USING btree (tenant, slot_status_system);

        CREATE INDEX r4_sp1_idx_slot_status_value
        ON r4_sp1_idx 
        USING btree (tenant, slot_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_accession_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_accession_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimen_accession_system
        ON r4_sp1_idx 
        USING btree (tenant, specimen_accession_system);

        CREATE INDEX r4_sp1_idx_specimen_accession_value
        ON r4_sp1_idx 
        USING btree (tenant, specimen_accession_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_bodysite_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_bodysite_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimen_bodysite_system
        ON r4_sp1_idx 
        USING btree (tenant, specimen_bodysite_system);

        CREATE INDEX r4_sp1_idx_specimen_bodysite_value
        ON r4_sp1_idx 
        USING btree (tenant, specimen_bodysite_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_collected_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_collected_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_specimen_collected_start
        ON r4_sp1_idx 
        USING btree (tenant, specimen_collected_start);
        
        CREATE INDEX r4_sp1_idx_specimen_collected_end
        ON r4_sp1_idx 
        USING btree (tenant, specimen_collected_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimen_status_system
        ON r4_sp1_idx 
        USING btree (tenant, specimen_status_system);

        CREATE INDEX r4_sp1_idx_specimen_status_value
        ON r4_sp1_idx 
        USING btree (tenant, specimen_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimen_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimen_type_system
        ON r4_sp1_idx 
        USING btree (tenant, specimen_type_system);

        CREATE INDEX r4_sp1_idx_specimen_type_value
        ON r4_sp1_idx 
        USING btree (tenant, specimen_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimendefinition_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, specimendefinition_identifier_system);

        CREATE INDEX r4_sp1_idx_specimendefinition_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, specimendefinition_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_specimendefinition_type_system
        ON r4_sp1_idx 
        USING btree (tenant, specimendefinition_type_system);

        CREATE INDEX r4_sp1_idx_specimendefinition_type_value
        ON r4_sp1_idx 
        USING btree (tenant, specimendefinition_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_abstract_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_abstract_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_structuredefinition_abstract_system
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_abstract_system);

        CREATE INDEX r4_sp1_idx_structuredefinition_abstract_value
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_abstract_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_derivation_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_derivation_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_structuredefinition_derivation_system
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_derivation_system);

        CREATE INDEX r4_sp1_idx_structuredefinition_derivation_value
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_derivation_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_experimental_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_experimental_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_structuredefinition_experimental_system
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_experimental_system);

        CREATE INDEX r4_sp1_idx_structuredefinition_experimental_value
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_experimental_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_kind_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_kind_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_structuredefinition_kind_system
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_kind_system);

        CREATE INDEX r4_sp1_idx_structuredefinition_kind_value
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_kind_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_type TEXT; 
 
        CREATE INDEX r4_sp1_idx_structuredefinition_type 
        ON r4_sp1_idx 
        USING btree (tenant, structuredefinition_type); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_criteria TEXT; 
 
        CREATE INDEX r4_sp1_idx_subscription_criteria 
        ON r4_sp1_idx 
        USING btree (tenant, subscription_criteria); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_payload_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_payload_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_subscription_payload_system
        ON r4_sp1_idx 
        USING btree (tenant, subscription_payload_system);

        CREATE INDEX r4_sp1_idx_subscription_payload_value
        ON r4_sp1_idx 
        USING btree (tenant, subscription_payload_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_subscription_status_system
        ON r4_sp1_idx 
        USING btree (tenant, subscription_status_system);

        CREATE INDEX r4_sp1_idx_subscription_status_value
        ON r4_sp1_idx 
        USING btree (tenant, subscription_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_subscription_type_system
        ON r4_sp1_idx 
        USING btree (tenant, subscription_type_system);

        CREATE INDEX r4_sp1_idx_subscription_type_value
        ON r4_sp1_idx 
        USING btree (tenant, subscription_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS subscription_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_subscription_url 
        ON r4_sp1_idx 
        USING btree (tenant, subscription_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS substance_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS substance_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_substance_status_system
        ON r4_sp1_idx 
        USING btree (tenant, substance_status_system);

        CREATE INDEX r4_sp1_idx_substance_status_value
        ON r4_sp1_idx 
        USING btree (tenant, substance_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplydelivery_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplydelivery_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_supplydelivery_status_system
        ON r4_sp1_idx 
        USING btree (tenant, supplydelivery_status_system);

        CREATE INDEX r4_sp1_idx_supplydelivery_status_value
        ON r4_sp1_idx 
        USING btree (tenant, supplydelivery_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_category_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_category_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_supplyrequest_category_system
        ON r4_sp1_idx 
        USING btree (tenant, supplyrequest_category_system);

        CREATE INDEX r4_sp1_idx_supplyrequest_category_value
        ON r4_sp1_idx 
        USING btree (tenant, supplyrequest_category_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_supplyrequest_status_system
        ON r4_sp1_idx 
        USING btree (tenant, supplyrequest_status_system);

        CREATE INDEX r4_sp1_idx_supplyrequest_status_value
        ON r4_sp1_idx 
        USING btree (tenant, supplyrequest_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_authored_on_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_authored_on_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_task_authored_on_start
        ON r4_sp1_idx 
        USING btree (tenant, task_authored_on_start);
        
        CREATE INDEX r4_sp1_idx_task_authored_on_end
        ON r4_sp1_idx 
        USING btree (tenant, task_authored_on_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_business_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_business_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_business_status_system
        ON r4_sp1_idx 
        USING btree (tenant, task_business_status_system);

        CREATE INDEX r4_sp1_idx_task_business_status_value
        ON r4_sp1_idx 
        USING btree (tenant, task_business_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_code_system
        ON r4_sp1_idx 
        USING btree (tenant, task_code_system);

        CREATE INDEX r4_sp1_idx_task_code_value
        ON r4_sp1_idx 
        USING btree (tenant, task_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_group_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_group_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_group_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, task_group_identifier_system);

        CREATE INDEX r4_sp1_idx_task_group_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, task_group_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_intent_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_intent_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_intent_system
        ON r4_sp1_idx 
        USING btree (tenant, task_intent_system);

        CREATE INDEX r4_sp1_idx_task_intent_value
        ON r4_sp1_idx 
        USING btree (tenant, task_intent_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_modified_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_modified_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_task_modified_start
        ON r4_sp1_idx 
        USING btree (tenant, task_modified_start);
        
        CREATE INDEX r4_sp1_idx_task_modified_end
        ON r4_sp1_idx 
        USING btree (tenant, task_modified_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_task_period_start
        ON r4_sp1_idx 
        USING btree (tenant, task_period_start);
        
        CREATE INDEX r4_sp1_idx_task_period_end
        ON r4_sp1_idx 
        USING btree (tenant, task_period_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_priority_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_priority_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_priority_system
        ON r4_sp1_idx 
        USING btree (tenant, task_priority_system);

        CREATE INDEX r4_sp1_idx_task_priority_value
        ON r4_sp1_idx 
        USING btree (tenant, task_priority_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS task_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_task_status_system
        ON r4_sp1_idx 
        USING btree (tenant, task_status_system);

        CREATE INDEX r4_sp1_idx_task_status_value
        ON r4_sp1_idx 
        USING btree (tenant, task_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_testreport_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, testreport_identifier_system);

        CREATE INDEX r4_sp1_idx_testreport_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, testreport_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_testreport_issued_start
        ON r4_sp1_idx 
        USING btree (tenant, testreport_issued_start);
        
        CREATE INDEX r4_sp1_idx_testreport_issued_end
        ON r4_sp1_idx 
        USING btree (tenant, testreport_issued_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_result_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_result_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_testreport_result_system
        ON r4_sp1_idx 
        USING btree (tenant, testreport_result_system);

        CREATE INDEX r4_sp1_idx_testreport_result_value
        ON r4_sp1_idx 
        USING btree (tenant, testreport_result_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testreport_tester TEXT; 
 
        CREATE INDEX r4_sp1_idx_testreport_tester 
        ON r4_sp1_idx 
        USING btree (tenant, testreport_tester); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_testscript_date_start
        ON r4_sp1_idx 
        USING btree (tenant, testscript_date_start);
        
        CREATE INDEX r4_sp1_idx_testscript_date_end
        ON r4_sp1_idx 
        USING btree (tenant, testscript_date_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_description TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_description 
        ON r4_sp1_idx 
        USING btree (tenant, testscript_description); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_identifier_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_identifier_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_identifier_system
        ON r4_sp1_idx 
        USING btree (tenant, testscript_identifier_system);

        CREATE INDEX r4_sp1_idx_testscript_identifier_value
        ON r4_sp1_idx 
        USING btree (tenant, testscript_identifier_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_name 
        ON r4_sp1_idx 
        USING btree (tenant, testscript_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_publisher TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_publisher 
        ON r4_sp1_idx 
        USING btree (tenant, testscript_publisher); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_status_system
        ON r4_sp1_idx 
        USING btree (tenant, testscript_status_system);

        CREATE INDEX r4_sp1_idx_testscript_status_value
        ON r4_sp1_idx 
        USING btree (tenant, testscript_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_title TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_title 
        ON r4_sp1_idx 
        USING btree (tenant, testscript_title); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_url TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_url 
        ON r4_sp1_idx 
        USING btree (tenant, testscript_url); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_version_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS testscript_version_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_testscript_version_system
        ON r4_sp1_idx 
        USING btree (tenant, testscript_version_system);

        CREATE INDEX r4_sp1_idx_testscript_version_value
        ON r4_sp1_idx 
        USING btree (tenant, testscript_version_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS valueset_expansion TEXT; 
 
        CREATE INDEX r4_sp1_idx_valueset_expansion 
        ON r4_sp1_idx 
        USING btree (tenant, valueset_expansion); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_datewritten_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_datewritten_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4_sp1_idx_visionprescription_datewritten_start
        ON r4_sp1_idx 
        USING btree (tenant, visionprescription_datewritten_start);
        
        CREATE INDEX r4_sp1_idx_visionprescription_datewritten_end
        ON r4_sp1_idx 
        USING btree (tenant, visionprescription_datewritten_end);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_visionprescription_status_system
        ON r4_sp1_idx 
        USING btree (tenant, visionprescription_status_system);

        CREATE INDEX r4_sp1_idx_visionprescription_status_value
        ON r4_sp1_idx 
        USING btree (tenant, visionprescription_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicyv2_engine_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicyv2_engine_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_accesspolicyv2_engine_system
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicyv2_engine_system);

        CREATE INDEX r4_sp1_idx_accesspolicyv2_engine_value
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicyv2_engine_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicyv2_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_accesspolicyv2_name 
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicyv2_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicy_code_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicy_code_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_accesspolicy_code_system
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicy_code_system);

        CREATE INDEX r4_sp1_idx_accesspolicy_code_value
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicy_code_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicy_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_accesspolicy_name 
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicy_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicy_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS accesspolicy_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_accesspolicy_type_system
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicy_type_system);

        CREATE INDEX r4_sp1_idx_accesspolicy_type_value
        ON r4_sp1_idx 
        USING btree (tenant, accesspolicy_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS clientapplication_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_clientapplication_name 
        ON r4_sp1_idx 
        USING btree (tenant, clientapplication_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS identityprovider_accesstype_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS identityprovider_accesstype_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_identityprovider_accesstype_system
        ON r4_sp1_idx 
        USING btree (tenant, identityprovider_accesstype_system);

        CREATE INDEX r4_sp1_idx_identityprovider_accesstype_value
        ON r4_sp1_idx 
        USING btree (tenant, identityprovider_accesstype_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS identityprovider_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_identityprovider_name 
        ON r4_sp1_idx 
        USING btree (tenant, identityprovider_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS identityprovider_status_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS identityprovider_status_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_identityprovider_status_system
        ON r4_sp1_idx 
        USING btree (tenant, identityprovider_status_system);

        CREATE INDEX r4_sp1_idx_identityprovider_status_value
        ON r4_sp1_idx 
        USING btree (tenant, identityprovider_status_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS membership_email_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS membership_email_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_membership_email_system
        ON r4_sp1_idx 
        USING btree (tenant, membership_email_system);

        CREATE INDEX r4_sp1_idx_membership_email_value
        ON r4_sp1_idx 
        USING btree (tenant, membership_email_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS membership_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_membership_name 
        ON r4_sp1_idx 
        USING btree (tenant, membership_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS membership_role_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS membership_role_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_membership_role_system
        ON r4_sp1_idx 
        USING btree (tenant, membership_role_system);

        CREATE INDEX r4_sp1_idx_membership_role_value
        ON r4_sp1_idx 
        USING btree (tenant, membership_role_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagebroker_host TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagebroker_host 
        ON r4_sp1_idx 
        USING btree (tenant, messagebroker_host); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagebroker_name TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagebroker_name 
        ON r4_sp1_idx 
        USING btree (tenant, messagebroker_name); 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagebroker_type_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagebroker_type_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagebroker_type_system
        ON r4_sp1_idx 
        USING btree (tenant, messagebroker_type_system);

        CREATE INDEX r4_sp1_idx_messagebroker_type_value
        ON r4_sp1_idx 
        USING btree (tenant, messagebroker_type_value);
         
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagetopic_topic_system TEXT; 
 ALTER TABLE r4_sp1_idx ADD COLUMN IF NOT EXISTS messagetopic_topic_value TEXT; 
 
        CREATE INDEX r4_sp1_idx_messagetopic_topic_system
        ON r4_sp1_idx 
        USING btree (tenant, messagetopic_topic_system);

        CREATE INDEX r4_sp1_idx_messagetopic_topic_value
        ON r4_sp1_idx 
        USING btree (tenant, messagetopic_topic_value);
         
-- R4B SP1 SQL 

CREATE TABLE IF NOT EXISTS r4b_sp1_idx (
  r_id           TEXT         NOT NULL,
  r_version_id   INTEGER      NOT NULL PRIMARY KEY,
  tenant         TEXT         NOT NULL, 
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  UNIQUE (tenant, r_id),
  CONSTRAINT sp1_fk_resource
      FOREIGN KEY(r_version_id) 
	REFERENCES resources(version_id),
  CONSTRAINT sp1_fk_tenant
      FOREIGN KEY(tenant) 
	REFERENCES tenants(id)
);
 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS resource_id_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS resource_id_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_resource_id_system
        ON r4b_sp1_idx 
        USING btree (tenant, resource_id_system);

        CREATE INDEX r4b_sp1_idx_resource_id_value
        ON r4b_sp1_idx 
        USING btree (tenant, resource_id_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS resource_lastupdated_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS resource_lastupdated_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_resource_lastupdated_start
        ON r4b_sp1_idx 
        USING btree (tenant, resource_lastupdated_start);
        
        CREATE INDEX r4b_sp1_idx_resource_lastupdated_end
        ON r4b_sp1_idx 
        USING btree (tenant, resource_lastupdated_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS resource_source TEXT; 
 
        CREATE INDEX r4b_sp1_idx_resource_source 
        ON r4b_sp1_idx 
        USING btree (tenant, resource_source); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_account_name 
        ON r4b_sp1_idx 
        USING btree (tenant, account_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_account_period_start
        ON r4b_sp1_idx 
        USING btree (tenant, account_period_start);
        
        CREATE INDEX r4b_sp1_idx_account_period_end
        ON r4b_sp1_idx 
        USING btree (tenant, account_period_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_account_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, account_status_system);

        CREATE INDEX r4b_sp1_idx_account_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, account_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS account_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_account_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, account_type_system);

        CREATE INDEX r4b_sp1_idx_account_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, account_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_activitydefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_activitydefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_name 
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_status_system);

        CREATE INDEX r4b_sp1_idx_activitydefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS activitydefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_activitydefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_version_system);

        CREATE INDEX r4b_sp1_idx_activitydefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, activitydefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS administrableproductdefinition_dose_form_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS administrableproductdefinition_dose_form_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_administrableproductdefinition_dose_form_system
        ON r4b_sp1_idx 
        USING btree (tenant, administrableproductdefinition_dose_form_system);

        CREATE INDEX r4b_sp1_idx_administrableproductdefinition_dose_form_value
        ON r4b_sp1_idx 
        USING btree (tenant, administrableproductdefinition_dose_form_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_actuality_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_actuality_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_adverseevent_actuality_system
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_actuality_system);

        CREATE INDEX r4b_sp1_idx_adverseevent_actuality_value
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_actuality_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_adverseevent_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_date_start);
        
        CREATE INDEX r4b_sp1_idx_adverseevent_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_event_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_event_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_adverseevent_event_system
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_event_system);

        CREATE INDEX r4b_sp1_idx_adverseevent_event_value
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_event_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_seriousness_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_seriousness_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_adverseevent_seriousness_system
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_seriousness_system);

        CREATE INDEX r4b_sp1_idx_adverseevent_seriousness_value
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_seriousness_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_severity_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS adverseevent_severity_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_adverseevent_severity_system
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_severity_system);

        CREATE INDEX r4b_sp1_idx_adverseevent_severity_value
        ON r4b_sp1_idx 
        USING btree (tenant, adverseevent_severity_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_clinical_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_clinical_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_allergyintolerance_clinical_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_clinical_status_system);

        CREATE INDEX r4b_sp1_idx_allergyintolerance_clinical_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_clinical_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_criticality_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_criticality_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_allergyintolerance_criticality_system
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_criticality_system);

        CREATE INDEX r4b_sp1_idx_allergyintolerance_criticality_value
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_criticality_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinical_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinical_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_clinical_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, clinical_date_start);
        
        CREATE INDEX r4b_sp1_idx_clinical_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, clinical_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_last_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_last_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_allergyintolerance_last_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_last_date_start);
        
        CREATE INDEX r4b_sp1_idx_allergyintolerance_last_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_last_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_verification_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS allergyintolerance_verification_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_allergyintolerance_verification_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_verification_status_system);

        CREATE INDEX r4b_sp1_idx_allergyintolerance_verification_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, allergyintolerance_verification_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_appointment_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_appointment_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_appointment_appointment_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_appointment_type_system);

        CREATE INDEX r4b_sp1_idx_appointment_appointment_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_appointment_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_appointment_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_date_start);
        
        CREATE INDEX r4b_sp1_idx_appointment_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointment_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_appointment_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_status_system);

        CREATE INDEX r4b_sp1_idx_appointment_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, appointment_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointmentresponse_part_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS appointmentresponse_part_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_appointmentresponse_part_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, appointmentresponse_part_status_system);

        CREATE INDEX r4b_sp1_idx_appointmentresponse_part_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, appointmentresponse_part_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_action_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_action_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_auditevent_action_system
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_action_system);

        CREATE INDEX r4b_sp1_idx_auditevent_action_value
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_action_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_auditevent_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_date_start);
        
        CREATE INDEX r4b_sp1_idx_auditevent_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_outcome_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_outcome_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_auditevent_outcome_system
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_outcome_system);

        CREATE INDEX r4b_sp1_idx_auditevent_outcome_value
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_outcome_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_site_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_site_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_auditevent_site_system
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_site_system);

        CREATE INDEX r4b_sp1_idx_auditevent_site_value
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_site_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS auditevent_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_auditevent_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_type_system);

        CREATE INDEX r4b_sp1_idx_auditevent_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, auditevent_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS basic_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS basic_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_basic_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, basic_code_system);

        CREATE INDEX r4b_sp1_idx_basic_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, basic_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS basic_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS basic_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_basic_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, basic_created_start);
        
        CREATE INDEX r4b_sp1_idx_basic_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, basic_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_location_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_location_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_bodystructure_location_system
        ON r4b_sp1_idx 
        USING btree (tenant, bodystructure_location_system);

        CREATE INDEX r4b_sp1_idx_bodystructure_location_value
        ON r4b_sp1_idx 
        USING btree (tenant, bodystructure_location_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_morphology_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bodystructure_morphology_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_bodystructure_morphology_system
        ON r4b_sp1_idx 
        USING btree (tenant, bodystructure_morphology_system);

        CREATE INDEX r4b_sp1_idx_bodystructure_morphology_value
        ON r4b_sp1_idx 
        USING btree (tenant, bodystructure_morphology_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_bundle_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_identifier_system);

        CREATE INDEX r4b_sp1_idx_bundle_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_timestamp_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_timestamp_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_bundle_timestamp_start
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_timestamp_start);
        
        CREATE INDEX r4b_sp1_idx_bundle_timestamp_end
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_timestamp_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS bundle_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_bundle_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_type_system);

        CREATE INDEX r4b_sp1_idx_bundle_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, bundle_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_conformance_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_date_start);
        
        CREATE INDEX r4b_sp1_idx_conformance_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_description 
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_fhirversion_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_fhirversion_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_capabilitystatement_fhirversion_system
        ON r4b_sp1_idx 
        USING btree (tenant, capabilitystatement_fhirversion_system);

        CREATE INDEX r4b_sp1_idx_capabilitystatement_fhirversion_value
        ON r4b_sp1_idx 
        USING btree (tenant, capabilitystatement_fhirversion_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_name 
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS capabilitystatement_software TEXT; 
 
        CREATE INDEX r4b_sp1_idx_capabilitystatement_software 
        ON r4b_sp1_idx 
        USING btree (tenant, capabilitystatement_software); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_status_system);

        CREATE INDEX r4b_sp1_idx_conformance_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_title 
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_url 
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS conformance_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_conformance_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_version_system);

        CREATE INDEX r4b_sp1_idx_conformance_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, conformance_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careplan_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careplan_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_careplan_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, careplan_intent_system);

        CREATE INDEX r4b_sp1_idx_careplan_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, careplan_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careplan_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careplan_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_careplan_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, careplan_status_system);

        CREATE INDEX r4b_sp1_idx_careplan_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, careplan_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careteam_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS careteam_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_careteam_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, careteam_status_system);

        CREATE INDEX r4b_sp1_idx_careteam_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, careteam_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_code_system);

        CREATE INDEX r4b_sp1_idx_chargeitem_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_entered_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_entered_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_entered_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_entered_date_start);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_entered_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_entered_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_factor_override NUMERIC; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_factor_override 
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_factor_override); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_occurrence_start
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_occurrence_start);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_occurrence_end
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_occurrence_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_price_override_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_value);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_system);

        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_start_code);

        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_value);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_system);

        CREATE INDEX r4b_sp1_idx_chargeitem_price_override_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_price_override_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitem_quantity_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_value);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_system);

        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_start_code);

        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_value);
        
        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_system);

        CREATE INDEX r4b_sp1_idx_chargeitem_quantity_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitem_quantity_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS chargeitemdefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_version_system);

        CREATE INDEX r4b_sp1_idx_chargeitemdefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, chargeitemdefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_citation_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, citation_date_start);
        
        CREATE INDEX r4b_sp1_idx_citation_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, citation_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_description 
        ON r4b_sp1_idx 
        USING btree (tenant, citation_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_citation_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, citation_effective_start);
        
        CREATE INDEX r4b_sp1_idx_citation_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, citation_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_name 
        ON r4b_sp1_idx 
        USING btree (tenant, citation_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, citation_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, citation_status_system);

        CREATE INDEX r4b_sp1_idx_citation_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, citation_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_title 
        ON r4b_sp1_idx 
        USING btree (tenant, citation_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_url 
        ON r4b_sp1_idx 
        USING btree (tenant, citation_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS citation_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_citation_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, citation_version_system);

        CREATE INDEX r4b_sp1_idx_citation_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, citation_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_claim_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, claim_created_start);
        
        CREATE INDEX r4b_sp1_idx_claim_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, claim_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claim_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, claim_priority_system);

        CREATE INDEX r4b_sp1_idx_claim_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, claim_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claim_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, claim_status_system);

        CREATE INDEX r4b_sp1_idx_claim_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, claim_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_use_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claim_use_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claim_use_system
        ON r4b_sp1_idx 
        USING btree (tenant, claim_use_system);

        CREATE INDEX r4b_sp1_idx_claim_use_value
        ON r4b_sp1_idx 
        USING btree (tenant, claim_use_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_created_start);
        
        CREATE INDEX r4b_sp1_idx_claimresponse_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_disposition TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_disposition 
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_disposition); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_outcome_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_outcome_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_outcome_system
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_outcome_system);

        CREATE INDEX r4b_sp1_idx_claimresponse_outcome_value
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_outcome_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_payment_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_payment_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_payment_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_payment_date_start);
        
        CREATE INDEX r4b_sp1_idx_claimresponse_payment_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_payment_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_status_system);

        CREATE INDEX r4b_sp1_idx_claimresponse_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_use_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS claimresponse_use_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_claimresponse_use_system
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_use_system);

        CREATE INDEX r4b_sp1_idx_claimresponse_use_value
        ON r4b_sp1_idx 
        USING btree (tenant, claimresponse_use_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalimpression_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalimpression_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalimpression_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalimpression_status_system);

        CREATE INDEX r4b_sp1_idx_clinicalimpression_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalimpression_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_contraindication_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_contraindication_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_contraindication_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_contraindication_system);

        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_contraindication_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_contraindication_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_effect_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_effect_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_effect_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_effect_system);

        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_effect_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_effect_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_indication_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_indication_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_indication_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_indication_system);

        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_indication_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_indication_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_interaction_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_interaction_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_interaction_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_interaction_system);

        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_interaction_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_interaction_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS clinicalusedefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_type_system);

        CREATE INDEX r4b_sp1_idx_clinicalusedefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, clinicalusedefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_content_mode_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_content_mode_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_codesystem_content_mode_system
        ON r4b_sp1_idx 
        USING btree (tenant, codesystem_content_mode_system);

        CREATE INDEX r4b_sp1_idx_codesystem_content_mode_value
        ON r4b_sp1_idx 
        USING btree (tenant, codesystem_content_mode_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS codesystem_system TEXT; 
 
        CREATE INDEX r4b_sp1_idx_codesystem_system 
        ON r4b_sp1_idx 
        USING btree (tenant, codesystem_system); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_received_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_received_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_communication_received_start
        ON r4b_sp1_idx 
        USING btree (tenant, communication_received_start);
        
        CREATE INDEX r4b_sp1_idx_communication_received_end
        ON r4b_sp1_idx 
        USING btree (tenant, communication_received_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_sent_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_sent_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_communication_sent_start
        ON r4b_sp1_idx 
        USING btree (tenant, communication_sent_start);
        
        CREATE INDEX r4b_sp1_idx_communication_sent_end
        ON r4b_sp1_idx 
        USING btree (tenant, communication_sent_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communication_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_communication_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, communication_status_system);

        CREATE INDEX r4b_sp1_idx_communication_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, communication_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_communicationrequest_authored_start
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_authored_start);
        
        CREATE INDEX r4b_sp1_idx_communicationrequest_authored_end
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_authored_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_group_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_group_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_communicationrequest_group_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_group_identifier_system);

        CREATE INDEX r4b_sp1_idx_communicationrequest_group_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_group_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_communicationrequest_occurrence_start
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_occurrence_start);
        
        CREATE INDEX r4b_sp1_idx_communicationrequest_occurrence_end
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_occurrence_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_communicationrequest_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_priority_system);

        CREATE INDEX r4b_sp1_idx_communicationrequest_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS communicationrequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_communicationrequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_status_system);

        CREATE INDEX r4b_sp1_idx_communicationrequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, communicationrequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS compartmentdefinition_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS compartmentdefinition_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_compartmentdefinition_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, compartmentdefinition_code_system);

        CREATE INDEX r4b_sp1_idx_compartmentdefinition_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, compartmentdefinition_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS composition_confidentiality_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS composition_confidentiality_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_composition_confidentiality_system
        ON r4b_sp1_idx 
        USING btree (tenant, composition_confidentiality_system);

        CREATE INDEX r4b_sp1_idx_composition_confidentiality_value
        ON r4b_sp1_idx 
        USING btree (tenant, composition_confidentiality_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS composition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS composition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_composition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, composition_status_system);

        CREATE INDEX r4b_sp1_idx_composition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, composition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS composition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_composition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, composition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_age_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_abatement_age_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_value);
        
        CREATE INDEX r4b_sp1_idx_condition_abatement_age_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_system);

        CREATE INDEX r4b_sp1_idx_condition_abatement_age_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_start_code);

        CREATE INDEX r4b_sp1_idx_condition_abatement_age_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_value);
        
        CREATE INDEX r4b_sp1_idx_condition_abatement_age_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_system);

        CREATE INDEX r4b_sp1_idx_condition_abatement_age_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_age_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_condition_abatement_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_date_start);
        
        CREATE INDEX r4b_sp1_idx_condition_abatement_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_abatement_string TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_abatement_string 
        ON r4b_sp1_idx 
        USING btree (tenant, condition_abatement_string); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_clinical_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_clinical_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_clinical_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_clinical_status_system);

        CREATE INDEX r4b_sp1_idx_condition_clinical_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_clinical_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_age_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_onset_age_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_start_value);
        
        CREATE INDEX r4b_sp1_idx_condition_onset_age_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_start_system);

        CREATE INDEX r4b_sp1_idx_condition_onset_age_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_start_code);

        CREATE INDEX r4b_sp1_idx_condition_onset_age_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_end_value);
        
        CREATE INDEX r4b_sp1_idx_condition_onset_age_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_end_system);

        CREATE INDEX r4b_sp1_idx_condition_onset_age_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_age_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_condition_onset_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_date_start);
        
        CREATE INDEX r4b_sp1_idx_condition_onset_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_onset_info TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_onset_info 
        ON r4b_sp1_idx 
        USING btree (tenant, condition_onset_info); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_recorded_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_recorded_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_condition_recorded_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, condition_recorded_date_start);
        
        CREATE INDEX r4b_sp1_idx_condition_recorded_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, condition_recorded_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_severity_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_severity_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_severity_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_severity_system);

        CREATE INDEX r4b_sp1_idx_condition_severity_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_severity_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_verification_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS condition_verification_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_condition_verification_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, condition_verification_status_system);

        CREATE INDEX r4b_sp1_idx_condition_verification_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, condition_verification_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_consent_period_start
        ON r4b_sp1_idx 
        USING btree (tenant, consent_period_start);
        
        CREATE INDEX r4b_sp1_idx_consent_period_end
        ON r4b_sp1_idx 
        USING btree (tenant, consent_period_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_scope_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_scope_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_consent_scope_system
        ON r4b_sp1_idx 
        USING btree (tenant, consent_scope_system);

        CREATE INDEX r4b_sp1_idx_consent_scope_value
        ON r4b_sp1_idx 
        USING btree (tenant, consent_scope_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS consent_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_consent_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, consent_status_system);

        CREATE INDEX r4b_sp1_idx_consent_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, consent_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_instantiates TEXT; 
 
        CREATE INDEX r4b_sp1_idx_contract_instantiates 
        ON r4b_sp1_idx 
        USING btree (tenant, contract_instantiates); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_contract_issued_start
        ON r4b_sp1_idx 
        USING btree (tenant, contract_issued_start);
        
        CREATE INDEX r4b_sp1_idx_contract_issued_end
        ON r4b_sp1_idx 
        USING btree (tenant, contract_issued_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_contract_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, contract_status_system);

        CREATE INDEX r4b_sp1_idx_contract_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, contract_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS contract_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_contract_url 
        ON r4b_sp1_idx 
        USING btree (tenant, contract_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverage_dependent TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverage_dependent 
        ON r4b_sp1_idx 
        USING btree (tenant, coverage_dependent); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverage_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverage_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverage_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, coverage_status_system);

        CREATE INDEX r4b_sp1_idx_coverage_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, coverage_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverage_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverage_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverage_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, coverage_type_system);

        CREATE INDEX r4b_sp1_idx_coverage_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, coverage_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityrequest_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_created_start);
        
        CREATE INDEX r4b_sp1_idx_coverageeligibilityrequest_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityrequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityrequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_status_system);

        CREATE INDEX r4b_sp1_idx_coverageeligibilityrequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityrequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_created_start);
        
        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_disposition TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_disposition 
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_disposition); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_outcome_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_outcome_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_outcome_system
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_outcome_system);

        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_outcome_value
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_outcome_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS coverageeligibilityresponse_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_status_system);

        CREATE INDEX r4b_sp1_idx_coverageeligibilityresponse_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, coverageeligibilityresponse_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_detectedissue_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, detectedissue_code_system);

        CREATE INDEX r4b_sp1_idx_detectedissue_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, detectedissue_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_identified_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS detectedissue_identified_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_detectedissue_identified_start
        ON r4b_sp1_idx 
        USING btree (tenant, detectedissue_identified_start);
        
        CREATE INDEX r4b_sp1_idx_detectedissue_identified_end
        ON r4b_sp1_idx 
        USING btree (tenant, detectedissue_identified_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_manufacturer TEXT; 
 
        CREATE INDEX r4b_sp1_idx_device_manufacturer 
        ON r4b_sp1_idx 
        USING btree (tenant, device_manufacturer); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_model TEXT; 
 
        CREATE INDEX r4b_sp1_idx_device_model 
        ON r4b_sp1_idx 
        USING btree (tenant, device_model); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_device_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, device_status_system);

        CREATE INDEX r4b_sp1_idx_device_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, device_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_device_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, device_type_system);

        CREATE INDEX r4b_sp1_idx_device_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, device_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS device_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_device_url 
        ON r4b_sp1_idx 
        USING btree (tenant, device_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicedefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicedefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicedefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicedefinition_type_system);

        CREATE INDEX r4b_sp1_idx_devicedefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicedefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_category_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_category_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicemetric_category_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicemetric_category_system);

        CREATE INDEX r4b_sp1_idx_devicemetric_category_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicemetric_category_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicemetric_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicemetric_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicemetric_type_system);

        CREATE INDEX r4b_sp1_idx_devicemetric_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicemetric_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_authored_on_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_authored_on_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_devicerequest_authored_on_start
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_authored_on_start);
        
        CREATE INDEX r4b_sp1_idx_devicerequest_authored_on_end
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_authored_on_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_event_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_event_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_devicerequest_event_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_event_date_start);
        
        CREATE INDEX r4b_sp1_idx_devicerequest_event_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_event_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_group_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_group_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicerequest_group_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_group_identifier_system);

        CREATE INDEX r4b_sp1_idx_devicerequest_group_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_group_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicerequest_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_intent_system);

        CREATE INDEX r4b_sp1_idx_devicerequest_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS devicerequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_devicerequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_status_system);

        CREATE INDEX r4b_sp1_idx_devicerequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, devicerequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_diagnosticreport_issued_start
        ON r4b_sp1_idx 
        USING btree (tenant, diagnosticreport_issued_start);
        
        CREATE INDEX r4b_sp1_idx_diagnosticreport_issued_end
        ON r4b_sp1_idx 
        USING btree (tenant, diagnosticreport_issued_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS diagnosticreport_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_diagnosticreport_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, diagnosticreport_status_system);

        CREATE INDEX r4b_sp1_idx_diagnosticreport_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, diagnosticreport_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_documentmanifest_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_created_start);
        
        CREATE INDEX r4b_sp1_idx_documentmanifest_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentmanifest_description 
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_source TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentmanifest_source 
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_source); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentmanifest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentmanifest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_status_system);

        CREATE INDEX r4b_sp1_idx_documentmanifest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, documentmanifest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_date_start);
        
        CREATE INDEX r4b_sp1_idx_documentreference_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_description 
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_facility_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_facility_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_facility_system
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_facility_system);

        CREATE INDEX r4b_sp1_idx_documentreference_facility_value
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_facility_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_period_start
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_period_start);
        
        CREATE INDEX r4b_sp1_idx_documentreference_period_end
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_period_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_setting_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_setting_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_setting_system
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_setting_system);

        CREATE INDEX r4b_sp1_idx_documentreference_setting_value
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_setting_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS documentreference_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_documentreference_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_status_system);

        CREATE INDEX r4b_sp1_idx_documentreference_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, documentreference_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_class_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_class_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_encounter_class_system
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_class_system);

        CREATE INDEX r4b_sp1_idx_encounter_class_value
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_class_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_length_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_encounter_length_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_start_value);
        
        CREATE INDEX r4b_sp1_idx_encounter_length_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_start_system);

        CREATE INDEX r4b_sp1_idx_encounter_length_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_start_code);

        CREATE INDEX r4b_sp1_idx_encounter_length_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_end_value);
        
        CREATE INDEX r4b_sp1_idx_encounter_length_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_end_system);

        CREATE INDEX r4b_sp1_idx_encounter_length_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_length_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS encounter_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_encounter_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_status_system);

        CREATE INDEX r4b_sp1_idx_encounter_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, encounter_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_connection_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_connection_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_endpoint_connection_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, endpoint_connection_type_system);

        CREATE INDEX r4b_sp1_idx_endpoint_connection_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, endpoint_connection_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_endpoint_name 
        ON r4b_sp1_idx 
        USING btree (tenant, endpoint_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS endpoint_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_endpoint_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, endpoint_status_system);

        CREATE INDEX r4b_sp1_idx_endpoint_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, endpoint_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentrequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentrequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_enrollmentrequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, enrollmentrequest_status_system);

        CREATE INDEX r4b_sp1_idx_enrollmentrequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, enrollmentrequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentresponse_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS enrollmentresponse_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_enrollmentresponse_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, enrollmentresponse_status_system);

        CREATE INDEX r4b_sp1_idx_enrollmentresponse_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, enrollmentresponse_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS episodeofcare_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS episodeofcare_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_episodeofcare_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, episodeofcare_status_system);

        CREATE INDEX r4b_sp1_idx_episodeofcare_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, episodeofcare_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_eventdefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_eventdefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_name 
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_eventdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS eventdefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_eventdefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_version_system);

        CREATE INDEX r4b_sp1_idx_eventdefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, eventdefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_evidence_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_date_start);
        
        CREATE INDEX r4b_sp1_idx_evidence_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_description 
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_status_system);

        CREATE INDEX r4b_sp1_idx_evidence_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_title 
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_url 
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidence_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidence_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_version_system);

        CREATE INDEX r4b_sp1_idx_evidence_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, evidence_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencereport_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencereport_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencereport_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencereport_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencereport_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencereport_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, evidencereport_status_system);

        CREATE INDEX r4b_sp1_idx_evidencereport_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, evidencereport_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencereport_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencereport_url 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencereport_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_date_start);
        
        CREATE INDEX r4b_sp1_idx_evidencevariable_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_description 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_name 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_status_system);

        CREATE INDEX r4b_sp1_idx_evidencevariable_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_title 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_url 
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS evidencevariable_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_evidencevariable_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_version_system);

        CREATE INDEX r4b_sp1_idx_evidencevariable_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, evidencevariable_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_date_start);
        
        CREATE INDEX r4b_sp1_idx_examplescenario_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_name 
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_status_system);

        CREATE INDEX r4b_sp1_idx_examplescenario_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_url 
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS examplescenario_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_examplescenario_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_version_system);

        CREATE INDEX r4b_sp1_idx_examplescenario_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, examplescenario_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_explanationofbenefit_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, explanationofbenefit_created_start);
        
        CREATE INDEX r4b_sp1_idx_explanationofbenefit_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, explanationofbenefit_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_disposition TEXT; 
 
        CREATE INDEX r4b_sp1_idx_explanationofbenefit_disposition 
        ON r4b_sp1_idx 
        USING btree (tenant, explanationofbenefit_disposition); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS explanationofbenefit_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_explanationofbenefit_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, explanationofbenefit_status_system);

        CREATE INDEX r4b_sp1_idx_explanationofbenefit_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, explanationofbenefit_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_relationship_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_relationship_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_familymemberhistory_relationship_system
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_relationship_system);

        CREATE INDEX r4b_sp1_idx_familymemberhistory_relationship_value
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_relationship_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_sex_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_sex_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_familymemberhistory_sex_system
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_sex_system);

        CREATE INDEX r4b_sp1_idx_familymemberhistory_sex_value
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_sex_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS familymemberhistory_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_familymemberhistory_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_status_system);

        CREATE INDEX r4b_sp1_idx_familymemberhistory_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, familymemberhistory_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_achievement_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_achievement_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_goal_achievement_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, goal_achievement_status_system);

        CREATE INDEX r4b_sp1_idx_goal_achievement_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, goal_achievement_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_lifecycle_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_lifecycle_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_goal_lifecycle_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, goal_lifecycle_status_system);

        CREATE INDEX r4b_sp1_idx_goal_lifecycle_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, goal_lifecycle_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_start_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS goal_start_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_goal_start_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, goal_start_date_start);
        
        CREATE INDEX r4b_sp1_idx_goal_start_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, goal_start_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS graphdefinition_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS graphdefinition_start_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_graphdefinition_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, graphdefinition_start_system);

        CREATE INDEX r4b_sp1_idx_graphdefinition_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, graphdefinition_start_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_actual_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_actual_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_group_actual_system
        ON r4b_sp1_idx 
        USING btree (tenant, group_actual_system);

        CREATE INDEX r4b_sp1_idx_group_actual_value
        ON r4b_sp1_idx 
        USING btree (tenant, group_actual_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_group_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, group_code_system);

        CREATE INDEX r4b_sp1_idx_group_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, group_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS group_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_group_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, group_type_system);

        CREATE INDEX r4b_sp1_idx_group_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, group_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS guidanceresponse_request_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS guidanceresponse_request_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_guidanceresponse_request_system
        ON r4b_sp1_idx 
        USING btree (tenant, guidanceresponse_request_system);

        CREATE INDEX r4b_sp1_idx_guidanceresponse_request_value
        ON r4b_sp1_idx 
        USING btree (tenant, guidanceresponse_request_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_healthcareservice_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, healthcareservice_active_system);

        CREATE INDEX r4b_sp1_idx_healthcareservice_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, healthcareservice_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS healthcareservice_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_healthcareservice_name 
        ON r4b_sp1_idx 
        USING btree (tenant, healthcareservice_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_started_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_started_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_imagingstudy_started_start
        ON r4b_sp1_idx 
        USING btree (tenant, imagingstudy_started_start);
        
        CREATE INDEX r4b_sp1_idx_imagingstudy_started_end
        ON r4b_sp1_idx 
        USING btree (tenant, imagingstudy_started_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS imagingstudy_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_imagingstudy_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, imagingstudy_status_system);

        CREATE INDEX r4b_sp1_idx_imagingstudy_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, imagingstudy_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_lot_number TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunization_lot_number 
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_lot_number); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunization_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_status_system);

        CREATE INDEX r4b_sp1_idx_immunization_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_reason_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_status_reason_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunization_status_reason_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_status_reason_system);

        CREATE INDEX r4b_sp1_idx_immunization_status_reason_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_status_reason_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_vaccine_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunization_vaccine_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunization_vaccine_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_vaccine_code_system);

        CREATE INDEX r4b_sp1_idx_immunization_vaccine_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunization_vaccine_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_immunizationevaluation_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_date_start);
        
        CREATE INDEX r4b_sp1_idx_immunizationevaluation_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_dose_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_dose_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunizationevaluation_dose_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_dose_status_system);

        CREATE INDEX r4b_sp1_idx_immunizationevaluation_dose_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_dose_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunizationevaluation_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_status_system);

        CREATE INDEX r4b_sp1_idx_immunizationevaluation_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_target_disease_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationevaluation_target_disease_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_immunizationevaluation_target_disease_system
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_target_disease_system);

        CREATE INDEX r4b_sp1_idx_immunizationevaluation_target_disease_value
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationevaluation_target_disease_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationrecommendation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS immunizationrecommendation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_immunizationrecommendation_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationrecommendation_date_start);
        
        CREATE INDEX r4b_sp1_idx_immunizationrecommendation_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, immunizationrecommendation_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS implementationguide_experimental_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS implementationguide_experimental_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_implementationguide_experimental_system
        ON r4b_sp1_idx 
        USING btree (tenant, implementationguide_experimental_system);

        CREATE INDEX r4b_sp1_idx_implementationguide_experimental_value
        ON r4b_sp1_idx 
        USING btree (tenant, implementationguide_experimental_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_ingredient_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_identifier_system);

        CREATE INDEX r4b_sp1_idx_ingredient_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_role_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_role_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_ingredient_role_system
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_role_system);

        CREATE INDEX r4b_sp1_idx_ingredient_role_value
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_role_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_substance_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS ingredient_substance_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_ingredient_substance_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_substance_code_system);

        CREATE INDEX r4b_sp1_idx_ingredient_substance_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, ingredient_substance_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_phonetic TEXT; 
 
        CREATE INDEX r4b_sp1_idx_insuranceplan_phonetic 
        ON r4b_sp1_idx 
        USING btree (tenant, insuranceplan_phonetic); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS insuranceplan_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_insuranceplan_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, insuranceplan_status_system);

        CREATE INDEX r4b_sp1_idx_insuranceplan_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, insuranceplan_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_invoice_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_date_start);
        
        CREATE INDEX r4b_sp1_idx_invoice_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_invoice_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_status_system);

        CREATE INDEX r4b_sp1_idx_invoice_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalgross_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_invoice_totalgross_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_value);
        
        CREATE INDEX r4b_sp1_idx_invoice_totalgross_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_system);

        CREATE INDEX r4b_sp1_idx_invoice_totalgross_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_start_code);

        CREATE INDEX r4b_sp1_idx_invoice_totalgross_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_value);
        
        CREATE INDEX r4b_sp1_idx_invoice_totalgross_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_system);

        CREATE INDEX r4b_sp1_idx_invoice_totalgross_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalgross_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_totalnet_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_invoice_totalnet_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_value);
        
        CREATE INDEX r4b_sp1_idx_invoice_totalnet_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_system);

        CREATE INDEX r4b_sp1_idx_invoice_totalnet_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_start_code);

        CREATE INDEX r4b_sp1_idx_invoice_totalnet_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_value);
        
        CREATE INDEX r4b_sp1_idx_invoice_totalnet_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_system);

        CREATE INDEX r4b_sp1_idx_invoice_totalnet_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_totalnet_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS invoice_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_invoice_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_type_system);

        CREATE INDEX r4b_sp1_idx_invoice_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, invoice_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_library_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, library_date_start);
        
        CREATE INDEX r4b_sp1_idx_library_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, library_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_description 
        ON r4b_sp1_idx 
        USING btree (tenant, library_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_library_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, library_effective_start);
        
        CREATE INDEX r4b_sp1_idx_library_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, library_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_name 
        ON r4b_sp1_idx 
        USING btree (tenant, library_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, library_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, library_status_system);

        CREATE INDEX r4b_sp1_idx_library_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, library_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_title 
        ON r4b_sp1_idx 
        USING btree (tenant, library_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, library_type_system);

        CREATE INDEX r4b_sp1_idx_library_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, library_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_url 
        ON r4b_sp1_idx 
        USING btree (tenant, library_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS library_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_library_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, library_version_system);

        CREATE INDEX r4b_sp1_idx_library_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, library_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS list_empty_reason_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS list_empty_reason_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_list_empty_reason_system
        ON r4b_sp1_idx 
        USING btree (tenant, list_empty_reason_system);

        CREATE INDEX r4b_sp1_idx_list_empty_reason_value
        ON r4b_sp1_idx 
        USING btree (tenant, list_empty_reason_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS list_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS list_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_list_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, list_status_system);

        CREATE INDEX r4b_sp1_idx_list_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, list_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS list_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_list_title 
        ON r4b_sp1_idx 
        USING btree (tenant, list_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address 
        ON r4b_sp1_idx 
        USING btree (tenant, location_address); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_city TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address_city 
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_city); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_country TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address_country 
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_country); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_postalcode TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address_postalcode 
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_postalcode); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_state TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address_state 
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_state); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_use_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_address_use_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_address_use_system
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_use_system);

        CREATE INDEX r4b_sp1_idx_location_address_use_value
        ON r4b_sp1_idx 
        USING btree (tenant, location_address_use_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_operational_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_operational_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_operational_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, location_operational_status_system);

        CREATE INDEX r4b_sp1_idx_location_operational_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, location_operational_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS location_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_location_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, location_status_system);

        CREATE INDEX r4b_sp1_idx_location_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, location_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS manufactureditemdefinition_dose_form_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS manufactureditemdefinition_dose_form_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_manufactureditemdefinition_dose_form_system
        ON r4b_sp1_idx 
        USING btree (tenant, manufactureditemdefinition_dose_form_system);

        CREATE INDEX r4b_sp1_idx_manufactureditemdefinition_dose_form_value
        ON r4b_sp1_idx 
        USING btree (tenant, manufactureditemdefinition_dose_form_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_measure_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, measure_date_start);
        
        CREATE INDEX r4b_sp1_idx_measure_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, measure_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_description 
        ON r4b_sp1_idx 
        USING btree (tenant, measure_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_measure_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, measure_effective_start);
        
        CREATE INDEX r4b_sp1_idx_measure_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, measure_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_name 
        ON r4b_sp1_idx 
        USING btree (tenant, measure_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, measure_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, measure_status_system);

        CREATE INDEX r4b_sp1_idx_measure_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, measure_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_title 
        ON r4b_sp1_idx 
        USING btree (tenant, measure_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_url 
        ON r4b_sp1_idx 
        USING btree (tenant, measure_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measure_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measure_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, measure_version_system);

        CREATE INDEX r4b_sp1_idx_measure_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, measure_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_measurereport_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_date_start);
        
        CREATE INDEX r4b_sp1_idx_measurereport_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_measurereport_period_start
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_period_start);
        
        CREATE INDEX r4b_sp1_idx_measurereport_period_end
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_period_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS measurereport_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_measurereport_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_status_system);

        CREATE INDEX r4b_sp1_idx_measurereport_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, measurereport_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_media_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, media_created_start);
        
        CREATE INDEX r4b_sp1_idx_media_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, media_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_modality_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_modality_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_media_modality_system
        ON r4b_sp1_idx 
        USING btree (tenant, media_modality_system);

        CREATE INDEX r4b_sp1_idx_media_modality_value
        ON r4b_sp1_idx 
        USING btree (tenant, media_modality_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_site_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_site_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_media_site_system
        ON r4b_sp1_idx 
        USING btree (tenant, media_site_system);

        CREATE INDEX r4b_sp1_idx_media_site_value
        ON r4b_sp1_idx 
        USING btree (tenant, media_site_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_media_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, media_status_system);

        CREATE INDEX r4b_sp1_idx_media_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, media_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_media_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, media_type_system);

        CREATE INDEX r4b_sp1_idx_media_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, media_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_view_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS media_view_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_media_view_system
        ON r4b_sp1_idx 
        USING btree (tenant, media_view_system);

        CREATE INDEX r4b_sp1_idx_media_view_value
        ON r4b_sp1_idx 
        USING btree (tenant, media_view_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_expiration_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_expiration_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medication_expiration_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, medication_expiration_date_start);
        
        CREATE INDEX r4b_sp1_idx_medication_expiration_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, medication_expiration_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_form_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_form_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medication_form_system
        ON r4b_sp1_idx 
        USING btree (tenant, medication_form_system);

        CREATE INDEX r4b_sp1_idx_medication_form_value
        ON r4b_sp1_idx 
        USING btree (tenant, medication_form_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_lot_number_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_lot_number_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medication_lot_number_system
        ON r4b_sp1_idx 
        USING btree (tenant, medication_lot_number_system);

        CREATE INDEX r4b_sp1_idx_medication_lot_number_value
        ON r4b_sp1_idx 
        USING btree (tenant, medication_lot_number_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medication_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medication_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, medication_status_system);

        CREATE INDEX r4b_sp1_idx_medication_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, medication_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationadministration_effective_time_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationadministration_effective_time_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medicationadministration_effective_time_start
        ON r4b_sp1_idx 
        USING btree (tenant, medicationadministration_effective_time_start);
        
        CREATE INDEX r4b_sp1_idx_medicationadministration_effective_time_end
        ON r4b_sp1_idx 
        USING btree (tenant, medicationadministration_effective_time_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medications_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medications_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medications_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, medications_status_system);

        CREATE INDEX r4b_sp1_idx_medications_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, medications_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationdispense_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_type_system);

        CREATE INDEX r4b_sp1_idx_medicationdispense_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenhandedover_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenhandedover_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medicationdispense_whenhandedover_start
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_whenhandedover_start);
        
        CREATE INDEX r4b_sp1_idx_medicationdispense_whenhandedover_end
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_whenhandedover_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenprepared_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationdispense_whenprepared_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medicationdispense_whenprepared_start
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_whenprepared_start);
        
        CREATE INDEX r4b_sp1_idx_medicationdispense_whenprepared_end
        ON r4b_sp1_idx 
        USING btree (tenant, medicationdispense_whenprepared_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationknowledge_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_code_system);

        CREATE INDEX r4b_sp1_idx_medicationknowledge_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_doseform_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_doseform_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationknowledge_doseform_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_doseform_system);

        CREATE INDEX r4b_sp1_idx_medicationknowledge_doseform_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_doseform_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationknowledge_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationknowledge_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_status_system);

        CREATE INDEX r4b_sp1_idx_medicationknowledge_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationknowledge_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_authoredon_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_authoredon_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medicationrequest_authoredon_start
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_authoredon_start);
        
        CREATE INDEX r4b_sp1_idx_medicationrequest_authoredon_end
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_authoredon_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intended_performertype_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intended_performertype_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationrequest_intended_performertype_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_intended_performertype_system);

        CREATE INDEX r4b_sp1_idx_medicationrequest_intended_performertype_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_intended_performertype_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationrequest_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_intent_system);

        CREATE INDEX r4b_sp1_idx_medicationrequest_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationrequest_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationrequest_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_priority_system);

        CREATE INDEX r4b_sp1_idx_medicationrequest_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationrequest_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_category_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_category_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicationstatement_category_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicationstatement_category_system);

        CREATE INDEX r4b_sp1_idx_medicationstatement_category_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicationstatement_category_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicationstatement_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_medicationstatement_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, medicationstatement_effective_start);
        
        CREATE INDEX r4b_sp1_idx_medicationstatement_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, medicationstatement_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_domain_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_domain_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_domain_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_domain_system);

        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_domain_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_domain_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS medicinalproductdefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_type_system);

        CREATE INDEX r4b_sp1_idx_medicinalproductdefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, medicinalproductdefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_category_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_category_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messagedefinition_category_system
        ON r4b_sp1_idx 
        USING btree (tenant, messagedefinition_category_system);

        CREATE INDEX r4b_sp1_idx_messagedefinition_category_value
        ON r4b_sp1_idx 
        USING btree (tenant, messagedefinition_category_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_event_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messagedefinition_event_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messagedefinition_event_system
        ON r4b_sp1_idx 
        USING btree (tenant, messagedefinition_event_system);

        CREATE INDEX r4b_sp1_idx_messagedefinition_event_value
        ON r4b_sp1_idx 
        USING btree (tenant, messagedefinition_event_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messageheader_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_code_system);

        CREATE INDEX r4b_sp1_idx_messageheader_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_event_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_event_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messageheader_event_system
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_event_system);

        CREATE INDEX r4b_sp1_idx_messageheader_event_value
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_event_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_response_id_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_response_id_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messageheader_response_id_system
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_response_id_system);

        CREATE INDEX r4b_sp1_idx_messageheader_response_id_value
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_response_id_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_source TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messageheader_source 
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_source); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS messageheader_source_uri TEXT; 
 
        CREATE INDEX r4b_sp1_idx_messageheader_source_uri 
        ON r4b_sp1_idx 
        USING btree (tenant, messageheader_source_uri); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_chromosome_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_chromosome_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_molecularsequence_chromosome_system
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_chromosome_system);

        CREATE INDEX r4b_sp1_idx_molecularsequence_chromosome_value
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_chromosome_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_referenceseqid_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_referenceseqid_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_molecularsequence_referenceseqid_system
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_referenceseqid_system);

        CREATE INDEX r4b_sp1_idx_molecularsequence_referenceseqid_value
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_referenceseqid_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_molecularsequence_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_type_system);

        CREATE INDEX r4b_sp1_idx_molecularsequence_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_window_end NUMERIC; 
 
        CREATE INDEX r4b_sp1_idx_molecularsequence_window_end 
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_window_end); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS molecularsequence_window_start NUMERIC; 
 
        CREATE INDEX r4b_sp1_idx_molecularsequence_window_start 
        ON r4b_sp1_idx 
        USING btree (tenant, molecularsequence_window_start); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_kind_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_kind_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_namingsystem_kind_system
        ON r4b_sp1_idx 
        USING btree (tenant, namingsystem_kind_system);

        CREATE INDEX r4b_sp1_idx_namingsystem_kind_value
        ON r4b_sp1_idx 
        USING btree (tenant, namingsystem_kind_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_responsible TEXT; 
 
        CREATE INDEX r4b_sp1_idx_namingsystem_responsible 
        ON r4b_sp1_idx 
        USING btree (tenant, namingsystem_responsible); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS namingsystem_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_namingsystem_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, namingsystem_type_system);

        CREATE INDEX r4b_sp1_idx_namingsystem_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, namingsystem_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_additive_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_additive_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_nutritionorder_additive_system
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_additive_system);

        CREATE INDEX r4b_sp1_idx_nutritionorder_additive_value
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_additive_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_datetime_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_datetime_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_nutritionorder_datetime_start
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_datetime_start);
        
        CREATE INDEX r4b_sp1_idx_nutritionorder_datetime_end
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_datetime_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_formula_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_formula_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_nutritionorder_formula_system
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_formula_system);

        CREATE INDEX r4b_sp1_idx_nutritionorder_formula_value
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_formula_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionorder_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_nutritionorder_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_status_system);

        CREATE INDEX r4b_sp1_idx_nutritionorder_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionorder_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionproduct_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS nutritionproduct_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_nutritionproduct_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionproduct_status_system);

        CREATE INDEX r4b_sp1_idx_nutritionproduct_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, nutritionproduct_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_data_absent_reason_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_data_absent_reason_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_data_absent_reason_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_data_absent_reason_system);

        CREATE INDEX r4b_sp1_idx_observation_data_absent_reason_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_data_absent_reason_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_method_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_method_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_method_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_method_system);

        CREATE INDEX r4b_sp1_idx_observation_method_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_method_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_status_system);

        CREATE INDEX r4b_sp1_idx_observation_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_concept_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_concept_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_value_concept_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_concept_system);

        CREATE INDEX r4b_sp1_idx_observation_value_concept_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_concept_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_observation_value_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_date_start);
        
        CREATE INDEX r4b_sp1_idx_observation_value_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_start_code TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_value NUMERIC; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_quantity_end_code TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_value_quantity_start_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_value);
        
        CREATE INDEX r4b_sp1_idx_observation_value_quantity_start_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_system);

        CREATE INDEX r4b_sp1_idx_observation_value_quantity_start_code
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_start_code);

        CREATE INDEX r4b_sp1_idx_observation_value_quantity_end_value
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_value);
        
        CREATE INDEX r4b_sp1_idx_observation_value_quantity_end_system
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_system);

        CREATE INDEX r4b_sp1_idx_observation_value_quantity_end_code
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_quantity_end_code);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS observation_value_string TEXT; 
 
        CREATE INDEX r4b_sp1_idx_observation_value_string 
        ON r4b_sp1_idx 
        USING btree (tenant, observation_value_string); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_operationdefinition_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_code_system);

        CREATE INDEX r4b_sp1_idx_operationdefinition_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_instance_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_instance_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_operationdefinition_instance_system
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_instance_system);

        CREATE INDEX r4b_sp1_idx_operationdefinition_instance_value
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_instance_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_kind_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_kind_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_operationdefinition_kind_system
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_kind_system);

        CREATE INDEX r4b_sp1_idx_operationdefinition_kind_value
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_kind_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_system_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_system_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_operationdefinition_system_system
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_system_system);

        CREATE INDEX r4b_sp1_idx_operationdefinition_system_value
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_system_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS operationdefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_operationdefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_type_system);

        CREATE INDEX r4b_sp1_idx_operationdefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, operationdefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organization_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organization_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_organization_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, organization_active_system);

        CREATE INDEX r4b_sp1_idx_organization_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, organization_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organization_phonetic TEXT; 
 
        CREATE INDEX r4b_sp1_idx_organization_phonetic 
        ON r4b_sp1_idx 
        USING btree (tenant, organization_phonetic); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_organizationaffiliation_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, organizationaffiliation_active_system);

        CREATE INDEX r4b_sp1_idx_organizationaffiliation_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, organizationaffiliation_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS organizationaffiliation_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_organizationaffiliation_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, organizationaffiliation_date_start);
        
        CREATE INDEX r4b_sp1_idx_organizationaffiliation_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, organizationaffiliation_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS packagedproductdefinition_name_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS packagedproductdefinition_name_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_packagedproductdefinition_name_system
        ON r4b_sp1_idx 
        USING btree (tenant, packagedproductdefinition_name_system);

        CREATE INDEX r4b_sp1_idx_packagedproductdefinition_name_value
        ON r4b_sp1_idx 
        USING btree (tenant, packagedproductdefinition_name_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS packagedproductdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS packagedproductdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_packagedproductdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, packagedproductdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_packagedproductdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, packagedproductdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS patient_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS patient_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_patient_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, patient_active_system);

        CREATE INDEX r4b_sp1_idx_patient_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, patient_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS individual_birthdate_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS individual_birthdate_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_individual_birthdate_start
        ON r4b_sp1_idx 
        USING btree (tenant, individual_birthdate_start);
        
        CREATE INDEX r4b_sp1_idx_individual_birthdate_end
        ON r4b_sp1_idx 
        USING btree (tenant, individual_birthdate_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS patient_death_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS patient_death_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_patient_death_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, patient_death_date_start);
        
        CREATE INDEX r4b_sp1_idx_patient_death_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, patient_death_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS individual_gender_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS individual_gender_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_individual_gender_system
        ON r4b_sp1_idx 
        USING btree (tenant, individual_gender_system);

        CREATE INDEX r4b_sp1_idx_individual_gender_value
        ON r4b_sp1_idx 
        USING btree (tenant, individual_gender_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_paymentnotice_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_created_start);
        
        CREATE INDEX r4b_sp1_idx_paymentnotice_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_payment_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_payment_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_paymentnotice_payment_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_payment_status_system);

        CREATE INDEX r4b_sp1_idx_paymentnotice_payment_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_payment_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentnotice_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_paymentnotice_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_status_system);

        CREATE INDEX r4b_sp1_idx_paymentnotice_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, paymentnotice_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_created_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_created_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_paymentreconciliation_created_start
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_created_start);
        
        CREATE INDEX r4b_sp1_idx_paymentreconciliation_created_end
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_created_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_disposition TEXT; 
 
        CREATE INDEX r4b_sp1_idx_paymentreconciliation_disposition 
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_disposition); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_outcome_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_outcome_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_paymentreconciliation_outcome_system
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_outcome_system);

        CREATE INDEX r4b_sp1_idx_paymentreconciliation_outcome_value
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_outcome_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS paymentreconciliation_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_paymentreconciliation_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_status_system);

        CREATE INDEX r4b_sp1_idx_paymentreconciliation_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, paymentreconciliation_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_plandefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_plandefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_name 
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_status_system);

        CREATE INDEX r4b_sp1_idx_plandefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_type_system);

        CREATE INDEX r4b_sp1_idx_plandefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS plandefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_plandefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_version_system);

        CREATE INDEX r4b_sp1_idx_plandefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, plandefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitioner_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitioner_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_practitioner_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, practitioner_active_system);

        CREATE INDEX r4b_sp1_idx_practitioner_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, practitioner_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_practitionerrole_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, practitionerrole_active_system);

        CREATE INDEX r4b_sp1_idx_practitionerrole_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, practitionerrole_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS practitionerrole_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_practitionerrole_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, practitionerrole_date_start);
        
        CREATE INDEX r4b_sp1_idx_practitionerrole_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, practitionerrole_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS procedure_category_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS procedure_category_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_procedure_category_system
        ON r4b_sp1_idx 
        USING btree (tenant, procedure_category_system);

        CREATE INDEX r4b_sp1_idx_procedure_category_value
        ON r4b_sp1_idx 
        USING btree (tenant, procedure_category_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS procedure_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS procedure_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_procedure_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, procedure_status_system);

        CREATE INDEX r4b_sp1_idx_procedure_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, procedure_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS provenance_recorded_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS provenance_recorded_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_provenance_recorded_start
        ON r4b_sp1_idx 
        USING btree (tenant, provenance_recorded_start);
        
        CREATE INDEX r4b_sp1_idx_provenance_recorded_end
        ON r4b_sp1_idx 
        USING btree (tenant, provenance_recorded_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS provenance_when_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS provenance_when_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_provenance_when_start
        ON r4b_sp1_idx 
        USING btree (tenant, provenance_when_start);
        
        CREATE INDEX r4b_sp1_idx_provenance_when_end
        ON r4b_sp1_idx 
        USING btree (tenant, provenance_when_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_date_start);
        
        CREATE INDEX r4b_sp1_idx_questionnaire_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_description 
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_effective_start);
        
        CREATE INDEX r4b_sp1_idx_questionnaire_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_name 
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_status_system);

        CREATE INDEX r4b_sp1_idx_questionnaire_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_title 
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_url 
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaire_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaire_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_version_system);

        CREATE INDEX r4b_sp1_idx_questionnaire_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaire_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_questionnaireresponse_authored_start
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_authored_start);
        
        CREATE INDEX r4b_sp1_idx_questionnaireresponse_authored_end
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_authored_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaireresponse_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_identifier_system);

        CREATE INDEX r4b_sp1_idx_questionnaireresponse_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS questionnaireresponse_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_questionnaireresponse_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_status_system);

        CREATE INDEX r4b_sp1_idx_questionnaireresponse_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, questionnaireresponse_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_case_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_case_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_regulatedauthorization_case_system
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_case_system);

        CREATE INDEX r4b_sp1_idx_regulatedauthorization_case_value
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_case_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_case_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_case_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_regulatedauthorization_case_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_case_type_system);

        CREATE INDEX r4b_sp1_idx_regulatedauthorization_case_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_case_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS regulatedauthorization_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_regulatedauthorization_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_status_system);

        CREATE INDEX r4b_sp1_idx_regulatedauthorization_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, regulatedauthorization_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS relatedperson_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS relatedperson_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_relatedperson_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, relatedperson_active_system);

        CREATE INDEX r4b_sp1_idx_relatedperson_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, relatedperson_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_authored_start
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_authored_start);
        
        CREATE INDEX r4b_sp1_idx_requestgroup_authored_end
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_authored_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_code_system);

        CREATE INDEX r4b_sp1_idx_requestgroup_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_group_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_group_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_group_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_group_identifier_system);

        CREATE INDEX r4b_sp1_idx_requestgroup_group_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_group_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_intent_system);

        CREATE INDEX r4b_sp1_idx_requestgroup_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_priority_system);

        CREATE INDEX r4b_sp1_idx_requestgroup_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS requestgroup_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_requestgroup_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_status_system);

        CREATE INDEX r4b_sp1_idx_requestgroup_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, requestgroup_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_researchdefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_researchdefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_name 
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_researchdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchdefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchdefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_version_system);

        CREATE INDEX r4b_sp1_idx_researchdefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchdefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_date_start);
        
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_description 
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_effective_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_effective_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_effective_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_effective_start);
        
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_effective_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_effective_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_name 
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_status_system);

        CREATE INDEX r4b_sp1_idx_researchelementdefinition_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_title 
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_url 
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchelementdefinition_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchelementdefinition_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_version_system);

        CREATE INDEX r4b_sp1_idx_researchelementdefinition_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchelementdefinition_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchstudy_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchstudy_date_start);
        
        CREATE INDEX r4b_sp1_idx_researchstudy_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchstudy_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchstudy_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchstudy_status_system);

        CREATE INDEX r4b_sp1_idx_researchstudy_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchstudy_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchstudy_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchstudy_title 
        ON r4b_sp1_idx 
        USING btree (tenant, researchstudy_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_researchsubject_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, researchsubject_date_start);
        
        CREATE INDEX r4b_sp1_idx_researchsubject_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, researchsubject_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS researchsubject_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_researchsubject_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, researchsubject_status_system);

        CREATE INDEX r4b_sp1_idx_researchsubject_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, researchsubject_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS riskassessment_method_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS riskassessment_method_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_riskassessment_method_system
        ON r4b_sp1_idx 
        USING btree (tenant, riskassessment_method_system);

        CREATE INDEX r4b_sp1_idx_riskassessment_method_value
        ON r4b_sp1_idx 
        USING btree (tenant, riskassessment_method_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS schedule_active_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS schedule_active_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_schedule_active_system
        ON r4b_sp1_idx 
        USING btree (tenant, schedule_active_system);

        CREATE INDEX r4b_sp1_idx_schedule_active_value
        ON r4b_sp1_idx 
        USING btree (tenant, schedule_active_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS schedule_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS schedule_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_schedule_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, schedule_date_start);
        
        CREATE INDEX r4b_sp1_idx_schedule_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, schedule_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_searchparameter_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, searchparameter_code_system);

        CREATE INDEX r4b_sp1_idx_searchparameter_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, searchparameter_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS searchparameter_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_searchparameter_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, searchparameter_type_system);

        CREATE INDEX r4b_sp1_idx_searchparameter_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, searchparameter_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_authored_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_authored_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_authored_start
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_authored_start);
        
        CREATE INDEX r4b_sp1_idx_servicerequest_authored_end
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_authored_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_intent_system);

        CREATE INDEX r4b_sp1_idx_servicerequest_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_occurrence_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_occurrence_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_occurrence_start
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_occurrence_start);
        
        CREATE INDEX r4b_sp1_idx_servicerequest_occurrence_end
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_occurrence_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_performer_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_performer_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_performer_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_performer_type_system);

        CREATE INDEX r4b_sp1_idx_servicerequest_performer_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_performer_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_priority_system);

        CREATE INDEX r4b_sp1_idx_servicerequest_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_requisition_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_requisition_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_requisition_system
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_requisition_system);

        CREATE INDEX r4b_sp1_idx_servicerequest_requisition_value
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_requisition_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS servicerequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_servicerequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_status_system);

        CREATE INDEX r4b_sp1_idx_servicerequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, servicerequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_appointment_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_appointment_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_slot_appointment_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, slot_appointment_type_system);

        CREATE INDEX r4b_sp1_idx_slot_appointment_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, slot_appointment_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_start_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_start_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_slot_start_start
        ON r4b_sp1_idx 
        USING btree (tenant, slot_start_start);
        
        CREATE INDEX r4b_sp1_idx_slot_start_end
        ON r4b_sp1_idx 
        USING btree (tenant, slot_start_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS slot_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_slot_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, slot_status_system);

        CREATE INDEX r4b_sp1_idx_slot_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, slot_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_accession_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_accession_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimen_accession_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_accession_system);

        CREATE INDEX r4b_sp1_idx_specimen_accession_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_accession_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_bodysite_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_bodysite_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimen_bodysite_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_bodysite_system);

        CREATE INDEX r4b_sp1_idx_specimen_bodysite_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_bodysite_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_collected_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_collected_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_specimen_collected_start
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_collected_start);
        
        CREATE INDEX r4b_sp1_idx_specimen_collected_end
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_collected_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimen_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_status_system);

        CREATE INDEX r4b_sp1_idx_specimen_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimen_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimen_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_type_system);

        CREATE INDEX r4b_sp1_idx_specimen_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimen_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimendefinition_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimendefinition_identifier_system);

        CREATE INDEX r4b_sp1_idx_specimendefinition_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimendefinition_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS specimendefinition_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_specimendefinition_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, specimendefinition_type_system);

        CREATE INDEX r4b_sp1_idx_specimendefinition_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, specimendefinition_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_abstract_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_abstract_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_structuredefinition_abstract_system
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_abstract_system);

        CREATE INDEX r4b_sp1_idx_structuredefinition_abstract_value
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_abstract_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_derivation_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_derivation_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_structuredefinition_derivation_system
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_derivation_system);

        CREATE INDEX r4b_sp1_idx_structuredefinition_derivation_value
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_derivation_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_experimental_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_experimental_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_structuredefinition_experimental_system
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_experimental_system);

        CREATE INDEX r4b_sp1_idx_structuredefinition_experimental_value
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_experimental_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_kind_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_kind_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_structuredefinition_kind_system
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_kind_system);

        CREATE INDEX r4b_sp1_idx_structuredefinition_kind_value
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_kind_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS structuredefinition_type TEXT; 
 
        CREATE INDEX r4b_sp1_idx_structuredefinition_type 
        ON r4b_sp1_idx 
        USING btree (tenant, structuredefinition_type); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_criteria TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscription_criteria 
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_criteria); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_payload_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_payload_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscription_payload_system
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_payload_system);

        CREATE INDEX r4b_sp1_idx_subscription_payload_value
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_payload_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscription_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_status_system);

        CREATE INDEX r4b_sp1_idx_subscription_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_type_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_type_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscription_type_system
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_type_system);

        CREATE INDEX r4b_sp1_idx_subscription_type_value
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_type_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscription_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscription_url 
        ON r4b_sp1_idx 
        USING btree (tenant, subscription_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_date_start);
        
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_status_system);

        CREATE INDEX r4b_sp1_idx_subscriptiontopic_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_title 
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_url 
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS subscriptiontopic_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_subscriptiontopic_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_version_system);

        CREATE INDEX r4b_sp1_idx_subscriptiontopic_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, subscriptiontopic_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS substance_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS substance_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_substance_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, substance_status_system);

        CREATE INDEX r4b_sp1_idx_substance_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, substance_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS substancedefinition_domain_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS substancedefinition_domain_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_substancedefinition_domain_system
        ON r4b_sp1_idx 
        USING btree (tenant, substancedefinition_domain_system);

        CREATE INDEX r4b_sp1_idx_substancedefinition_domain_value
        ON r4b_sp1_idx 
        USING btree (tenant, substancedefinition_domain_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplydelivery_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplydelivery_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_supplydelivery_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, supplydelivery_status_system);

        CREATE INDEX r4b_sp1_idx_supplydelivery_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, supplydelivery_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_category_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_category_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_supplyrequest_category_system
        ON r4b_sp1_idx 
        USING btree (tenant, supplyrequest_category_system);

        CREATE INDEX r4b_sp1_idx_supplyrequest_category_value
        ON r4b_sp1_idx 
        USING btree (tenant, supplyrequest_category_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS supplyrequest_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_supplyrequest_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, supplyrequest_status_system);

        CREATE INDEX r4b_sp1_idx_supplyrequest_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, supplyrequest_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_authored_on_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_authored_on_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_task_authored_on_start
        ON r4b_sp1_idx 
        USING btree (tenant, task_authored_on_start);
        
        CREATE INDEX r4b_sp1_idx_task_authored_on_end
        ON r4b_sp1_idx 
        USING btree (tenant, task_authored_on_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_business_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_business_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_business_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_business_status_system);

        CREATE INDEX r4b_sp1_idx_task_business_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_business_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_code_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_code_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_code_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_code_system);

        CREATE INDEX r4b_sp1_idx_task_code_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_code_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_group_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_group_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_group_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_group_identifier_system);

        CREATE INDEX r4b_sp1_idx_task_group_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_group_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_intent_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_intent_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_intent_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_intent_system);

        CREATE INDEX r4b_sp1_idx_task_intent_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_intent_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_modified_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_modified_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_task_modified_start
        ON r4b_sp1_idx 
        USING btree (tenant, task_modified_start);
        
        CREATE INDEX r4b_sp1_idx_task_modified_end
        ON r4b_sp1_idx 
        USING btree (tenant, task_modified_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_period_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_period_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_task_period_start
        ON r4b_sp1_idx 
        USING btree (tenant, task_period_start);
        
        CREATE INDEX r4b_sp1_idx_task_period_end
        ON r4b_sp1_idx 
        USING btree (tenant, task_period_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_priority_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_priority_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_priority_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_priority_system);

        CREATE INDEX r4b_sp1_idx_task_priority_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_priority_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS task_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_task_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, task_status_system);

        CREATE INDEX r4b_sp1_idx_task_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, task_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testreport_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_identifier_system);

        CREATE INDEX r4b_sp1_idx_testreport_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_issued_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_issued_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_testreport_issued_start
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_issued_start);
        
        CREATE INDEX r4b_sp1_idx_testreport_issued_end
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_issued_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_result_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_result_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testreport_result_system
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_result_system);

        CREATE INDEX r4b_sp1_idx_testreport_result_value
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_result_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testreport_tester TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testreport_tester 
        ON r4b_sp1_idx 
        USING btree (tenant, testreport_tester); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_date_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_date_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_testscript_date_start
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_date_start);
        
        CREATE INDEX r4b_sp1_idx_testscript_date_end
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_date_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_description TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_description 
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_description); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_identifier_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_identifier_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_identifier_system
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_identifier_system);

        CREATE INDEX r4b_sp1_idx_testscript_identifier_value
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_identifier_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_name TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_name 
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_name); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_publisher TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_publisher 
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_publisher); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_status_system);

        CREATE INDEX r4b_sp1_idx_testscript_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_status_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_title TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_title 
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_title); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_url TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_url 
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_url); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_version_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS testscript_version_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_testscript_version_system
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_version_system);

        CREATE INDEX r4b_sp1_idx_testscript_version_value
        ON r4b_sp1_idx 
        USING btree (tenant, testscript_version_value);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS valueset_expansion TEXT; 
 
        CREATE INDEX r4b_sp1_idx_valueset_expansion 
        ON r4b_sp1_idx 
        USING btree (tenant, valueset_expansion); 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_datewritten_start TIMESTAMP WITH TIME ZONE; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_datewritten_end TIMESTAMP WITH TIME ZONE; 
 
        CREATE INDEX r4b_sp1_idx_visionprescription_datewritten_start
        ON r4b_sp1_idx 
        USING btree (tenant, visionprescription_datewritten_start);
        
        CREATE INDEX r4b_sp1_idx_visionprescription_datewritten_end
        ON r4b_sp1_idx 
        USING btree (tenant, visionprescription_datewritten_end);
         
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_status_system TEXT; 
 ALTER TABLE r4b_sp1_idx ADD COLUMN IF NOT EXISTS visionprescription_status_value TEXT; 
 
        CREATE INDEX r4b_sp1_idx_visionprescription_status_system
        ON r4b_sp1_idx 
        USING btree (tenant, visionprescription_status_system);

        CREATE INDEX r4b_sp1_idx_visionprescription_status_value
        ON r4b_sp1_idx 
        USING btree (tenant, visionprescription_status_value);
        