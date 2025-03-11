import { FC, HTMLAttributes } from "react";

const InventorySquare: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div
        className={
            "size-12 p-0.5 border-b-white border-r-white border-t-gray-600 border-l-gray-600 border-2 bg-gray-300 relative " +
            (className ?? "")
        }
        {...props}
    />
);

export default InventorySquare;
