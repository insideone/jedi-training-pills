import getCompositeCallback from "../../src/functions/getCompositeCallback";

test('getCompositeCallback should return callback that calls all passed callbacks', () => {
    let acc = 10;

    getCompositeCallback([
        () => (acc += 3),
        () => (acc += 5),
    ])();

    expect(acc).toBe(18);
});

test('getCompositeCallback should ignore passed null values', () => {
    getCompositeCallback([null])();
});
