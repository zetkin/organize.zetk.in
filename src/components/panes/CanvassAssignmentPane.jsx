import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import InfoList from '../misc/InfoList';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';
import { retrieveCanvassAssignment } from '../../actions/canvassAssignment';


const mapStateToProps = (state, props) => {
    let assignmentList = state.canvassAssignments.assignmentList;
    let assignmentId = props.paneData.params[0];

    return {
        assignmentItem: assignmentList?
            getListItemById(assignmentList, assignmentId) : null,
    };
};

@connect(mapStateToProps)
export default class CanvassAssignmentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
        this.props.dispatch(retrieveCanvassAssignment(this.getParam(0)));
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

            let canvassAssignmentInfo = (
                <div key="info" className="CanvassAssignmentPane-info">
                    <InfoList key="info" data={[
                        { name: 'description', value: assignment.description },
                        { name: 'dates', value: assignment.start_date + ' - ' + assignment.end_date },
                        ]}
                        />
                    <Button key="editLink"
                        className="CanvassAssignmentPane-editLink"
                        labelMsg="panes.canvassAssignment.editLink"
                        onClick={ this.onEditLinkClick.bind(this) }
                        />
                </div>
            );

            return [
                canvassAssignmentInfo,
                <Button key="routesLink"
                    className="CanvassAssignmentPane-routesLink"
                    labelMsg="panes.canvassAssignment.routesLink"
                    onClick={ this.onRoutesLinkClick.bind(this) }
                    />
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
        let action = createSelection('route', null, null, ids => {
            console.log(ids);
            //this.props.dispatch(addTagsToLocation(locationId, ids));
        });

        this.props.dispatch(action);
        this.openPane('selectassignmentroutes', action.payload.id);
    }
}
