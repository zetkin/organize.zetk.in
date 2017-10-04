import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import CanvassAssignmentForm from '../forms/CanvassAssignmentForm';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { createCanvassAssignment } from '../../actions/canvassAssignment';


@connect(state => ({}))
@injectIntl
export default class AddCanvassAssignmentPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.addCanvassAssignment.title' });
    }

    renderPaneContent(data) {
        let startDate = Date.create();
        let endDate = startDate.clone().addMonths(1);
        let assignment = {
            title: '',
            description: '',
            start_date: startDate.format('{yyyy}-{MM}-{dd}'),
            end_date: endDate.format('{yyyy}-{MM}-{dd}'),
        };

        return [
            <CanvassAssignmentForm key="form" ref="form"
                assignment={ assignment }
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddCanvassAssignmentPane-saveButton"
                labelMsg="panes.addCanvassAssignment.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let assignmentId = this.getParam(0);
        let values = this.refs.form.getValues();

        this.props.dispatch(createCanvassAssignment(values, this.props.paneData.id));
    }
}
