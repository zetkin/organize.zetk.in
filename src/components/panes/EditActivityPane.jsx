import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';
import { getListItemById } from '../../utils/store';
import {
    deleteActivity,
    retrieveActivity,
    updateActivity,
} from '../../actions/activity';


@connect(state => state)
@injectIntl
export default class EditActivityPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveActivity(this.getParam(0)));
    }

    getRenderData() {
        let activityList = this.props.activities.activityList;
        let activityId = this.getParam(0);

        return {
            activityItem: getListItemById(activityList, activityId),
        }
    }

    getPaneTitle(data) {
        if (data.activityItem && !data.activityItem.isPending) {
            return this.props.intl.formatMessage(
                { id: 'panes.editActivity.title' },
                { activity: data.activityItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.activityItem) {
            return [
                <ActivityForm key="form" ref="form"
                    activity={ data.activityItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <Button key="deleteButton"
                    className="EditActivityPane-deleteButton"
                    labelMsg="panes.editActivity.deleteButton"
                    onClick={ this.onClickDelete.bind(this) }/>
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditActivityPane-saveButton"
                labelMsg="panes.editActivity.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const activityId = this.getParam(0);

        this.props.dispatch(updateActivity(activityId, values));
        this.closePane();
    }

    onClickDelete(ev) {
        const activityId = this.getParam(0);

        this.props.dispatch(deleteActivity(activityId));
        this.closePane();
    }
}
