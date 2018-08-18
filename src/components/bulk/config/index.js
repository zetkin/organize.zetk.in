import PersonTagBulkOpConfig from './PersonTagBulkOpConfig';
import ActionExportBulkOpConfig from './ActionExportBulkOpConfig';

let _components = {
    'person.tag': PersonTagBulkOpConfig,
    'action.export': ActionExportBulkOpConfig,
};

export function resolveConfig(op) {
    return _components[op];
}
