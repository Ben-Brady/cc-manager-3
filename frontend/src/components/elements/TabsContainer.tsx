import classNames from "classnames";
import { ComponentProps } from "react";

import Container from "./Container";

interface TabContainerProps<T extends string> extends ComponentProps<"div"> {
    tabs: { name: T; icon: string }[];
    currentTab: T;
    onChangeTab?: (tab: T) => void;
    containerClassname?: string;
}

function TabContainer<T extends string>({
    tabs,
    currentTab,
    onChangeTab,
    containerClassname,
    ...props
}: TabContainerProps<T>) {
    return (
        <div className={classNames(containerClassname, "flex flex-col w-fit")}>
            <div className="flex px-4 gap-2 w-full">
                {tabs.map(({ name, icon }) => (
                    <button
                        key={name}
                        onClick={() => onChangeTab?.(name)}
                        className={classNames(
                            "cursor-pointer border-2 border-black rounded-[4px] translate-y-[5px]",
                            currentTab !== name && "",
                            currentTab === name && "z-20 border-b-0",
                        )}
                    >
                        <div
                            className={classNames(
                                "flex items-center justify-center",
                                "rounded-[4px] rounded-b-none p-0 w-10 h-11",
                                "border-[3px] bg-gray-300 border-l-white border-t-white border-r-gray-400 border-b-0",
                                currentTab == name && "!bg-gray-200",
                            )}
                        >
                            <img className="aspect-square size-8 pixelated" src={icon} />
                        </div>
                    </button>
                ))}
            </div>
            <Container {...props} className={classNames("z-10", props.className)} />
        </div>
    );
}

export default TabContainer;
