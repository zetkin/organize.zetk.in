import PersonPane from '../components/panes/PersonPane';
import AddPersonPane from '../components/panes/AddPersonPane';

var _panes = {
    'addperson': AddPersonPane,
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
