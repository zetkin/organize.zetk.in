import PersonDataColumnSettings from './PersonDataColumnSettings';
import PersonTagColumnSettings from './PersonTagColumnSettings';
import PersonGenderColumnSettings from './PersonGenderColumnSettings';
import PersonFieldColumnSettings from './PersonFieldColumnSettings';
import PersonOrganizationColumnSettings from './PersonOrganizationColumnSettings';


let _settings = {
    'person_data': PersonDataColumnSettings,
    'person_tag': PersonTagColumnSettings,
    'person_gender': PersonGenderColumnSettings,
    'person_field': PersonFieldColumnSettings,
    'organization': PersonOrganizationColumnSettings,
};

export function resolveSettingsComponent(name) {
    if (name in _settings) {
        return _settings[name];
    }
    else {
        return null;
    }
}
