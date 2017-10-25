import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import HouseholdVisitList from '../../lists/HouseholdVisitList';
import AddressVisitList from '../../lists/AddressVisitList';
import { retrieveHouseholdVisits } from '../../../actions/visit';


const mapStateToProps = state => ({
    addressVisitList: state.visits.addressVisitList,
    householdVisitList: state.visits.householdVisitList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllVisitsPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            viewMode: 'address',
        };
    }

    componentDidMount() {
        this.props.dispatch(retrieveHouseholdVisits());
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    getPaneTools(data) {
        /*
        let viewModes = {
            address: 'panes.allVisits.viewModes.address',
            household: 'panes.allVisits.viewModes.household',
        };

        return [
            <ViewSwitch key="viewMode"
                states={ viewModes } selected={ this.state.viewMode }
                onSwitch={ this.onViewStateSwitch.bind(this) }
                />,
        ]
        */
    }

    renderPaneContent(data) {
        if (this.state.viewMode == 'household') {
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
}
