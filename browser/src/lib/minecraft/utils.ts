const MINECRAFT_PREFIX = "minecraft:";
export const removeNamespace = (name: string) =>
    name.startsWith(MINECRAFT_PREFIX) ? name.slice(MINECRAFT_PREFIX.length) : name;
