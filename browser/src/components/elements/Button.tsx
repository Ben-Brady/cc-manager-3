import classNames from "classnames";
import { ComponentProps, FC, useState } from "react";

const Button: FC<ComponentProps<"button">> = ({ className, disabled, onClick, ...props }) => {
    const [isRunning, setRunning] = useState<boolean>(false);

    return (
        <button
            disabled={disabled || isRunning}
            className={classNames(
                "outline outline-2 outline-black size-fit m-0.5",
                "font-minecraft text-white px-1 bg-gray-300",
                "border-2 border-b-gray-400 border-r-gray-400 border-t-white border-l-white",
                "active:bg-mblue-3 active:border-r-mblue-3 active:border-b-mblue-3",
                "disabled:bg-gray-700 disabled:border-transparent",
                className,
            )}
            onClick={
                !onClick
                    ? undefined
                    : async (e) => {
                          setRunning(true);
                          await onClick(e);
                          setRunning(false);
                      }
            }
            {...props}
        />
    );
};

export default Button;
