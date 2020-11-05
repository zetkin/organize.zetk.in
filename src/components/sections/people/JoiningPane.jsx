import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import Button from '../../misc/Button';
import JoinFormList from '../../lists/JoinFormList';
import JoinSubmissionList from '../../lists/JoinSubmissionList';
import ViewSwitch from '../../misc/ViewSwitch';
import { getListItemById } from '../../../utils/store';
import {
    retrieveJoinForms,
    retrieveJoinSubmissions,
} from '../../../actions/joinForm';


const mapStateToProps = state => ({
    formList: state.joinForms.formList,
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

        this.props.dispatch(retrieveJoinForms());
        this.props.dispatch(retrieveJoinSubmissions());
    }

    renderPaneContent(data) {
        if (this.state.viewMode == 'submissions') {
            return (
                <JoinSubmissionList
                    submissionList={ this.props.submissionList }
                    onItemClick={ item => this.openPane('joinsubmission', item.data.id) }
                    />
            );
        }
        else {
            return (
                <JoinFormList
                    formList={ this.props.formList }
                    onItemClick={ item => this.openPane('joinform', item.data.id) }
                    />
            );
        }
    }

    getPaneTools(data) {
        const viewStates = {
            'submissions': 'panes.joining.viewModes.submissions',
            'forms': 'panes.joining.viewModes.forms',
        };

        const tools = [
            <ViewSwitch key="viewSwitch"
                states={ viewStates }
                selected={ this.state.viewMode }
                onSwitch={ viewMode => this.setState({ viewMode }) }
                />,
        ];
        if (this.state.viewMode == 'forms') {
            tools.push(
                <Button key="addButton"
                    className="JoiningPane-addButton"
                    labelMsg="panes.joining.addButton"
                    onClick={ () => this.openPane('addjoinform') }/>
            );
        }

        return tools;
    }
}
