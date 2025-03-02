import classNames from "classnames";
import { ComponentProps, FC } from "react";

const Container: FC<ComponentProps<"div">> = ({ className, ...props }) => {
    return (
        <div
            className={classNames(
                "p-2 rounded-sm m-0.5",
                "outline outline-2 outline-black",
                "border-2 bg-gray-200 border-b-gray-400 border-r-gray-400 border-t-white border-l-white",
                className,
            )}
            {...props}
        />
    );
};

export default Container;
