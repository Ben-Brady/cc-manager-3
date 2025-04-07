export const log = (message: string) => {
    const utc = Date.now() / 1000;
    console.log(`${utc} | ${message}`);
};
