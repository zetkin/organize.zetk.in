import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import PersonViewColumnForm from '../forms/PersonViewColumnForm';
import { createPersonViewColumn } from '../../actions/personView';


@connect(state => state)
@injectIntl
export default class AddPersonTagPane extends PaneBase {
    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addViewColumn.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            type: 'person_field',
        };

        return (
            <PersonViewColumnForm ref="form" column={ initialData }
                onSubmit={ this.onSubmit.bind(this) }
                />
        );
    }

    renderPaneFooter(data) {
        return (
            <Button
                labelMsg="panes.addViewColumn.saveButton"
                onClick={ this.onSubmit.bind(this) }
                className="AddPersonTagPane-saveButton"/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const viewId = this.getParam(0);
        const values = this.refs.form.getValues();

        this.props.dispatch(createPersonViewColumn(viewId, values));
        this.closePane();
    }
}
