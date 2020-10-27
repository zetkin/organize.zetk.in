import DefaultColumnValue from './DefaultColumnValue';
import DateColumnValue from './DateColumnValue';
import PersonTagColumnValue from './PersonTagColumnValue';
import PersonGenderColumnValue from './PersonGenderColumnValue';

export function resolveValueComponent(column) {
    if (column.type == 'person_tag') {
        return PersonTagColumnValue;
    } else if (column.type == 'person_gender') {
        return PersonGenderColumnValue;
    } else if (column.type == 'person_field' && column.config.field_type == 'date') {
        return DateColumnValue;
    } else {
        return DefaultColumnValue;
    }
}
