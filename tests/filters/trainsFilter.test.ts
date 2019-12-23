import TrainsFilter from "../../src/filters/trainsFilter";
import Train from "../../src/types/train";

test('TrainsFilter.filter', () => {
    const result = (new TrainsFilter([
        { name: 'an ok entry'},
        { name: 'some regex excluded entry' },
        { name: 'another regex excluded entry' },
        { name: 'some dictionary excluded entry' },
        { name: 'another ok entry' },
    ] as Train[]))
        .addNameRegexExcludes([/regex excluded/])
        .addNameExcludes(['some dictionary excluded entry'])
        .filter();

    expect(result).toEqual([
        { name: 'an ok entry'},
        { name: 'another ok entry' },
    ])
});
