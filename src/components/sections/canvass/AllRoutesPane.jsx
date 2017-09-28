import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import AddressMap from './elements/AddressMap';
import AddressSelectionPanel from './elements/AddressSelectionPanel';
import Button from '../../misc/Button';
import LoadingIndicator from '../../misc/LoadingIndicator';
import RootPaneBase from '../RootPaneBase';
import RoutePanel from './elements/RoutePanel';
import SelectInput from '../../forms/inputs/SelectInput';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveAddresses } from '../../../actions/address';
import { retrieveLocationTags } from '../../../actions/locationTag';
import {
    clearSelection,
    createSelection
} from '../../../actions/selection';
import {
    commitRouteDrafts,
    discardRouteDrafts,
    generateRoutes,
} from '../../../actions/route';
import { getLocationAverage } from '../../../utils/location';
import { getListItemById } from '../../../utils/store';


const mapStateToProps = state => ({
    tagList: state.locationTags.tagList,
    addressList: state.addresses.addressList,
    selectionList: state.selections.selectionList,
    streetList: state.addresses.streetList,
    generator: state.routes.generator,
    routeList: state.routes.routeList,
    draftList: state.routes.draftList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllRoutesPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            mapMode: 'browse',
        };

        this.selectionId = null;
        this.filteredAddresses = this.getFilteredAddresses();
    }

    componentDidMount() {
        this.props.dispatch(retrieveAddresses());
        this.props.dispatch(retrieveLocationTags());
    }

    getRenderData() {
        let selection = null;

        if (this.selectionId) {
            let selectionList = this.props.selectionList
            let selectionItem = getListItemById(selectionList, this.selectionId);
            if (selectionItem) {
                selection = selectionItem.data;
            }
        }

        return {
            selection,
            addressList: this.props.addressList,
        };
    }

    getPaneFilters(data, filters) {
        let tagOptions = {
           '_': this.props.intl.formatMessage({
               id: 'panes.allRoutes.filters.tag.nullOption' }),
        };

        if (this.props.tagList && this.props.tagList.items) {
            this.props.tagList.items.forEach(item => {
                tagOptions[item.data.id] = item.data.title;
            });
        }

        let streetOptions = {
            '_': this.props.intl.formatMessage({
                id: 'panes.allRoutes.filters.street.nullOption' }),
        };

        if (this.props.streetList && this.props.streetList.items) {
            this.props.streetList.items.forEach(item => {
                streetOptions[item.data.id] = item.data.title;
            });
        }

        return [
            <div key="filters">
                <Msg tagName="label"
                    id="panes.allRoutes.filters.tag.label"/>
                <SelectInput name="tag" options={ tagOptions }
                    value={ filters.tag || '_' }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />

                <Msg tagName="label"
                    id="panes.allRoutes.filters.street.label"/>
                <SelectInput name="street" options={ streetOptions }
                    value={ filters.street || '_' }
                    onValueChange={ this.onFilterChange.bind(this) }
                    />
            </div>
        ];
    }

    getPaneTools(data) {
        let mapModes = {
            browse: 'panes.allRoutes.mapModes.browse',
            select: 'panes.allRoutes.mapModes.select',
        };

        return [
            <ViewSwitch key="mapMode"
                states={ mapModes } selected={ this.state.mapMode }
                onSwitch={ this.onMapStateSwitch.bind(this) }
                />,
        ]
    }

    renderPaneContent(data) {
        let selectionPanel = null;
        if (data.selection && data.selection.selectedIds.length) {
            selectionPanel = (
                <AddressSelectionPanel key="selection"
                    selection={ data.selection }
                    onAddRoute={ this.onSelectionPanelAddRoute.bind(this) }
                    onClear={ this.onSelectionPanelClear.bind(this) }
                    />
            );
        }

        let addressList = this.props.addressList;
        if (addressList && addressList.items.length) {
            return [
                <AddressMap key="map"
                    mode={ this.state.mapMode }
                    selection={ data.selection }
                    addresses={ this.filteredAddresses }
                    highlightRoute={ this.state.highlightRoute }
                    onAddressClick={ this.onMapAddressClick.bind(this) }
                    />,
                <RoutePanel key="routes"
                    contracted={ !!selectionPanel }
                    generator={ this.props.generator }
                    addressList={ this.props.addressList }
                    routeList={ this.props.routeList }
                    draftList={ this.props.draftList }
                    filteredAddressesSelector={ this.getFilteredAddresses.bind(this) }
                    onGenerate={ this.onRoutePanelGenerate.bind(this) }
                    onCommitDrafts={ this.onRoutePanelCommit.bind(this) }
                    onDiscardDrafts={ this.onRoutePanelDiscard.bind(this) }
                    onRouteClick={ this.onRoutePanelRouteClick.bind(this) }
                    onRouteMouseOver={ this.onRoutePanelRouteMouseOver.bind(this) }
                    onRouteMouseOut={ this.onRoutePanelRouteMouseOut.bind(this) }
                    />,
                selectionPanel,
            ];
        }
        else if (!addressList || addressList.isPending) {
            return (
                <div className="AllRoutesPane-loader">
                    <LoadingIndicator/>
                    <Msg id="panes.allRoutes.loader.loading"/>
                </div>
            );
        }
        else if (addressList.error) {
            return (
                <div className="AllRoutesPane-loader">
                    <Msg id="panes.allRoutes.loader.error"/>
                </div>
            );
        }
        else if (addressList.items.length == 0) {
            return (
                <div className="AllRoutesPane-loader">
                    <Msg id="panes.allRoutes.loader.empty"/>
                </div>
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.addressList != nextProps.addressList) {
            this.filteredAddresses = this.getFilteredAddresses(nextProps, nextState);
        }
    }

    getFilteredAddresses(props = this.props, state = this.state) {
        let tagId = state.filters.tag;
        let streetId = state.filters.street;
        let addresses = props.addressList?
            props.addressList.items.map(i => i.data) : [];

        if (tagId && tagId != '_') {
            addresses = addresses
                .filter(addr => addr.tags.indexOf(tagId) >= 0);
        }

        if (streetId) {
            let streetItem = getListItemById(this.props.streetList, streetId);

            if (streetItem) {
                let streetAddresses = streetItem.data.addresses;
                addresses = addresses
                    .filter(addr => streetAddresses.indexOf(addr.id) >= 0);
            }
        }

        return addresses;
    }

    onMapAddressClick(addr) {
        this.openPane('address', addr.id);
    }

    onRoutePanelGenerate(addresses, config) {
        this.props.dispatch(generateRoutes(addresses, config));
    }

    onRoutePanelCommit() {
        this.props.dispatch(commitRouteDrafts());
    }

    onRoutePanelDiscard() {
        this.props.dispatch(discardRouteDrafts());
    }

    onRoutePanelRouteClick(route) {
        this.openPane('route', route.id);
    }

    onRoutePanelRouteMouseOver(route) {
        this.setState({
            highlightRoute: route,
        });
    }

    onRoutePanelRouteMouseOut(route) {
        this.setState({
            highlightRoute: null,
        });
    }

    onMapStateSwitch(state) {
        if (state == 'select' && !this.selectionId) {
            let action = createSelection('address', null, null);

            this.selectionId = action.payload.id;
            this.props.dispatch(action);
        }

        this.setState({
            mapMode: state,
        });
    }

    onSelectionPanelAddRoute() {
        this.openPane('routefromaddresses', this.selectionId);
    }

    onSelectionPanelClear() {
        this.props.dispatch(clearSelection(this.selectionId));
    }

    onFiltersApply(filters) {
        this.filteredAddresses = this.getFilteredAddresses(this.props, { filters });
    }
}
