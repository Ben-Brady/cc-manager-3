import { FC } from "react";

import ArrowImage from "@/assets/images/arrow.png";
import DotImage from "@/assets/images/dot.png";
import Button from "@/components/elements/Button";

const DirectionalActions: FC<{
    title: string;
    onForward: () => void;
    onUp: () => void;
    onDown: () => void;
}> = ({ title, onForward, onUp, onDown }) => {
    return (
        <div className="flex flex-col w-10 items-center">
            <span className="font-minecraft">{title}</span>
            <Button className="w-full h-fit flex justify-center" onClick={onUp}>
                <img src={ArrowImage} className="-rotate-90  size-4" />
            </Button>
            <Button className="w-full h-fit flex justify-center" onClick={onForward}>
                <img src={DotImage} className="size-3" />
            </Button>
            <Button className="w-full h-fit flex justify-center" onClick={onDown}>
                <img src={ArrowImage} className="rotate-90 size-4" />
            </Button>
        </div>
    );
};

export default DirectionalActions;
