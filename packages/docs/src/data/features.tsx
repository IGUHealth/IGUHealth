/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Translate, { translate } from "@docusaurus/Translate";
import React from "react";

export type FeatureItem = {
  title: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
  text: JSX.Element;
};

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      message: "FHIR Native",
    }),
    image: {
      src: "/img/campfire.svg",
      width: 1009.54,
      height: 717.96,
    },
    text: (
      <Translate>
        Build on top of the FHIR standard. Create your own platform that allows
        you to manage, store, and exchange healthcare data in a secure,
        scalable, and compliant way. We support FHIR R4 and R4B resources.
      </Translate>
    ),
  },
  {
    title: translate({
      message: "OpenID Connect",
    }),
    image: {
      src: "/img/oidc.svg",
      width: 1108,
      height: 731.18,
    },
    text: (
      <Translate>
        IGUHealth supports OpenID Connect (OIDC) for authentication and
        authorization. OIDC is an identity layer on top of OAuth 2.0, an open
        standard for access delegation.
      </Translate>
    ),
  },
  {
    title: translate({
      message: "Extend with Custom Code",
    }),
    image: {
      src: "/img/code.svg",
      width: 1038.23,
      height: 693.31,
    },
    text: (
      <Translate>
        Extend IGUHealth with your custom code. We support this via
        OperationDefinition resources. You can create custom operations and
        subscriptions to meet your specific needs.
      </Translate>
    ),
  },
  {
    title: translate({
      message: "Terminology",
    }),
    image: {
      src: "/img/terminology.svg",
      width: 1137.97,
      height: 736.21,
    },
    text: (
      <Translate>
        We support several Hl7 terminology operations, including expand, lookup,
        and validate-code. We currently support Hl7 value sets and will be
        supporting SNOMED and ICD-10 in the near future.
      </Translate>
    ),
  },
  {
    title: translate({
      message: "Frontend Tools",
    }),
    image: {
      src: "/img/frontend-tools.svg",
      width: 1137.97,
      height: 736.21,
    },
    text: (
      <Translate>
        We provide several tools to help you build applications. These include
        our component library, CLI, fhirpath, code generation libraries, and
        more.
      </Translate>
    ),
  },
];

export default FEATURES;
