function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

interface CardProps {
  title: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features?: string[];
  support?: string[];
}

export default function Card({
  title,
  price,
  priceSuffix,
  description,
  features,
  support,
}: CardProps) {
  return (
    <div className="w-full px-4 md:w-1/2 xl:w-1/4">
      <div className="h-[900px] relative z-10 mb-10 overflow-hidden rounded-[10px] border-solid border-2 border-stroke  py-10 px-8 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-[50px]">
        <span className="mb-3 block text-lg font-semibold text-primary">
          {title}
        </span>
        <h2 className="mb-5 text-[42px] font-bold text-dark ">
          <span>{price}</span>
          {priceSuffix !== undefined && (
            <span className="text-base font-medium text-body-color ">
              {priceSuffix}
            </span>
          )}
        </h2>
        <p className="mb-2 border-b border-stroke pb-8 text-base text-body-color ">
          {description}
        </p>

        <h3>Features</h3>

        <div className="mb-9 flex flex-col space-y-4">
          {features?.map((feature) => (
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <CheckMark className="w-4" />
              </div>
              <span className="font-weight-500 text-sm text-body-color ">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <h3>Support</h3>

        <div className="mb-9 flex flex-col space-y-4">
          {support?.map((feature) => (
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <CheckMark className="w-4" />
              </div>
              <span className="font-weight-500 text-sm text-body-color ">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
