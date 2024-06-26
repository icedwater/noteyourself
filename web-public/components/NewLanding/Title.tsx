import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Title = ({ className, children, ...restProps }: ComponentProps<"h1">) => {
  return (
    <h1
      className={twMerge(
        classNames("text-4xl md:text-6xl font-semibold mb-2 text-center"),
        className
      )}
      {...restProps}
    >
      {children}
    </h1>
  );
};

export default Title;
