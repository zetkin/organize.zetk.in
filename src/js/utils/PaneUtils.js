import AddPersonPane from '../components/panes/AddPersonPane';
import LocationPane from '../components/panes/LocationPane';
import PersonPane from '../components/panes/PersonPane';

var _panes = {
    'addperson': AddPersonPane,
    'location': LocationPane,
    'person': PersonPane
};

function resolve(name) {
    if (name in _panes) {
        return _panes[name];
    }
    else {
        return null;
    }
}

export default {
    resolve: resolve
};
