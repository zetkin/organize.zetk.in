import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let assignmentList = state.canvassAssignments.assignmentList;
    let assignmentId = props.paneData.params[0];

    return {
        assignmentItem: getListItemById(assignmentList, assignmentId),
    };
};

@connect(mapStateToProps)
export default class CanvassAssignmentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
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

            return [
                <InfoList key="info">
                    <InfoList.Item key="description">
                        { assignment.description }
                    </InfoList.Item>
                    <InfoList.Item key="dates">
                        { assignment.start_date } - { assignment.end_date }
                    </InfoList.Item>
                </InfoList>,
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }
}
