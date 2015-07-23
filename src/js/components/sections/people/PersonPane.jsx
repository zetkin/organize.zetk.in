import React from 'react/addons';

import PaneBase from '../PaneBase';


export default class PersonPane extends PaneBase {
    getPaneTitle() {
        return 'Person ' + this.props.personId;
    }
}
