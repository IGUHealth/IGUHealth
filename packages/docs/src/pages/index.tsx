import Link from "@docusaurus/Link";
import useBaseUrl, { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import Features, { type FeatureItem } from "@site/src/data/features";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";

import styles from "./styles.module.css";

function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroProjectTagline}>
          <img
            className={styles.heroLogo}
            src={"/img/logo.svg"}
            width="200"
            height="200"
          />
          <span className={styles.heroTitleTextHtml}>
            Build <b>interoperable</b> healthcare apps based on{" "}
            <b>open standards</b>.
          </span>
        </Heading>
        <div className={styles.indexCtas}>
          <Link
            className="button button--primary"
            to="/documentation/Getting%20Started/Local_Development"
          >
            Get Started
          </Link>
          <Link
            className="button button--info"
            to="https://api.iguhealth.app/auth/login"
          >
            Sign in
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=iguhealth&amp;repo=iguhealth&amp;type=star&amp;count=true&amp;size=large"
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function Feature({
  feature,
  className,
}: {
  feature: FeatureItem;
  className?: string;
}) {
  const { withBaseUrl } = useBaseUrlUtils();

  return (
    <div className={clsx("col", className)}>
      <img
        className={styles.featureImage}
        alt={feature.title}
        width={Math.floor(feature.image.width)}
        height={Math.floor(feature.image.height)}
        src={withBaseUrl(feature.image.src)}
        loading="lazy"
      />
      <Heading as="h3" className={clsx(styles.featureHeading)}>
        {feature.title}
      </Heading>
      <p className="padding-horiz--md">{feature.text}</p>
    </div>
  );
}

function FeaturesContainer() {
  const firstRow = Features.slice(0, 3);
  const secondRow = Features.slice(3);

  return (
    <div className="container text--center">
      <div className="row margin-top--lg margin-bottom--lg">
        {firstRow.map((feature, idx) => (
          <Feature feature={feature} key={idx} />
        ))}
      </div>
      <div className="row">
        {secondRow.map((feature, idx) => (
          <Feature
            feature={feature}
            key={idx}
            className={clsx("col--4", idx === 0 && "col--offset-2")}
          />
        ))}
      </div>
    </div>
  );
}

export default function Pricing(): JSX.Element {
  return (
    <Layout title="IGUHealth">
      <section className="relative z-10 overflow-hidden  pt-10 pb-12">
        <HeroBanner />
        <FeaturesContainer />
      </section>
    </Layout>
  );
}
