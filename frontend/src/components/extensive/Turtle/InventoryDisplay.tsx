import { FC } from "react";

import Container from "@/components/elements/Container";
import { TurtleActions } from "@/lib/turtle";
import { TurtleInfo } from "@/lib/devices/types";

import InventoryGrid from "../Inventory/InventoryGrid";

export const InventoryDisplay: FC<{ turtle: TurtleInfo; actions?: TurtleActions }> = ({
    turtle,
    actions,
}) => {
    const leftHand = turtle?.leftHand ? [turtle?.leftHand] : undefined;
    const rightHand = turtle?.rightHand ? [turtle?.rightHand] : undefined;

    return (
        <Container className="size-fit flex flex-col gap-2">
            <div className="flex justify-between">
                <InventoryGrid width={1} height={1} items={leftHand} />
                <InventoryGrid width={1} height={1} items={rightHand} />
            </div>
            <InventoryGrid
                height={4}
                width={4}
                items={turtle?.inventory}
                selectedSlot={turtle?.selectedSlot}
                onClick={actions ? (slot) => actions.select(slot) : undefined}
            />
        </Container>
    );
};
