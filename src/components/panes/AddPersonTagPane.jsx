import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonTagForm from '../forms/PersonTagForm';
import Button from '../misc/Button';
import { createPersonTag } from '../../actions/personTag';


@connect(state => state)
@injectIntl
export default class AddPersonTagPane extends PaneBase {
    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addPersonTag.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <PersonTagForm ref="form" tag={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button
                labelMsg="panes.addPersonTag.saveButton"
                onClick={ this.onSubmit.bind(this) }
                className="AddPersonTagPane-saveButton"/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getValues();

        this.props.dispatch(createPersonTag(values));
        this.closePane();
    }
}
