import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


export default class PlaceholderPane extends PaneBase {
    getPaneTitle(data) {
        return 'Dialog (coming soon)';
    }

    renderPaneContent(data) {
        return <p>This section is not yet implemented.</p>
    }
}
