import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import InfoList from '../misc/InfoList';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import Link from '../misc/Link';
import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';
import { createTextDocument } from '../../actions/document';
import {
    addRoutesToCanvassAssignment,
    removeRoutesFromCanvassAssignment,
    retrieveCanvassAssignment,
    retrieveCanvassAssignmentRoutes,
    updateCanvassAssignment,
} from '../../actions/canvassAssignment';


const mapStateToProps = (state, props) => {
    let assignmentList = state.canvassAssignments.assignmentList;
    let assignmentId = props.paneData.params[0];

    return {
        // TODO: Add this back at some point
        //routeList: state.routes.routesByAssignment[assignmentId],
        assignmentItem: assignmentList?
            getListItemById(assignmentList, assignmentId) : null,
    };
};

@connect(mapStateToProps)
export default class CanvassAssignmentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
        this.props.dispatch(retrieveCanvassAssignment(this.getParam(0)));
        // TODO: Add this back at some point
        //this.props.dispatch(retrieveCanvassAssignmentRoutes(this.getParam(0)));
    }

    getRenderData() {
        return {
            assignmentItem: this.props.assignmentItem,
        };
    }

    getPaneTitle(data) {
        if (data.assignmentItem && data.assignmentItem.data) {
            return data.assignmentItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.assignmentItem && data.assignmentItem.data) {
            let assignment = data.assignmentItem.data;
            let instructions = assignment.instructions;
            let routesSection = null;

            let canvassAssignmentInfo = (
                <div key="info" className="CanvassAssignmentPane-info">
                    <InfoList key="info" data={[
                        { name: 'description', value: assignment.description },
                        { name: 'dates', value: assignment.start_date + ' - ' + assignment.end_date },
                        { name: 'editLink', msgId: 'panes.canvassAssignment.editLink', onClick: this.onEditLinkClick.bind(this)},
                        ]}
                    />
                </div>
            );

            if (this.props.routeList) {
                routesSection = (
                    <Button key="routesLink"
                        className="CanvassAssignmentPane-routesLink"
                        labelMsg="panes.canvassAssignment.routesLink"
                        onClick={ this.onRoutesLinkClick.bind(this) }
                        />
                );
            }
            else {
                routesSection = <LoadingIndicator key="routesSpinner" />;
            }

            return [
                canvassAssignmentInfo,
                <div key="instructions"
                    className="CanvassAssignmentPane-instructions">
                    <Msg tagName="h3"
                        id="panes.canvassAssignment.instructions.h"/>
                    <div dangerouslySetInnerHTML={{ __html: instructions }}/>
                    <Link msgId="panes.canvassAssignment.instructions.editLink"
                        onClick={ this.onClickEditInstructions.bind(this) }/>
                </div>,

                // TODO: Add this back at some point
                //routesSection,
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    onEditLinkClick() {
        let assignment = this.props.assignmentItem.data;
        this.openPane('editcanvassassignment', assignment.id)
    }

    onRoutesLinkClick() {
        let assignmentId = this.getParam(0);
        let selectedIds = null;
        if (this.props.routeList) {
            selectedIds = this.props.routeList.items.map(i => i.data.id);
        }

        let action = createSelection('route', selectedIds, null, ids => {
            let newIds = ids.filter(id => selectedIds.indexOf(id) < 0);
            if (newIds.length) {
                this.props.dispatch(
                    addRoutesToCanvassAssignment(assignmentId, newIds));
            }

            let removedIds = selectedIds.filter(id => ids.indexOf(id) < 0);
            if (removedIds.length) {
                this.props.dispatch(
                    removeRoutesFromCanvassAssignment(assignmentId, removedIds));
            }
        });

        this.props.dispatch(action);
        this.openPane('selectassignmentroutes', action.payload.id);
    }

    onClickEditInstructions(ev) {
        let id = this.getParam(0);
        let instructions = this.props.assignmentItem.data.instructions;

        let action = createTextDocument(instructions, content => {
            let values = {
                instructions: content,
            };

            this.props.dispatch(updateCanvassAssignment(id, values));
        });

        this.props.dispatch(action);
        this.openPane('edittext', action.payload.id);
    }
}
