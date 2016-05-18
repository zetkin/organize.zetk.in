import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import { retrieveCalls } from '../../../actions/call';


@connect(state => state)
export default class CallLogPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCalls());
    }

    getRenderData() {
        return {
            callList: this.props.calls.callList,
        };
    }

    renderPaneContent(data) {
        return [
            <ul key="list">
            { data.callList.items.map(i => {
                let c = i.data;
                return <li key={ c.id }>{ c.target.name }</li>;
            }) }
            </ul>
        ];
    }
}
