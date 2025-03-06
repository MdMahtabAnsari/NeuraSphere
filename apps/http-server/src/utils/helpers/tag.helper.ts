export const getTags = (content: string): string[] => {
    try {
        // Match hashtags that start with # and contain letters, numbers, or underscores
        const tags = content.match(/#\w+/g) || [];
        // Remove the # from the hashtags
        return tags.map(tag => tag.slice(1));
    } catch (error) {
        console.error("Error in getTags helper", error);
        return [];
    }
};
