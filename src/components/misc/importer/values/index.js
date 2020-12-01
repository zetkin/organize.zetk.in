import DefaultColumnValue from './DefaultColumnValue';
import DateColumnValue from './DateColumnValue';
import PersonTagColumnValue from './PersonTagColumnValue';
import PersonGenderColumnValue from './PersonGenderColumnValue';
import PersonOrganizationColumnValue from './PersonOrganizationColumnValue';

export function resolveValueComponent(column) {
    if (column.type == 'person_tag') {
        return PersonTagColumnValue;
    } else if (column.type == 'person_gender') {
        return PersonGenderColumnValue;
    } else if (column.type == 'person_field' && column.config.field_type == 'date') {
        return DateColumnValue;
    } else if (column.type == 'organization') {
        return PersonOrganizationColumnValue;
    } else {
        return DefaultColumnValue;
    }
}
