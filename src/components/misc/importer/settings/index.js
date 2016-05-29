import PersonDataColumnSettings from './PersonDataColumnSettings';
import PersonTagColumnSettings from './PersonTagColumnSettings';


let _settings = {
    'person_data': PersonDataColumnSettings,
    'person_tag': PersonTagColumnSettings,
};

export function resolveSettingsComponent(name) {
    if (name in _settings) {
        return _settings[name];
    }
    else {
        return null;
    }
}
