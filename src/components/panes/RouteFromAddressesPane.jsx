import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import InfoList from '../misc/InfoList';
import PaneBase from './PaneBase';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { getListItemById } from '../../utils/store';
import { finishSelection } from '../../actions/selection';
import { createRoute } from '../../actions/route';


const mapStateToProps = (state, props) => {
    let selectionId = props.paneData.params[0];
    let selectionList = state.selections.selectionList;

    return {
        routeList: state.routes.routeList,
        selectionItem: getListItemById(selectionList, selectionId),
        addressById: state.addresses.addressById,
    };
};


@connect(mapStateToProps)
@injectIntl
export default class RouteFromAddressesPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.routeFromSelection.title' },
            { count: this.props.selectionItem.data.selectedIds.length });
    }

    renderPaneContent(data) {
        let selection = this.props.selectionItem.data;
        let routes = this.props.routeList.items.map(i => i.data);

        let householdCount = selection.selectedIds.reduce((sum, addrId) => {
            let addr = this.props.addressById[addrId];
            return sum + (addr? addr.household_count : 0);
        }, 0);

        let householdsLabel = this.props.intl.formatMessage(
            { id: 'panes.routeFromSelection.info.households' },
            { count: householdCount });

        let bounds = new google.maps.LatLngBounds();
        selection.selectedIds.forEach(addrId => {
            let addr = this.props.addressById[addrId];
            bounds.extend(new google.maps.LatLng(
                addr.latitude, addr.longitude));
        });

        let dist = google.maps.geometry.spherical.computeDistanceBetween(
            bounds.getSouthWest(), bounds.getNorthEast());

        let sizeLabel = this.props.intl.formatMessage(
            { id: 'panes.routeFromSelection.info.size' },
            { radius: Math.round(dist/10) * 10 });

        let content = [
            <InfoList key="info">
                <InfoList.Item key="households">
                    { householdsLabel }
                </InfoList.Item>
                <InfoList.Item key="size">
                    { sizeLabel }
                </InfoList.Item>
            </InfoList>,
            <div key="create"
                className="RouteFromAddressesPane-create">
                <Msg tagName="h3" id="panes.routeFromSelection.create.h"/>
                <Msg tagName="p" id="panes.routeFromSelection.create.desc"/>
                <Button
                    labelMsg="panes.routeFromSelection.create.createButton"
                    onClick={ this.onCreateButtonClick.bind(this) }
                    />
            </div>,
        ];

        if (routes.length) {
            let addButton = null;
            if (this.state.routeId) {
                addButton = (
                    <Button
                        labelMsg="panes.routeFromSelection.extend.addButton"
                           />
                );
            }

            content.push(
                <div key="extend"
                    className="RouteFromAddressesPane-extend">
                    <Msg tagName="h3" id="panes.routeFromSelection.extend.h"/>
                    <Msg tagName="p" id="panes.routeFromSelection.extend.desc"/>
                    <RelSelectInput name="route"
                        objects={ routes } value={ this.state.routeId }
                        onValueChange={ this.onRouteChange.bind(this) }
                        />
                    { addButton }
                </div>
            );
        }
        else {
            content.push(
                <div key="extend">
                    <Msg tagName="h3" id="panes.routeFromSelection.extend.h"/>
                    <Msg tagName="p" id="panes.routeFromSelection.extend.empty"/>
                </div>
            );
        }

        return content;
    }

    onCreateButtonClick() {
        let selection = this.props.selectionItem.data;
        this.props.dispatch(createRoute(selection.selectedIds, this.props.paneData.id));
    }

    onRouteChange(name, value) {
        this.setState({
            routeId: value,
        });
    }
}
