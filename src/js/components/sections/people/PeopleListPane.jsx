import React from 'react/addons';
import { Link } from 'react-router-component';

import PaneBase from '../../panes/PaneBase';


export default class PeopleListPane extends PaneBase {
    getPaneTitle() {
        return 'People';
    }

    renderPaneContent() {
        return (
            <div>
                <h3>Jiddermekk</h3>
                <Link href={ this.subPanePath('person', 1337) }>Person 1337</Link>
            </div>
        );
    }
}
