export const validMedia = async (url: string) => {
    if (!url) return;

    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
};