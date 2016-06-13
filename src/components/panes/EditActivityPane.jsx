import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';
import { updateActivity, deleteActivity } from '../../actions/activity';
import { getListItemById } from '../../utils/store';


@connect(state => state)
export default class EditActivityPane extends PaneBase {
    getRenderData() {
        let activityList = this.props.activities.activityList;
        let activityId = this.getParam(0);

        return {
            activityItem: getListItemById(activityList, activityId),
        }
    }

    getPaneTitle(data) {
        return 'Edit activity';
    }

    renderPaneContent(data) {
        if (data.activityItem) {
            return [
                <ActivityForm key="form" ref="form"
                    activity={ data.activityItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <input key="delete" type="button" value="Delete"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const activityId = this.getParam(0);

        this.props.dispatch(updateActivity(activityId, values));
    }

    onDeleteClick(ev) {
        const activityId = this.getParam(0);

        this.props.dispatch(deleteActivity(activityId));
        this.closePane();
    }
}
