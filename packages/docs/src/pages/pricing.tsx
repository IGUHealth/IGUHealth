import Card from "@site/src/components/Card";
import Layout from "@theme/Layout";

export default function Pricing(): JSX.Element {
  return (
    <Layout title={`IGUHealth pricing`} description="IGUHealth pricing page">
      <main>
        <section className="relative z-10 overflow-hidden  pt-10 pb-12">
          <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                  <span className="mb-2 block text-lg font-semibold text-primary">
                    Pricing Table
                  </span>
                  <h2 className="mb-3 text-3xl leading-[1.208] font-bold text-dark  sm:text-4xl md:text-[40px]">
                    Our Pricing Plans
                  </h2>
                  <p className="text-base text-body-color ">
                    These are our pricing plans. We support a wide range of
                    deployment options such as cloud, on-premises, hybrid.
                    Contact us for more information.
                  </p>
                </div>
              </div>
            </div>
            <div className="-mx-4 flex flex-wrap justify-center">
              <Card
                title="Free"
                price="$0"
                priceSuffix="/ month"
                description=""
                features={[
                  "3,000 FHIR R4 Resources",
                  "3,000 FHIR R4B Resources",
                  "5 Users",
                  "5 Client Applications",
                  "0 Message Brokers",
                  "0 Message Topics",
                  "0 R4 Custom Operations",
                  "0 R4 Subscriptions",
                  "0 R4B Custom Operations",
                  "0 R4B Subscriptions",
                ]}
                support={[
                  "Support via Github Issues (No guarantees on response time)",
                  "No assistance for deploying custom code/solutions",
                  "Cloud deployment only",
                ]}
              />
              <Card
                title="Professional"
                price="$100"
                priceSuffix="/ month"
                description=""
                features={[
                  "50,000 FHIR R4 Resources",
                  "50,000 FHIR R4B Resources",
                  "100 Users",
                  "50 Client Applications",
                  "2 Message Brokers",
                  "5 Message Topics",
                  "5 R4 Custom Operations",
                  "5 R4 Subscriptions",
                  "5 R4B Custom Operations",
                  "5 R4B Subscriptions",
                ]}
                support={[
                  "Support via email (Response time: 24 hours)",
                  "No assistance for deploying custom code/solutions",
                  "Cloud deployment only",
                ]}
              />
              <Card
                title="Team"
                price="$3,000"
                priceSuffix="/ month"
                description=""
                features={[
                  "100,000 FHIR R4 Resources",
                  "100,000 FHIR R4B Resources",
                  "5000 Users",
                  "500 Client Applications",
                  "10 Message Brokers",
                  "50 Message Topics",
                  "30 R4 Custom Operations",
                  "30 R4 Subscriptions",
                  "30 R4B Custom Operations",
                  "30 R4B Subscriptions",
                ]}
                support={[
                  "24 Hour Support",
                  "Personal assistance with deploying custom code/solutions",
                  "Cloud deployment only",
                ]}
              />
              <Card
                title="Enterprise"
                price="Contact us"
                description=""
                features={[
                  "Unlimited FHIR R4 Resources",
                  "Unlimited FHIR R4B Resources",
                  "Unlimited Users",
                  "Unlimited Client Applications",
                  "Unlimited Message Brokers",
                  "Unlimited Message Topics",
                  "Unlimited R4 Custom Operations",
                  "Unlimited R4 Subscriptions",
                  "Unlimited R4B Custom Operations",
                  "Unlimited R4B Subscriptions",
                ]}
                support={[
                  "24 Hour Support",
                  "Personal assistance with deploying code/solutions",
                  "On Premise Deployment",
                ]}
              />
              <Card
                title="Self-hosting"
                price="$0"
                priceSuffix="/ month"
                description=""
                features={[
                  "Unlimited FHIR R4 Resources",
                  "Unlimited FHIR R4B Resources",
                  "Unlimited Users",
                  "Unlimited Client Applications",
                  "Unlimited Message Brokers",
                  "Unlimited Message Topics",
                  "Unlimited R4 Custom Operations",
                  "Unlimited R4 Subscriptions",
                  "Unlimited R4B Custom Operations",
                  "Unlimited R4B Subscriptions",
                ]}
                support={[
                  "Support via Github Issues (No guarantees on response time)",
                  "No assistance for deploying custom code/solutions",
                  "Self-hosting on your infrastructure",
                ]}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
