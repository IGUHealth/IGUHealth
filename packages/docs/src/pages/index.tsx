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
            Create your own <b>interoperable</b> healthcare <b>platform</b>
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
        <div className="mt-8 mb-24">
          <div className="py-24 -skew-y-6 bg-gray-200 overflow-hidden">
            <div className="skew-y-6 max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
              <div className="row">
                <div className="col flex flex-col justify-center items-center">
                  <div className="sm:w-full row">
                    <div className="flex flex-col col px-8 mb-8 pt-12 text-gray-700">
                      <h1 className=" font-bold ">Schedule a demo</h1>
                      <span className=" block text-lg font-weight-500">
                        Do you want to learn more? Schedule a 1:1 session with
                        our team to see how we can help.
                      </span>
                      <ul className="mt-4 space-y-2 ">
                        <li>
                          Create an interoperable platform for your
                          organization.
                        </li>
                        <li>Build a custom solutions for your organization.</li>
                        <li>
                          Consultation about FHIR, Hl7v2 and other healthcare
                          standards.
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col p-4 col bg-gray-50 rounded-md shadow-lg items-center border border-solid space-y-4 border-gray-400">
                      <form className="w-full max-w-[500px] py-8 space-y-4">
                        <div className="flex flex-wrap space-y-4 md:space-y-0">
                          <div className="w-full md:w-1/2 px-3 md:mb-0 ">
                            <label
                              className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-first-name"
                            >
                              First name
                            </label>
                            <input
                              className="appearance-none block w-full bg-gray-100 text-gray-700 border-solid border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                              id="grid-first-name"
                              type="text"
                            />
                          </div>
                          <div className="w-full md:w-1/2 px-3">
                            <label
                              className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-last-name"
                            >
                              Last name
                            </label>
                            <input
                              className="appearance-none block w-full bg-gray-100 text-gray-700 border-solid border  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="grid-last-name"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-full px-3 md:mb-0">
                            <label
                              className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-email"
                            >
                              Email address
                            </label>
                            <input
                              className="appearance-none block w-full bg-gray-100 text-gray-700 border-solid border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                              id="grid-email"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-full px-3">
                            <label
                              className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                              for="grid-body"
                            >
                              Body
                            </label>
                            <textarea
                              className="appearance-none block w-full bg-gray-100 text-gray-700 border-solid border  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="grid-body"
                            />
                          </div>
                        </div>
                        <div className="px-3">
                          <button
                            type="submit"
                            className="mt-4 border border-solid border-blue-700 bg-blue-500 py-3 px-5 text-sm font-medium text-center text-white rounded bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
                          >
                            Book demo
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
