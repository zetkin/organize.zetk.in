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
    constructor(props) {
        super(props);

        this.state = this.state || {};
        this.setState({ isValid: false });
    }

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
                onSubmit={ this.onSubmit.bind(this) }
                onValidityChange={ this.onValidityChange.bind(this) }
            />
        );
    }

    renderPaneFooter(data) {
        if (!this.state.isValid) {
            return null;
        }

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

    onValidityChange(newValidity) {
        console.debug('AddPersonTagPane onValidityChange', newValidity);

        if (newValidity !== this.state.isValid) {
            this.setState({
                isValid: newValidity
            });
        }
    }
}
