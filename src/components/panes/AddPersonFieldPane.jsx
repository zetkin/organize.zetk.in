import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonFieldForm from '../forms/PersonFieldForm';
import Button from '../misc/Button';
import { createPersonField } from '../../actions/personField';


@connect(state => state)
@injectIntl
export default class AddPersonFieldPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            shouldShowButton: false,
        };
    }
    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addPersonField.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <PersonFieldForm ref="form" tag={ initialData }
                onValueChange={ this.onValueChange.bind(this) }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        if(this.state.shouldShowButton) {
            return (
                <Button
                    labelMsg="panes.addPersonField.saveButton"
                    onClick={this.onSubmit.bind(this)}
                    className="AddPersonFieldPane-saveButton"/>
            );
        } else {
            return null
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getValues();

        this.props.dispatch(createPersonField(values));
        this.closePane();
    }
    onValueChange(name, value) {
        if (name === "title") {
            this.setState({ shouldShowButton: !!value})
            // TODO: Determine a good slug here given title and slugs of other person fields
        }
    }
}
