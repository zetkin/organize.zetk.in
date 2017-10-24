import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import HouseholdVisitList from '../../lists/HouseholdVisitList';
import AddressVisitList from '../../lists/AddressVisitList';
import AssignedRouteList from '../../lists/AssignedRouteList';
import { retrieveHouseholdVisits } from '../../../actions/visit';
import { retrieveAssignedRoutes } from '../../../actions/route';


const mapStateToProps = state => ({
    addressVisitList: state.visits.addressVisitList,
    householdVisitList: state.visits.householdVisitList,
    assignedRouteList: state.routes.assignedRouteList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllVisitsPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            viewMode: 'route',
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.viewMode != this.state.viewMode) {
            if (nextState.viewMode == 'route') {
                this.props.dispatch(retrieveAssignedRoutes());
            }
            else if (this.state.viewMode == 'route') {
                this.props.dispatch(retrieveHouseholdVisits());
            }
        }
    }

    componentDidMount() {
        this.props.dispatch(retrieveAssignedRoutes());
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    getPaneTools(data) {
        let viewModes = {
            route: 'panes.allVisits.viewModes.route',
            address: 'panes.allVisits.viewModes.address',
            // TODO: Finish and re-enable this
            //household: 'panes.allVisits.viewModes.household',
        };

        return [
            <ViewSwitch key="viewMode"
                states={ viewModes } selected={ this.state.viewMode }
                onSwitch={ this.onViewStateSwitch.bind(this) }
                />,
        ]
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
        else if (this.state.viewMode == 'household') {
            if (this.props.householdVisitList) {
                return (
                    <HouseholdVisitList
                        visitList={ this.props.householdVisitList }
                        />
                );
            }
        }
        else if (this.state.viewMode == 'address') {
            if (this.props.addressVisitList) {
                return (
                    <AddressVisitList
                        visitList={ this.props.addressVisitList }
                        />
                );
            }
        }
    }

    onViewStateSwitch(state) {
        this.setState({
            viewMode: state,
        });
    }

    onFiltersApply(filters) {
    }

    onAssignedRouteClick(item) {
        this.openPane('assignedroute', item.data.id);
    }
}
