interface CardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
}

export default function Card({ title, price, description, features }) {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/4">
      <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-solid border-2 border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 py-10 px-8 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-[50px]">
        <span className="mb-3 block text-lg font-semibold text-primary">
          {title}
        </span>
        <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
          <span>${price}</span>
          <span className="text-base font-medium text-body-color dark:text-dark-6">
            / month
          </span>
        </h2>
        <p className="mb-8 border-b border-stroke dark:border-dark-3 pb-8 text-base text-body-color dark:text-dark-6">
          {description}
        </p>
        <div className="mb-9 flex flex-col space-y-2">
          {features.map((feature) => (
            <p className="mb-0 text-base text-body-color dark:text-dark-6">
              {feature}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
