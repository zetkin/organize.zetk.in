import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../../misc/LoadingIndicator';
import { retrieveRouteAddresses } from '../../../../actions/address';


const mapStateToProps = (state, props) => ({
    addresses: state.addresses.addressesByRoute[props.route.id],
});


@connect(mapStateToProps)
export default class RoutePanelListItem extends React.Component {
    render() {
        let route = this.props.route;
        let labelMsg = this.props.labelMsg
            || 'panes.allRoutes.routePanel.routeList.label';

        let addressCount = <LoadingIndicator/>;
        if (this.props.addresses) {
            addressCount = (
                <Msg id="panes.allRoutes.routePanel.routeList.addresses"
                    values={{ count: this.props.addresses.length }}/>
            );
        }

        let householdCount = (
            <Msg id="panes.allRoutes.routePanel.routeList.households"
                values={{ count: route.household_count }}/>
        );

        return (
            <li key={ route.id } className="RoutePanelListItem"
                onClick={ this.props.onClick }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }>
                <h3 className="RoutePanelListItem-title">
                    <Msg id={ labelMsg } values={{ id: route.id }}/>
                </h3>
                <span className="RoutePanelListItem-addrCount">
                    { addressCount }
                </span>
                <span className="RoutePanelListItem-householdCount">
                    { householdCount }
                </span>
            </li>
        );
    }

    componentDidMount() {
        if (!this.props.addresses) {
            this.props.dispatch(retrieveRouteAddresses(this.props.route.id));
        }
    }
}
