import React from 'react/addons';
import { Link } from 'react-router-component';

import PaneBase from '../../panes/PaneBase';


export default class PeopleListPane extends PaneBase {
    getPaneTitle() {
        return 'People';
    }

    componentDidMount() {
        this.listenTo('person', this.forceUpdate);
        this.getActions('person').getPeople();
    }

    renderPaneContent() {
        var personStore = this.getStore('person');
        var people = personStore.getPeople();

        return (
            <div>
                <h3>People</h3>
                <table>
                    {people.map(function(person, index) {
                        return (
                            <tr onClick={ this.onPersonClick.bind(this, person) }>
                                <td>{ person.first_name }</td>
                                <td>{ person.last_name }</td>
                                <td>{ person.email }</td>
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
