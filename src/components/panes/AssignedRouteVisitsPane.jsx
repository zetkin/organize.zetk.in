import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import AddressList from '../lists/AddressList';
import Button from '../misc/Button';
import PaneBase from './PaneBase';
import ViewSwitch from '../misc/ViewSwitch';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';

import { retrieveRouteAddresses } from '../../actions/address';
import { retrieveHouseholdVisits } from '../../actions/visit';
import { retrieveAssignedRoute } from '../../actions/route';

import {
    createSelection,
    addToSelection,
    finishSelection,
    removeFromSelection
} from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let assignedRouteItem = getListItemById(state.routes.assignedRouteList,
        props.paneData.params[0]);

    let addressItems = null;
    let addressList = state.addresses.addressList;
    let addressVisitList = state.visits.addressVisitList;
    
    if (addressVisitList && addressList) {
        // TODO: filter by occurrence in route
        addressItems = state.visits.addressVisitList.items.map(i =>
            getListItemById(state.addresses.addressList, i.data.id))
            .filter(i => !!i);
    }

    return {
        assignedRouteItem,
        addressVisitList,
        addressItems,
        selectionList: state.selections.selectionList,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class AssignedRouteVisitsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
    }

    componentDidMount() {
        if (!this.props.assignedRouteItem) {
            this.props.dispatch(retrieveAssignedRoute(this.getParam(0)));
        }
        else if (!this.props.addressItems) {
            let arId = this.props.assignedRouteItem.data.id;
            let routeId = this.props.assignedRouteItem.data.route.id;

            this.props.dispatch(retrieveRouteAddresses(routeId));
            this.props.dispatch(retrieveHouseholdVisits(arId));
        }

        // TODO: Move this until after all data has been fetched?
        let action = createSelection('address');
        this.selectionId = action.payload.id;
        this.props.dispatch(action);
    }

    componentDidUpdate(prevProps, prevState) {
        let prevRouteItem = prevProps.assignedRouteItem;
        let curRouteItem = this.props.assignedRouteItem;

        if (!!curRouteItem && curRouteItem != prevRouteItem) {
            let arId = curRouteItem.data.id;
            let routeId = curRouteItem.data.route.id;

            this.props.dispatch(retrieveRouteAddresses(routeId));
            this.props.dispatch(retrieveHouseholdVisits(arId));
        }
    }

    getPaneTitle(data) {
        if (this.props.streetItem) {
            return this.props.intl.formatMessage(
                { id: 'panes.assignedRouteVisits.title' },
                { street: this.props.streetItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (this.props.addressItems) {
            // Mimic a list structure
            let addrList = {
                items: this.props.addressItems,
            };

            if (this.selectionId) {
                let selectionItem = getListItemById(this.props.selectionList, this.selectionId);
                if (selectionItem) {
                    this.selection = selectionItem.data;
                }
            }

            return [
                <AddressList key="addresses" addressList={ addrList }
                    allowBulkSelection={ true }
                    bulkSelection={ this.selection }
                    onItemSelect={ this.onItemSelect.bind(this) }
                    />
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter() {
        if (this.selection) {
            let numSelected = this.selection.selectedIds.length;

            return (
                <Button className="AssignedRouteVisitsPane-saveButton"
                    labelMsg="panes.assignedRouteVisits.saveButton"
                    labelValues={{ numSelected }}
                    onClick={ this.onSaveButtonClick.bind(this) }
                    />
            );
        }
    }

    onItemSelect(item, selected) {
        let selectionId = this.selection.id;

        if (selected) {
            this.props.dispatch(addToSelection(selectionId, item.data.id));
        }
        else {
            this.props.dispatch(removeFromSelection(selectionId, item.data.id));
        }
    }

    onSaveButtonClick() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }
}
