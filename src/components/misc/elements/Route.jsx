import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default function Route(props) {
    let content = props.route.title || (
        <Msg id="misc.elements.route"
            values={{ id: props.route.id }}
            />
    );

    return (
        <span className="Route">
            { content }
        </span>
    );
}
