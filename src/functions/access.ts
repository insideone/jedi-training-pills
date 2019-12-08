const access = <T>(accessors: (() => T)[], defaultValue: any = undefined): (T | typeof defaultValue)[] => {
    return accessors.map(accessor => {
        // inspired by https://stackoverflow.com/a/46256973
        try {
            return accessor();
        } catch (e) {
            return defaultValue;
        }
    })
};

export default access;
