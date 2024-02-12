import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../misc/Button';
import InfoList from '../../../misc/InfoList';


const mapStateToProps = state => ({
    addressById: state.addresses.addressById,
});


@connect(mapStateToProps)
export default class AdressSelectionPanel extends React.Component {
    render() {
        let selection = this.props.selection;

        let householdCount = selection.selectedIds.reduce((sum, addrId) => {
            let addr = this.props.addressById[addrId];
            return sum + (addr? addr.household_count : 0);
        }, 0);

        let boundsArray = [];
        selection.selectedIds.forEach(addrId => {
            let addr = this.props.addressById[addrId];
            boundsArray.push([addr.latitude, addr.longitude]);
        });
        const bounds = L.latLngBounds(boundsArray)

        let dist = bounds.getSouthWest().distanceTo(bounds.getNorthEast());

        return (
            <div className="AddressSelectionPanel">
                <Msg tagName="h3" id="panes.allRoutes.selectionPanel.h"
                    values={{ count: selection.selectedIds.length }}/>
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
                />
                <div className="AddressSelectionPanel-buttons">
                    <Button className="AddressSelectionPanel-buttonsClear"
                        labelMsg="panes.allRoutes.selectionPanel.clearButton"
                        onClick={ this.props.onClear }
                        />
                    <Button className="AddressSelectionPanel-buttonsAdd"
                        labelMsg="panes.allRoutes.selectionPanel.addButton"
                        onClick={ this.props.onAddRoute }
                        />
                </div>
            </div>
        );
    }
}
