import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import AddressMap from '../sections/canvass/elements/AddressMap';
import PaneBase from './PaneBase';
import Button from '../misc/Button';
import Link from '../misc/Link';
import RouteList from '../lists/RouteList';
import { getListItemById } from '../../utils/store';
import {
    addToSelection,
    finishSelection,
    removeFromSelection,
} from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let selectionList = state.selections.selectionList;
    let selectionId = props.paneData.params[0];

    return {
        routeList: state.routes.routeList,
        addressList: state.addresses.addressList,
        addressesByRoute: state.addresses.addressesByRoute,
        selectionItem: getListItemById(selectionList, selectionId),
    }
};

@connect(mapStateToProps)
@injectIntl
export default class SelectAssignmentRoutesPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            highlightAddresses: null,
            addressSelection: this.mockAddressSelection(props.selectionItem),
        };

        this.addresses = this.props.addressList.items.map(i => i.data);
    }

    getRenderData() {
        return {
            routeList: this.props.routeList,
            selection: this.props.selectionItem.data,
        };
    }

    getPaneTitle(data) {
        return null;
    }

    renderPaneContent(data) {
        return [
            <AddressMap key="map" mode="browse"
                selection={ this.state.addressSelection }
                addresses={ this.addresses }
                highlightAddresses={ this.state.highlightAddresses }
                />,
            <RouteList key="list"
                routeList={ data.routeList }
                allowBulkSelection={ true } bulkSelection={ data.selection }
                onItemSelect={ this.onItemSelect.bind(this) }
                onItemMouseOut={ this.onItemMouseOut.bind(this) }
                onItemMouseOver={ this.onItemMouseOver.bind(this) }
                />,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="SelectAssignmentRoutesPane-saveButton"
                labelMsg="panes.selectAssignmentRoutes.saveButton"
                onClick={ this.onSaveButtonClick.bind(this) }/>
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.addressList != nextProps.addressList) {
            this.addresses = nextProps.addressList.items.map(i => i.data);
        }

        if (this.props.selectionItem != nextProps.selectionItem) {
            this.setState({
                addressSelection: this.mockAddressSelection(nextProps.selectionItem),
            });
        }
    }

    onItemMouseOver(item) {
        this.setState({
            highlightAddresses: this.props.addressesByRoute[item.data.id],
        });
    }

    onItemMouseOut(item) {
        this.setState({
            highlightAddresses: null,
        });
    }

    onItemSelect(item, selected) {
        let selection = this.props.selectionItem.data;
        let id = item.data.id;

        if (selected) {
            this.props.dispatch(addToSelection(selection.id, id));
        }
        else {
            this.props.dispatch(removeFromSelection(selection.id, id));
        }
    }

    onSaveButtonClick() {
        let selection = this.props.selectionItem.data;

        this.props.dispatch(finishSelection(selection.id));
        this.closePane();
    }

    mockAddressSelection(routeSelectionItem) {
        let addressIds = [];
        routeSelectionItem.data.selectedIds.forEach(routeId => {
            let routeItem = getListItemById(this.props.routeList, routeId);
            addressIds = addressIds.concat(routeItem.data.addresses);
        });

        return {
            selectedIds: addressIds,
        };
    }
}
