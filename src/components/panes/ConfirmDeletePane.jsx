import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import DeleteButton from '../misc/DeleteButton';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { deletePersonView } from '../../actions/personView';
import { deleteSurveySubmission } from '../../actions/surveySubmission';
import { retrieveConnections, deleteConnection } from '../../actions/connection'

const mapStateToProps = (state, props) => ({
    connections: state.connections.connectionList.items.find(conn => conn.data[0].profile.id == props.paneData.params[0])
});

@connect(mapStateToProps)
@injectIntl
export default class ConfirmDeletePane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.confirmDelete.title' });
    }

    // TODO: if membership, onMount -> fetch memberships, in order to display memberships to be deleted
    componentDidMount() {
        super.componentDidMount()

        const type = this.getParam(1);
        if (type === 'connection') {
            const personId = this.getParam(0);
            this.props.dispatch(retrieveConnections(personId));
        }
    }

    getRenderData() {
        return {
            type: this.getParam(1)
        }
    }

    renderPaneContent(data) {
        let messageId;
        if(data.type == 'view') {
            messageId = "panes.confirmDelete.deleteView";
        }
        else if(data.type == 'surveysubmission') {
            messageId = "panes.confirmDelete.deleteSurveySubmission";
        }
        else if(data.type == 'connection') {
            const connOrgId = this.getParam(2);
            let orgsMessage;
            let orgsList; 
            const connections = this.props.connections;
            if (connections && connections.data.length > 1) {
                let orgs = connections.data
                    .filter(conn => conn.organization.id != connOrgId)
                    .map(conn => 
                        <li key={ conn.organization.id }>{conn.organization.title}</li>
                    )
                orgsMessage = (
                    <Msg className="removeMessage" key="p1" tagName="p" id="panes.confirmDelete.deleteConnectionOrgs" />
                )
                orgsList = (
                    <ul key="orgList">
                        { orgs }
                    </ul>
                )
            }
            return [
                <Msg key="p0" tagName="p" id={ "panes.confirmDelete.deleteConnection" } />,
                orgsMessage,
                orgsList,
            ];
        }

        return [
            <Msg key="p0" tagName="p" id={ messageId } />,
        ];
    }

    renderPaneFooter(data) {
        return (
            <DeleteButton
                onClick={ this.onConfirm.bind(this) } />
        );
    }

    onConfirm(ev) {
        const id = this.getParam(0);
        const type = this.getParam(1);
        if(type == 'view') {
            this.props.dispatch(deletePersonView(id));
        }
        else if(type == 'surveysubmission') {
            this.props.dispatch(deleteSurveySubmission(id));
        }
        else if(type == 'connection') {
	    const connectionOrg = this.getParam(2);
            this.props.dispatch(deleteConnection(id, connectionOrg));
        }
        this.closePane();
    }
}
