let lastActivityTime = Date.now();

export const markActivity = () => {
    lastActivityTime = Date.now();
};

export const getLastActivityTime = () => lastActivityTime;