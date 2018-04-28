import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import GroupForm from '../forms/GroupForm';
import Button from '../misc/Button';
import { createGroup } from '../../actions/group';

@connect(state => ({}))
@injectIntl
export default class AddGroupPane extends PaneBase {
    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addGroup.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <GroupForm ref="form" tag={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button
                labelMsg="panes.addGroup.saveButton"
                onClick={ this.onSubmit.bind(this) }
                className="AddGroupPane-saveButton"/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getValues();

        this.props.dispatch(createGroup(values, this.props.paneData.id));
    }
}
