import Train from "../types/train";
import GenericFilter from "./genericFilter";

type TrainsFilterFn = (train: Train) => boolean;

export default class TrainsFilter extends GenericFilter<Train[]> {
    protected nameExcludes: string[] = [];
    protected nameRegexExcludes: RegExp[] = [];

    filter(): Train[] {
        return this.input
            .filter(this.nameCompatibleFn())
            .filter(this.nameRegexCompatibleFn())
    }

    protected nameCompatibleFn(): TrainsFilterFn {
        return train => !this.nameExcludes.includes(train.name);
    }

    protected nameRegexCompatibleFn(): TrainsFilterFn {
        return train => (
            this.nameRegexExcludes
                .map(nameRegex => train.name.match(nameRegex))
                .filter(match => match)
                .length === 0
        );
    }

    public addNameExcludes(excludes: string[]): this {
        this.nameExcludes.push(...excludes);
        return this;
    }

    public addNameRegexExcludes(regexExceptions: RegExp[]): this {
        this.nameRegexExcludes.push(...regexExceptions);
        return this;
    }
}
