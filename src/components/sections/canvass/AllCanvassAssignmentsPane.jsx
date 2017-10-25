import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../../misc/Button';
import ViewSwitch from '../../misc/ViewSwitch';
import RootPaneBase from '../RootPaneBase';
import CanvassAssignmentList from '../../lists/CanvassAssignmentList';
import AssignedRouteList from '../../lists/AssignedRouteList';
import { retrieveCanvassAssignments } from '../../../actions/canvassAssignment';
import { retrieveAssignedRoutes } from '../../../actions/route';


const mapStateToProps = state => ({
    assignmentList: state.canvassAssignments.assignmentList,
    assignedRouteList: state.routes.assignedRouteList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllCanvassAssignmentsPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            viewMode: 'assignment',
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.viewMode != this.state.viewMode) {
            if (nextState.viewMode == 'route') {
                this.props.dispatch(retrieveAssignedRoutes());
            }
            else if (this.state.viewMode == 'route') {
                this.props.dispatch(retrieveCanvassAssignments());
            }
        }
    }

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
        if (this.state.viewMode == 'route') {
            if (this.props.assignedRouteList) {
                return (
                    <AssignedRouteList
                        assignedRouteList={ this.props.assignedRouteList }
                        onItemClick={ this.onAssignedRouteClick.bind(this) }
                        />
                );
            }
        }
        else {
            if (this.props.assignmentList) {
                return (
                    <CanvassAssignmentList
                        assignmentList={ this.props.assignmentList }
                        onItemClick={ this.onAssignmentClick.bind(this) } />
                );
            }
        }
    }

    getPaneTools(data) {
        let viewModes = {
            assignment: 'panes.allCanvassAssignments.viewModes.assignment',
            route: 'panes.allCanvassAssignments.viewModes.route',
        };

        return [
            <ViewSwitch key="viewMode"
                states={ viewModes } selected={ this.state.viewMode }
                onSwitch={ this.onViewStateSwitch.bind(this) }
                />,
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

    onAssignedRouteClick(item) {
        this.openPane('assignedroute', item.data.id);
    }

    onViewStateSwitch(state) {
        this.setState({
            viewMode: state,
        });
    }
}
