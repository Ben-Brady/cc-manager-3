import { CSSProperties } from "react";
import plugin from "tailwindcss/plugin";

export const utilityPlugin = () =>
    plugin(({ addUtilities, matchUtilities, theme }) => {
        matchUtilities(
            {
                "cols-autofit": (value) =>
                    ({
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
                    } satisfies CSSProperties),
            },
            { values: theme("spacing") },
        );
        matchUtilities(
            {
                "cols-autofill": (value) =>
                    ({
                        gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
                    } satisfies CSSProperties),
            },
            { values: theme("spacing") },
        );
        matchUtilities(
            {
                "rows-autofit": (value) =>
                    ({
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
                    } satisfies CSSProperties),
            },
            { values: theme("spacing") },
        );
        matchUtilities(
            {
                "rows-autofill": (value) =>
                    ({
                        gridTemplateRows: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
                    } satisfies CSSProperties),
            },
            { values: theme("spacing") },
        );

        addUtilities({
            ".pixelated": {
                "content-visibility": "auto",
                "image-rendering": "pixelated",
            },
        });
    });
