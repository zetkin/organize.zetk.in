import PersonDataColumnSettings from './PersonDataColumnSettings';
import PersonTagColumnSettings from './PersonTagColumnSettings';
import PersonGenderColumnSettings from './PersonGenderColumnSettings';
import PersonFieldColumnSettings from './PersonFieldColumnSettings';


let _settings = {
    'person_data': PersonDataColumnSettings,
    'person_tag': PersonTagColumnSettings,
    'person_gender': PersonGenderColumnSettings,
    'person_field': PersonFieldColumnSettings,
};

export function resolveSettingsComponent(name) {
    if (name in _settings) {
        return _settings[name];
    }
    else {
        return null;
    }
}
