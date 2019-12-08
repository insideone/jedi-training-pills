import access from "./access";

function isset(...accessors: (() => any)[]) {
    return accessors.length === access(accessors).filter(value => typeof value !== 'undefined').length;
}

export default isset;
