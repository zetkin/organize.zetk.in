import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { getListItemById } from '../../utils/store';
import { stringFromAddress } from '../../utils/location';
import { createSelection } from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let routeId = props.paneData.params[0];
    let routeList = state.routes.routeList;

    return {
        streetList: state.addresses.streetList,
        addressById: state.addresses.addressById,
        routeItem: getListItemById(routeList, routeId),
    };
};

@connect(mapStateToProps)
export default class RouteContentPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.surveyItem) {
            // TODO: Retrieve route
            //this.props.dispatch(retrieveRoute(this.getParam(0)));
        }
    }

    getRenderData() {
        return {
            routeItem: this.props.routeItem,
        }
    }

    getPaneTitle(data) {
        if (data.routeItem && data.routeItem.data) {
            return data.routeItem.data.id;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.routeItem) {
            let addrItems = data.routeItem.data.addresses.map(addrId => {
                let addr = this.props.addressById[addrId];

                return (
                    <li key={ addr.id }>
                        <span className="RouteContentPane-addressName">
                            { stringFromAddress(addr) }
                        </span>
                        <span className="RouteContentPane-addressHouseholds">
                            <Msg id="panes.routeContent.addresses.item.households"
                                values={{ count: addr.household_count }}
                                />
                        </span>
                        <Button className="RouteContentPane-addressDeleteButton"
                            labelMsg="panes.routeContent.addresses.item.deleteButton"
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
                    (data.routeItem.data.addresses.indexOf(addrId) < 0));

                if (unusedAddresses.length) {
                    addrObjects.push(street);
                    unusedAddresses.forEach(addrId => {
                        addrObjects.push(this.props.addressById[addrId]);
                    });
                }
            });

            return [
                <div key="add">
                    <RelSelectInput name="address"
                        labelFunc={ o => o.title || stringFromAddress(o) }
                        showCreateOption={ false } allowNull={ false }
                        onValueChange={ this.onAddAddressChange.bind(this) }
                        objects={ addrObjects }
                        />
                </div>,
                <div key="addresses">
                    <Msg tagName="h2" id="panes.routeContent.addresses.h"/>
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
        if (value[0] == '$') {
            let meta = { streetId: value };
            let action = createSelection('address', null, null, ids => {
                console.log(ids);
            }, meta);

            this.props.dispatch(action);
            this.openPane('selectstreetaddr', action.payload.id);
        }
        else {
            // TODO: Add address
        }
    }

    onAddressDeleteClick(addr) {
        // TODO: Handle delete
    }
}
