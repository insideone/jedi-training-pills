declare module 'dot-dom' {
    type Hooks = {
        m: (() => void)[],
        u: (() => void)[],
        d: (() => void)[],
        r: boolean,
    };
    type VNode = object;
    type Props = {
        [key: string]: any,
        c?: VNode[],
    };
    type Component = (props: object, state: object, setState: (state: object) => void, hooks: Hooks) => VNode;

    type ElementCreator = (component: string | Component, props?: Props, ...children: VNode[]) => VNode;
    type Renderer = (node: VNode, element: HTMLElement) => void;

    export const R: Renderer;
    export const H: ElementCreator;
    export { Props };
}
