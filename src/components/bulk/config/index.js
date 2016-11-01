import PersonTagBulkOpConfig from './PersonTagBulkOpConfig';


let _components = {
    'person.tag': PersonTagBulkOpConfig,
};

export function resolveConfig(op) {
    return _components[op];
}
