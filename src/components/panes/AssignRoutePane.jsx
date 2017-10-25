import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { getListItemById } from '../../utils/store';
import { retrieveCanvassAssignments } from '../../actions/canvassAssignment';
import {
    createAssignedRoute,
    retrieveRoutes,
    retrieveAssignedRoutes
} from '../../actions/route';


const mapStateToProps = (state, props) => {
    return {
        assignmentList: state.canvassAssignments.assignmentList,
        assignedRouteList: state.routes.assignedRouteList,
        routeList: state.routes.routeList,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class AssignRoutePane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            assignment: null,
            route: null,
        };
    }

    componentDidMount() {
        this.props.dispatch(retrieveCanvassAssignments());
        this.props.dispatch(retrieveAssignedRoutes());
        this.props.dispatch(retrieveRoutes());
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.assignRoute.title' });
    }

    renderPaneContent(data) {
        let routeSection = null;
        let assignmentSection = <LoadingIndicator/>;

        if (this.props.assignmentList && this.props.assignmentList.items) {
            let assignments = this.props.assignmentList.items.map(i => i.data);

            assignmentSection = (
                <div key="assignment" className="AssignRoutePane-assignment">
                    <Msg tagName="h3" id="panes.assignRoute.assignment.h"/>
                    <RelSelectInput name="assignment"
                        onValueChange={ this.onValueChange.bind(this) }
                        value={ this.state.assignment }
                        objects={ assignments }
                        />
                </div>
            );
        }

        if (this.state.assignment && this.props.routeList && this.props.assignedRouteList) {
            // Get routes that are not already assigned in this assignment
            let assId = this.state.assignment;
            let routes = this.props.routeList.items
                .map(i => i.data)
                .filter(route => !this.props.assignedRouteList.items
                    .find(i => i.data.assignment.id == assId && i.data.route.id == route.id));

            routeSection = (
                <div key="route" className="AssignRoutePane-route">
                    <Msg tagName="h3" id="panes.assignRoute.route.h"/>
                    <Msg tagName="p" id="panes.assignRoute.route.info"/>
                    <RelSelectInput name="route"
                        onValueChange={ this.onValueChange.bind(this) }
                        value={ this.state.route }
                        objects={ routes }
                        />
                </div>
            )
        }

        return [
            assignmentSection,
            routeSection,
        ];
    }

    renderPaneFooter(data) {
        if (this.state.assignment && this.state.route) {
            return (
                <Button className="AssignRoutePane-saveButton"
                    labelMsg="panes.assignRoute.saveButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
    }

    onValueChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    onSubmit(ev) {
        let data = {
            assignment_id: this.state.assignment,
            route_id: this.state.route,
        };

        this.props.dispatch(createAssignedRoute(data, this.props.paneData.id));
    }
}
