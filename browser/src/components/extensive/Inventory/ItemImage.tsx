import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

import { getImageSrc } from "@/lib/item";

type ItemImageProps = {
    name: string;
    className: string;
};

const ItemImage: FC<ItemImageProps> = ({ name, className }) => {
    const { data } = useQuery({
        queryKey: ["item-src", name],
        queryFn: () => getImageSrc(name),
    });

    if (data === undefined) return undefined;
    return <img title={name} src={data ?? "/missing.png"} className={className} />;
};

export default ItemImage;
