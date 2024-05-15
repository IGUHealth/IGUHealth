import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Card from "@site/src/components/Card";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`IGUHealth pricing`} description="IGUHealth pricing page">
      <main>
        <section className="relative z-10 overflow-hidden bg-white dark:bg-dark pt-10 pb-12">
          <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                  <span className="mb-2 block text-lg font-semibold text-primary">
                    Pricing Table
                  </span>
                  <h2 className="mb-3 text-3xl leading-[1.208] font-bold text-dark dark:text-white sm:text-4xl md:text-[40px]">
                    Our Pricing Plan
                  </h2>
                  <p className="text-base text-body-color dark:text-dark-6">
                    There are many variations of passages of Lorem Ipsum
                    available but the majority have suffered alteration in some
                    form.
                  </p>
                </div>
              </div>
            </div>
            <div className="-mx-4 flex flex-wrap justify-center">
              <Card
                title="Self Hosting"
                price={0}
                description="Test"
                features={["TEsting", "testing2"]}
              />
              <Card
                title="Professional"
                price={120}
                description="Test"
                features={["TEsting", "testing2"]}
              />
              <Card
                title="Team"
                price={3000}
                description="Test"
                features={["TEsting", "testing2"]}
              />
              <Card
                title="Enterprise"
                price={5000}
                description="Test"
                features={["TEsting", "testing2"]}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
