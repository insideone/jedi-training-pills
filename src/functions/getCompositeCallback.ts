import Callback from "../types/callback";

const getCompositeCallback = (callbacks: (Callback | null)[]) => (
    (...args: any[]) => callbacks
        .filter(callback => typeof callback === 'function')
        .forEach((callback: Callback) => callback.apply(null, args))
);

export default getCompositeCallback;
