import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';


const mapStateToProps = state => ({
    people: state.people,
    queries: state.queries,
    selections: state.selections,
});


@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionsPane extends RootPaneBase {
    renderPaneContent(data) {
        return null;
    }
}
