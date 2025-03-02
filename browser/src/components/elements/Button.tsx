import classNames from "classnames";
import { ComponentProps, FC } from "react";

const Button: FC<ComponentProps<"button">> = ({ className, disabled, ...props }) => {
    return (
        <button
            disabled={disabled}
            className={classNames(
                "outline outline-2 outline-black size-fit m-0.5",
                "font-minecraft text-white px-1 bg-gray-300",
                "border-2 border-b-gray-400 border-r-gray-400 border-t-white border-l-white",
                "active:bg-mblue-3 active:border-r-mblue-3 active:border-b-mblue-3",
                "disabled:bg-gray-700 disabled:border-transparent",
                className,
            )}
            {...props}
        />
    );
};

export default Button;
