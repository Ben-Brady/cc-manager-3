import { utilityPlugin } from "./src/plugins/utilities";
import { typographyPlugin } from "./src/plugins/typography";

/**
 * @param {number} number
 */
const spacing = (number) => `${number / 4}rem`;

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        colors: {
            "black": "#000",
            "white": "#fff",
            "ececec": "#ececec",
            "828bc0": "#828bc0",
            "mblue-3": "#828bc0",
            "gray-100": "#ececec",
            "gray-200": "#c6c6c6",
            "gray-300": "#8b8b8b",
            "gray-400": "#555555",
            "gray-600": "#373737",
            "gray-700": "#2b2b2b",
            "black-700": "#111",
        },
        extend: {
            fontFamily: {
                minecraft: "minecraft",
            },
            spacing: {
                128: spacing(128),
                160: spacing(160),
                192: spacing(192),
                224: spacing(224),
                256: spacing(256),
            },
        },
    },
    plugins: [utilityPlugin(), typographyPlugin()],
};
