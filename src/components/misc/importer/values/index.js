import DefaultColumnValue from './DefaultColumnValue';
import PersonTagColumnValue from './PersonTagColumnValue';
import PersonGenderColumnValue from './PersonGenderColumnValue';

export function resolveValueComponent(column) {
    if (column.type == 'person_tag') {
        return PersonTagColumnValue;
    }
    if (column.type == 'person_gender') {
        return PersonGenderColumnValue;
    }
    else {
        return DefaultColumnValue;
    }
}
