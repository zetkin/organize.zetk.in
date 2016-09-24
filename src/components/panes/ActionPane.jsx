import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrieveAction } from '../../actions/action';


@connect(state => ({ actions: state.actions }))
export default class ActionPane extends PaneBase {
    componentDidMount() {
        let actionId = this.getParam(0);
        this.props.dispatch(retrieveAction(actionId));
    }

    getRenderData() {
        let actionId = this.getParam(0);
        let actionList = this.props.actions.actionList;

        return {
            actionItem: getListItemById(actionList, actionId),
        }
    }

    getPaneTitle(data) {
        if (data.actionItem && data.actionItem.data) {
            let action = data.actionItem.data;
            return 'Action: ' + action.activity.title;
        }
        else {
            return 'Action';
        }
    }

    getPaneSubTitle(data) {
        if (data.actionItem && data.actionItem.data) {
            let action = data.actionItem.data;
            let startDate = Date.utc.create(action.start_time);
            let timeLabel = startDate.setUTC(true)
                .format('{yyyy}-{MM}-{dd}, {HH}:{mm}');

            return action.location.title + ', ' + timeLabel;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.actionItem) {
            return (
                <p>
                    <a onClick={ this.onClickEdit.bind(this) }>
                        Edit</a>
                </p>
            );
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onClickEdit(ev) {
        let actionId = this.getParam(0);
        this.openPane('editaction', actionId);
    }
}
