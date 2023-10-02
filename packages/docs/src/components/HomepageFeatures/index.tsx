import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Built On Top Of Open Healthcare Standards",
    description: (
      <>
        Are Server is built around the open healthcare standard FHIR. FHIR is
        used by many healthcare organizations around the world and is supported
        by many vendors including the most prominent Electronic Health Record
        systems (Cerner, Epic etc.).
      </>
    ),
  },
  {
    title: "Open Source",

    description: (
      <>
        Code is available{" "}
        <a href="https://github.com/IGUHealth/IGUHealth">here</a>. Visit our
        repo to submit issues and add features.
      </>
    ),
  },
  {
    title: "Extend with custom code with OperationDefinitions",
    description: (
      <>
        Easily extend our FHIR server with custom code (by default javascript)
        using OperationDefinitions. This allows you to add custom functionality
        to your FHIR server without having to fork the codebase.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
