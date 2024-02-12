import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import InfoList from '../misc/InfoList';
import PaneBase from './PaneBase';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { getListItemById } from '../../utils/store';
import { clearSelection } from '../../actions/selection';
import { createRoute } from '../../actions/route';
import { addAddressesToRoute } from '../../actions/address';


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

        let boundsArray = [];
        selection.selectedIds.forEach(addrId => {
            let addr = this.props.addressById[addrId];
            boundsArray.push([addr.latitude, addr.longitude]);
        });
        const bounds = L.latLngBounds(boundsArray);

        let dist = bounds.getSouthWest().distanceTo(bounds.getNorthEast());

        let content = [
            <InfoList
                key="info"
                data={[
                    {
                        name: 'households',
                        msgId: 'panes.allRoutes.selectionPanel.info.households',
                        msgValues: { count: householdCount }
                    },
                    {
                        name: 'size',
                        msgId: dist > 0 ? 'panes.allRoutes.selectionPanel.info.size' : null,
                        msgValues: { radius: Math.round(dist/10) * 10 }
                    }
                ]}
            />,
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
            let extendButton = null;
            if (this.state.routeId) {
                extendButton = (
                    <Button
                        labelMsg="panes.routeFromSelection.extend.extendButton"
                        onClick={ this.onExtendButtonClick.bind(this) }
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
                    { extendButton }
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
        this.props.dispatch(clearSelection(selection.id));
    }

    onRouteChange(name, value) {
        this.setState({
            routeId: value,
        });
    }

    onExtendButtonClick() {
        let selection = this.props.selectionItem.data;
        this.props.dispatch(addAddressesToRoute(this.state.routeId, selection.selectedIds));
        this.props.dispatch(clearSelection(selection.id));
        this.closePane();
    }
}
