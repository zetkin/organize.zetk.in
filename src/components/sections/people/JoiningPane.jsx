import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import Button from '../../misc/Button';
import JoinFormList from '../../lists/JoinFormList';
import JoinSubmissionList from '../../lists/JoinSubmissionList';
import SelectInput from '../../forms/inputs/SelectInput';
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

    getPaneFilters(data, filters) {
        let formOptions = {}
        if (this.props.formList && this.props.formList.items) {
            this.props.formList.items.forEach(item => {
                formOptions[item.data.id] = item.data.title;
            });
        }

        return [
            <div key="joinForm">
                <Msg tagName="label" id="panes.joinSubmission.filters.joinForm.label"/>
                <SelectInput name="joinForm"
                    options={ formOptions }
                    value={ filters.joinForm }
                    nullOptionMsg="panes.joinSubmission.filters.joinForm.nullOption"
                    orderAlphabetically={ true }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
                <Msg tagName="label" id="panes.joinSubmission.filters.state.label"/>
                <SelectInput name="state"
                    value={ filters.state }
                    nullOptionMsg="panes.joinSubmission.filters.state.nullOption"
                    options={{
                        'accepted': 'panes.joinSubmission.filters.state.accepted',
                        'pending': 'panes.joinSubmission.filters.state.pending',
                    }}
                    optionLabelsAreMessages={ true }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
            </div>
        ];
    }

    renderPaneContent(data) {
        if (this.state.viewMode == 'submissions') {
            return (
                <JoinSubmissionList
                    submissionList={ this.props.submissionList }
                    onItemClick={ item => this.openPane('joinsubmission', item.data.id) }
                    enablePagination={ true }
                    onLoadPage={ this.onLoadPage.bind(this) }
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

    onLoadPage(page) {
        const {filters} = this.state;
        const joinForm = filters.joinForm ? filters.joinForm : null;

        this.props.dispatch(retrieveJoinSubmissions(joinForm, filters.state, page));
    }

    onFiltersApply(filters) {
        this.setState({ filters });

        if (filters.joinForm) {
            this.props.dispatch(retrieveJoinSubmissions(filters.joinForm, filters.state));
        }
        else {
            this.props.dispatch(retrieveJoinSubmissions(null, filters.state));
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
