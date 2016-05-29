import DefaultColumnValue from './DefaultColumnValue';
import PersonTagColumnValue from './PersonTagColumnValue';

export function resolveValueComponent(column) {
    if (column.type == 'person_tag') {
        return PersonTagColumnValue;
    }
    else {
        return DefaultColumnValue;
    }
}
