import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import AddressList from '../lists/AddressList';
import Button from '../misc/Button';
import PaneBase from './PaneBase';
import RadioInput from '../forms/inputs/RadioInput';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';

import { retrieveRouteAddresses } from '../../actions/address';
import { retrieveHouseholdVisits } from '../../actions/visit';
import {
    retrieveAssignedRoute,
    updateAssignedRouteVisits,
} from '../../actions/route';


import {
    createSelection,
    addToSelection,
    finishSelection,
    removeFromSelection
} from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let arId = props.paneData.params[0];
    let assignedRouteItem = getListItemById(state.routes.assignedRouteList, arId);
    let addressVisitList = state.visits.addressVisitList;

    if (addressVisitList) {
        addressVisitList = Object.assign({}, {
            items: addressVisitList.items.filter(i => i.data.ar_id == arId),
        });
    }


    return {
        assignedRouteItem,
        addressVisitList,
        selectionList: state.selections.selectionList,
        householdVisitList: state.visits.householdVisitList,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class AssignedRouteVisitsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            selectionOption: 'all',
        };
    }

    componentDidMount() {
        if (!this.props.assignedRouteItem) {
            this.props.dispatch(retrieveAssignedRoute(this.getParam(0)));
        }
        else {
            let arId = this.props.assignedRouteItem.data.id;
            let routeId = this.props.assignedRouteItem.data.route.id;

            this.props.dispatch(retrieveRouteAddresses(routeId));
            this.props.dispatch(retrieveHouseholdVisits(arId));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let prevRouteItem = prevProps.assignedRouteItem;
        let curRouteItem = this.props.assignedRouteItem;

        if (!!curRouteItem && curRouteItem != prevRouteItem) {
            let arId = curRouteItem.data.id;
            this.props.dispatch(retrieveHouseholdVisits(arId));

            let routeId = curRouteItem.data.route.id;
            this.props.dispatch(retrieveRouteAddresses(routeId));
        }

        if (curRouteItem && this.props.addressVisitList.items.length && !this.selectionId) {
            let selectedIds = this.props.addressVisitList.items
                .filter(i => i.data.state == 1)
                .map(i => i.data.id);

            let action = createSelection('address', selectedIds);
            this.selectionId = action.payload.id;
            this.props.dispatch(action);
        }
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.assignedRouteVisits.title' });
    }

    renderPaneContent(data) {
        let selectionContent = null;

        if (this.state.selectionOption == 'advanced') {
            if (this.props.addressVisitList) {
                if (this.selectionId) {
                    let selectionItem = getListItemById(this.props.selectionList, this.selectionId);
                    if (selectionItem) {
                        this.selection = selectionItem.data;
                    }
                }

                selectionContent = (
                    <div key="selection" className="AssignedRouteVisitsPane-selection">
                        <Msg tagName="h3" id="panes.assignedRouteVisits.list.h"/>
                        <Msg tagName="p" id="panes.assignedRouteVisits.list.p"/>
                        <AddressList addressList={ this.props.addressVisitList }
                            simple={ true }
                            allowBulkSelection={ true }
                            bulkSelection={ this.selection }
                            onItemSelect={ this.onItemSelect.bind(this) }
                            />
                    </div>
                );
            }
            else {
                selectionContent = (
                    <LoadingIndicator />
                );
            }
        }

        let options = {
            'all': 'panes.assignedRouteVisits.selectionOptions.all',
            'advanced': 'panes.assignedRouteVisits.selectionOptions.advanced',
        };

        return [
            <div key="options" className="AssignedRouteVisitsPane-options">
                <RadioInput options={ options } name="selectionOption"
                    idPrefix={ this.props.paneData.id }
                    optionLabelsAreMessages={ true }
                    value={ this.state.selectionOption }
                    onValueChange={ this.onSelectionOptionChange.bind(this) }
                    />
            </div>,
            selectionContent,
        ];
    }

    renderPaneFooter() {
        if (this.state.selectionOption == 'all') {
            return (
                <Button className="AssignedRouteVisitsPane-saveButton"
                    labelMsg="panes.assignedRouteVisits.saveAllButton"
                    onClick={ this.onSaveButtonClick.bind(this) }
                    />
            );
        }
        else if (this.selection) {
            let numSelected = this.selection.selectedIds.length;

            return (
                <Button className="AssignedRouteVisitsPane-saveButton"
                    labelMsg="panes.assignedRouteVisits.saveAdvancedButton"
                    labelValues={{ numSelected }}
                    onClick={ this.onSaveButtonClick.bind(this) }
                    />
            );
        }
    }

    onSelectionOptionChange(name, value) {
        this.setState({
            selectionOption: value,
        });
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
        let selectionItem = getListItemById(this.props.selectionList, this.selectionId);
        let selection = selectionItem.data;

        let arId = this.getParam(0);
        let visits = this.props.householdVisitList.items
            .map(i => i.data)
            .filter(hhv => hhv.assigned_route.id == arId)
            .map(hhv => {
                let state = 0;

                if (this.state.selectionOption == 'all') {
                    state = 1;
                }
                else if (selection.selectedIds.indexOf(hhv.address.id) >= 0) {
                    state = 1;
                }

                return {
                    household_id: hhv.household_id,
                    state: state,
                };
            });

        this.props.dispatch(updateAssignedRouteVisits(arId, visits));
        this.closePane();
    }
}
