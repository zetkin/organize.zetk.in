import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default function Route(props) {
    // TODO: Use title instead once routes can be named
    return (
        <span className="Route">
            <Msg id="misc.elements.route"
                values={{ id: props.route.id }}
                />
        </span>
    );
}
