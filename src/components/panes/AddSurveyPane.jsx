import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import SurveyForm from '../forms/SurveyForm';
import Button from '../misc/Button';
import { createSurvey } from '../../actions/survey';


@connect(() => ({}))
@injectIntl
export default class AddSurveyPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.addSurvey.title' });
    }

    renderPaneContent(data) {
        return [
            <SurveyForm key="form" ref="form"
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddSurveyPane-saveButton"
                labelMsg="panes.addSurvey.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getChangedValues();

        this.props.dispatch(createSurvey(values, this.props.paneData.id));
    }
}
