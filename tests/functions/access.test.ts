import access from "../../src/functions/access";

type Point = {x: number, y: number, z?: number};
type Line = {a: Point, b: Point};

test('access should return accessable passed inputs', () => {
    const a: Point = {
        x: 10,
        y: 20,
    };

    const b: Point = {
        x: 30,
        y: 40,
    };

    const line: Partial<Line> = {a, b};

    const result = access([
        () => line.a!.x,
        () => line.a!.y,
        () => line.b!.x,
        () => line.b!.y,
    ]);

    expect(result).toStrictEqual([10, 20, 30, 40]);
});

test('access should return unaccessable passed inputs as undefined', () => {
    const point: Point = {
        x: 10,
        y: 20,
    };

    const line: Partial<Line> = {a: point};

    const result = access([
        () => line.a!.x,
        () => line.a!.y,
        () => line.b!.x,
    ]);

    expect(result).toStrictEqual([10, 20, undefined]);
});

test('access should return unaccessable passed inputs as default value', () => {
    const point: Point = {
        x: 10,
        y: 20,
    };

    const line: Partial<Line> = {a: point};

    const result = access([
        () => line.a!.x,
        () => line.a!.y,
        () => line.b!.x,
    ], 100);

    expect(result).toStrictEqual([10, 20, 100]);
});
