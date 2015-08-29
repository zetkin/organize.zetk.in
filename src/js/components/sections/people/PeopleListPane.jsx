import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import PeopleList from '../../misc/peoplelist/PeopleList';


export default class PeopleListPane extends PaneBase {
    getPaneTitle() {
        return 'People';
    }

    componentDidMount() {
        this.listenTo('person', this.forceUpdate);
        this.getActions('person').retrievePeople();
    }

    renderPaneContent() {
        var personStore = this.getStore('person');
        var people = personStore.getPeople();

        return [
            <input type="button" value="Add"
                onClick={ this.onAddClick.bind(this) }/>,
            <PeopleList people={ people }
                onSelect={ this.onSelect.bind(this) }/>
        ];
    }

    onSelect(person) {
        this.gotoSubPane('person', person.id);
    }

    onAddClick(person) {
        this.gotoSubPane('addperson');
    }
}
