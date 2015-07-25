import React from 'react/addons';
import { Link } from 'react-router-component';

import PaneBase from '../../panes/PaneBase';


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

        return (
            <div>
                <h3>People</h3>
                <table>
                    {people.map(function(p, index) {
                        return (
                            <tr key={ p.id}
                                onClick={ this.onPersonClick.bind(this, p) }>
                                <td>{ p.first_name }</td>
                                <td>{ p.last_name }</td>
                                <td>{ p.email }</td>
                            </tr>
                        );
                    }, this)}
                </table>
            </div>
        );
    }

    onPersonClick(person) {
        this.gotoSubPane('person', person.id);
    }
}
