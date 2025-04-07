export const formatDuration = (seconds: number) => {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 60 / 60);
    const days = Math.floor(seconds / 60 / 60 / 24);

    if (days === 1) return `${days} day`;
    if (days > 0) return `${days} days`;

    if (hours === 1) return `${hours} hour`;
    if (hours > 0) return `${hours} hours`;

    if (minutes === 1) return `${minutes} minute`;
    if (minutes > 0) return `${minutes} minutes`;

    return `${seconds} seconds`;
};

export const formatNumberShort = (value: number): string => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
};
