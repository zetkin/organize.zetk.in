import React from 'react/addons';
import { Link, Locations, Location, NotFound } from 'react-router-component';

import PaneBase from '../PaneBase';
import PersonPane from './PersonPane';


export default class PeopleListPane extends PaneBase {
    getPaneTitle() {
        return 'People';
    }

    getChildPanes() {
        return [
            { path: '/:personId', component: PersonPane }
        ];
    }

    renderPaneContent() {
        return (
            <div>
                <h3>Jiddermekk</h3>
                <Link href="/1337">Person 1337</Link>
            </div>
        );
    }
}
