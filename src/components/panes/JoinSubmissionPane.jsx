import React from 'react';
import {
    FormattedMessage as Msg,
    FormattedTime,
    injectIntl
} from 'react-intl';
import { connect } from 'react-redux';

import ActionBox from '../misc/ActionBox';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrieveFieldTypesForOrganization } from '../../actions/personField';
import {
    acceptJoinSubmission,
    retrieveJoinForm,
    retrieveJoinSubmission,
} from '../../actions/joinForm';
import InfoList from '../misc/InfoList';


const ADDR_FIELDS = [ 'co_address', 'street_address', 'zip_code', 'city', 'country' ];

const mapStateToProps = (state, props) => {
    const subItem = getListItemById(state.joinForms.submissionList,
        props.paneData.params[0]);

    if (subItem) {
        return {
            fieldTypes: state.personFields.fieldTypes,
            formItem: getListItemById(state.joinForms.formList,
                subItem.data.form.id),
            subItem: subItem,
        }
    }
};

@connect(mapStateToProps)
@injectIntl
export default class JoinSubmissionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const subId = this.getParam(0);
        this.props.dispatch(retrieveJoinSubmission(subId));
        this.props.dispatch(retrieveFieldTypesForOrganization());

        if (this.props.subItem && this.props.subItem.data && !this.props.formItem) {
            this.props.dispatch(retrieveJoinForm(this.props.subItem.data.form.id));
        }
    }

    componentDidUpdate() {
        if (this.props.subItem && this.props.subItem.data && !this.props.formItem) {
            this.props.dispatch(retrieveJoinForm(this.props.subItem.data.form.id));
        }
    }

    getPaneTitle() {
        const { subItem } = this.props;

        if (subItem && subItem.data) {
            const person = subItem.data.person_data;

            return person.name
                || ((person.first_name && person.last_name)?
                    (person.first_name + ' ' + person.last_name) : '');
        }
        else {
            return null;
        }
    }

    renderPaneContent() {
        const { formItem, fieldTypes, subItem } = this.props;

        if (formItem && fieldTypes && subItem) {
            const state = subItem.data.state;
            const person = subItem.data.person_data;

            let actionContent = null;
            let actionButton = null;
            if (state == 'accepted') {
                actionContent = [
                    <Msg key="p" tagName="p"
                        id="panes.joinSubmission.action.accepted.p"
                        values={{ person: person.first_name }}
                        />,
                    <div key="person" className="JoinSubmissionPane-person"
                        onClick={ () => this.openPane('person', person.id) }
                        >
                        <Avatar person={ person }/>
                        <span className="JoinSubmissionPane-personName">
                            { `${person.first_name} ${person.last_name}` }
                        </span>
                    </div>
                ];
            }
            else {
                actionContent = (
                    <Msg tagName="p"
                        id="panes.joinSubmission.action.pending.p"
                        values={{ person: person.first_name }}
                        />
                );

                actionButton = (
                    <Button
                        labelMsg="panes.joinSubmission.action.pending.acceptButton"
                        onClick={ this.onClickAccept.bind(this) }
                        />
                );
            }

            const dataSection = (state == 'pending')? (
                <div key="data">
                    <Msg tagName="h3" id="panes.joinSubmission.data.h"/>
                    <ul className="JoinSubmissionPane-personData">
                    {this.props.formItem.data.fields.map(fieldName => {
                        const fieldItem = this.props.fieldTypes.items.find(item => item.data.slug == fieldName);

                        // Exclude JSON fields
                        if (fieldItem && fieldItem.data.type == 'json') {
                            return null;
                        }

                        const label = fieldItem? fieldItem.data.title : this.props.intl.formatMessage({ id: `misc.fields.${fieldName}` });
                        const value = person[fieldName];

                        return (
                            <li key={ fieldName }>
                                <span className="JoinSubmissionPane-fieldLabel">{ label }</span>
                                <span className="JoinSubmissionPane-fieldValue">{ value.toString() } </span>
                            </li>
                        );
                    })}
                    </ul>
                </div>
            ) : null;

            return [
                <div key="meta">
                    <Msg tagName="h3" id="panes.joinSubmission.meta.h"/>
                    <InfoList
                        data={[
                            { name: 'form', value: subItem.data.form.title },
                            { name: 'submitted', value: <FormattedTime value={ subItem.data.submitted }
                                year="numeric" month="short" day="numeric"
                                hour="2-digit" minute="2-digit"
                                /> },
                            { name: 'state', msgId: `panes.joinSubmission.meta.state.${state}` },
                        ]}
                    />
                </div>,
                dataSection,
                <ActionBox key="action"
                    status={ state == 'accepted'? 'done' : 'warning' }
                    headerMsg={ `panes.joinSubmission.action.${state}.h` }
                    content={ actionContent }
                    footer={ actionButton } />
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    onClickAccept() {
        const subId = this.getParam(0);
        this.props.dispatch(acceptJoinSubmission(subId));
    }
}
