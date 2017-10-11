import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';
import CanvassAssignmentList from '../../lists/CanvassAssignmentList';
import { retrieveCanvassAssignments } from '../../../actions/canvassAssignment';


const mapStateToProps = state => ({
    assignmentList: state.canvassAssignments.assignmentList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllCanvassAssignmentsPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCanvassAssignments());
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    renderPaneContent(data) {
        if (this.props.assignmentList) {
            return (
                <CanvassAssignmentList
                    assignmentList={ this.props.assignmentList }
                    onItemClick={ this.onAssignmentClick.bind(this) } />
            );
        }
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="AllCanvassAssignmentsPane-addButton"
                labelMsg="panes.allCanvassAssignments.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onFiltersApply(filters) {
    }

    onAddClick() {
        this.openPane('addcanvassassignment');
    }

    onAssignmentClick(item) {
        this.openPane('canvassassignment', item.data.id);
    }
}
