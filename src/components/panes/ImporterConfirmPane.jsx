import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';


@connect(() => ({}))
@injectIntl
export default class ImporterConfirmPane extends PaneBase {
    getPaneTitle(data) {
        //return this.props.intl.formatMessage({ id: 'panes.addSurvey.title' });
        return "Hej";
    }

    renderPaneContent(data) {
        return (<div>Hej</div>);
    }

    /*renderPaneFooter(data) {
        return (
            <Button className="AddSurveyPane-saveButton"
                labelMsg="panes.addSurvey.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }*/

    onSubmit(ev) {
        console.log("onSubmit");
    }
}
