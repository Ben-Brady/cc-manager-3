import plugin from "tailwindcss/plugin";

export const typographyPlugin = () =>
    plugin(({ addUtilities }) => {
        addUtilities({
            ".text-item": {
                "font-family": "minecraft",
                "font-size": "1.5rem",
                "color": "white",
                "text-shadow": ".15rem .15rem #434343",
            },
        });
    });
