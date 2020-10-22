import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import Button from '../../misc/Button';
import JoinSubmissionList from '../../lists/JoinSubmissionList';
import { getListItemById } from '../../../utils/store';
import {
    retrieveJoinSubmissions,
} from '../../../actions/joinForm';


const mapStateToProps = state => ({
    submissionList: state.joinForms.submissionList,
});


@connect(mapStateToProps)
@injectIntl
export default class JoiningPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            viewMode: 'submissions',
        });
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.state.viewMode == 'submissions') {
            this.props.dispatch(retrieveJoinSubmissions());
        }
    }

    renderPaneContent(data) {
        return (
            <JoinSubmissionList
                submissionList={ this.props.submissionList }
                />
        );
    }

    getPaneTools(data) {
        return null;
    }
}
