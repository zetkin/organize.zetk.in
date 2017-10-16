import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import Link from '../misc/Link';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { getListItemById } from '../../utils/store';
import { stringFromAddress } from '../../utils/location';
import { createSelection } from '../../actions/selection';
import {
    addAddressesToRoute,
    removeAddressesFromRoute,
    retrieveRouteAddresses,
} from '../../actions/address';


const mapStateToProps = (state, props) => {
    let routeId = props.paneData.params[0];
    let routeList = state.routes.routeList;

    return {
        streetList: state.addresses.streetList,
        addressById: state.addresses.addressById,
        addresses: state.addresses.addressesByRoute[routeId] || [],
        routeItem: getListItemById(routeList, routeId),
    };
};

@connect(mapStateToProps)
@injectIntl
export default class RouteContentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.surveyItem) {
            // TODO: Retrieve route
            //this.props.dispatch(retrieveRoute(this.getParam(0)));
        }

        if (!this.props.addresses) {
            this.props.dispatch(retrieveRouteAddresses(this.getParam(0)));
        }
    }

    getRenderData() {
        return {
            routeItem: this.props.routeItem,
            addresses: this.props.addresses,
        }
    }

    getPaneTitle(data) {
        if (data.routeItem && data.routeItem.data) {
            return this.props.intl.formatMessage(
                { id: 'panes.routeContent.title' },
                { id: data.routeItem.data.id });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.routeItem) {
            let addrItems = data.addresses.map(addrId => {
                let addr = this.props.addressById[addrId];

                return (
                    <li key={ addr.id }>
                        <h4 className="RouteContentPane-addressName">
                            { stringFromAddress(addr) }
                        </h4>
                        <span className="RouteContentPane-addressHouseholds">
                            <Msg id="panes.routeContent.addresses.item.households"
                                values={{ count: addr.household_count }}
                                />
                        </span>
                        <Link className="RouteContentPane-addressDeleteButton"
                            msgId="panes.routeContent.addresses.item.deleteButton"
                            onClick={ this.onAddressDeleteClick.bind(this, addr) }
                            />
                    </li>
                );
            });

            let prevStreet = null;
            let addrObjects = [];
            this.props.streetList.items.forEach(streetItem => {
                let street = streetItem.data;

                // filter out addresses that are already in this route
                let unusedAddresses = street.addresses.filter(addrId =>
                    (data.addresses.indexOf(addrId) < 0));

                if (unusedAddresses.length) {
                    addrObjects.push(street);
                    unusedAddresses.forEach(addrId => {
                        addrObjects.push(this.props.addressById[addrId]);
                    });
                }
            });

            return [
                <div key="add">
                    <Msg tagName="h3" id="panes.routeContent.add.h"/>
                    <Msg tagName="p" id="panes.routeContent.add.p"/>
                    <RelSelectInput name="address"
                        labelFunc={ o => o.title || stringFromAddress(o) }
                        minFilterLength={ 3 }
                        showCreateOption={ false } allowNull={ false }
                        onValueChange={ this.onAddAddressChange.bind(this) }
                        objects={ addrObjects }
                        />
                </div>,
                <div key="addresses" className="RouteContentPane-addresses">
                    <Msg tagName="h3" id="panes.routeContent.addresses.h"/>
                    <ul className="RouteContentPane-addressList">
                        { addrItems }
                    </ul>
                </div>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onAddAddressChange(name, value) {
        let routeId = this.getParam(0);

        if (value[0] == '$') {
            let meta = { streetId: value };
            let action = createSelection('address', null, null, ids => {
                this.props.dispatch(addAddressesToRoute(routeId, ids));
            }, meta);

            this.props.dispatch(action);
            this.openPane('selectstreetaddr', action.payload.id);
        }
        else {
            this.props.dispatch(addAddressesToRoute(routeId, [value]));
        }
    }

    onAddressDeleteClick(addr) {
        let routeId = this.getParam(0);
        this.props.dispatch(removeAddressesFromRoute(routeId, [addr.id]));
    }
}
