import { z, type ZodTypeAny } from "zod";

export const luaArray = <T extends ZodTypeAny>(schema: T) => {
    return z.preprocess((obj: unknown) => {
        if (typeof obj === "object" && obj !== null && Object.values(obj).length === 0) {
            return [];
        }

        return obj;
    }, z.array(schema));
};
