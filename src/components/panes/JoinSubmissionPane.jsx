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
import {
    acceptJoinSubmission,
    retrieveJoinSubmission,
} from '../../actions/joinForm';
import InfoList from '../misc/InfoList';


const ADDR_FIELDS = [ 'co_address', 'street_address', 'zip_code', 'city', 'country' ];

const mapStateToProps = (state, props) => ({
    subItem: getListItemById(state.joinForms.submissionList,
        props.paneData.params[0]),
});

@connect(mapStateToProps)
@injectIntl
export default class JoinSubmissionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const subId = this.getParam(0);
        this.props.dispatch(retrieveJoinSubmission(subId));
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
        const { subItem } = this.props;

        if (subItem) {
            const state = subItem.data.state;
            const person = subItem.data.person_data;

            let addrFields = ADDR_FIELDS.filter(f => person[f]).map(field => (
                <span key={ field } className="JoinSubmissionPane-infoValue">
                    { person[field] }
                </span>
            ));

            const phoneNumbers = [ person.phone, person.alt_phone ].filter(pn => !!pn);

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

            return [
                <InfoList key="info"
                    data={[
                        { name: 'email', value: person.email },
                        { name: 'phone', value: phoneNumbers.join(', ') },
                        { name: 'address', value: addrFields.length? addrFields : null },
                    ]}
                />,
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
