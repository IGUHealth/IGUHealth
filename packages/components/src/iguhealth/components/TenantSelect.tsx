import React from "react";

import { TenantClaim } from "@iguhealth/jwt";

import { Container } from "./Container";

export interface TenantSelectProps {
  title?: string;
  logo?: string;
  tenants: TenantClaim<string>[];
}

export const TenantSelect = ({ tenants, title, logo }: TenantSelectProps) => {
  return (
    <Container logo={logo} title={title}>
      Testing
    </Container>
  );
};
