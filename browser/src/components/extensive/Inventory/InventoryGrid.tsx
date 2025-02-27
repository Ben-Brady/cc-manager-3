import classNames from "classnames";
import { range } from "lodash";
import { FC } from "react";

import { ItemSlot, UNKNOWN_SLOT } from "@/lib/item";
import InventorySquare from "./InventorySlot";
import ItemImage from "./ItemImage";

const InventoryGrid: FC<{
    width: number;
    height: number;
    items: ItemSlot[] | undefined;
    selectedSlot?: number;
    onClick?: (slot: number) => void;
}> = ({ width, height, items, selectedSlot, onClick }) => {
    items ??= range(width * height).map(() => UNKNOWN_SLOT);
    return (
        <div
            className="grid flex-wrap w-fit h-fit"
            style={{
                gridTemplateRows: `repeat(${height}, 1fr)`,
                gridTemplateColumns: `repeat(${width}, 1fr)`,
            }}
        >
            {items.map((item, index) => (
                <InventorySquare
                    key={`${index}-${item?.name}-${item?.count}`}
                    onClick={() => onClick?.(index)}
                    className={classNames(index + 1 === selectedSlot && "opacity-60")}
                    role={!!onClick ? "button" : undefined}
                >
                    {item && <ItemImage name={item.name} className="size-full" />}
                    {item && item.count > 1 && (
                        <span className="right-0 bottom-0.5 absolute h-[1em] text-item select-none">
                            {item.count}
                        </span>
                    )}
                </InventorySquare>
            ))}
        </div>
    );
};

export default InventoryGrid;
