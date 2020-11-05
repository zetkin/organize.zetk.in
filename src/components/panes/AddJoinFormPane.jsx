import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import JoinFormForm from '../forms/JoinFormForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import { createJoinForm } from '../../actions/joinForm';


@connect()
@injectIntl
export default class AddJoinFormPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.addJoinForm.title' })
    }

    renderPaneContent(data) {
        return [
            <JoinFormForm key="form" ref="form"
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddJoinFormPane-saveButton"
                labelMsg="panes.addJoinForm.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const formId = this.getParam(0);
        const values = this.refs.form.getValues();

        this.props.dispatch(createJoinForm(values, this.props.paneData.id));
    }
}
