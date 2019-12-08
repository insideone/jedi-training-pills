declare module 'tinydate' {
    export default function (format: string): (date: Date) => string;
}
