import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../../../misc/Button';
import InfoList from '../../../misc/InfoList';


const mapStateToProps = state => ({
    addressById: state.addresses.addressById,
});


@connect(mapStateToProps)
@injectIntl
export default class AdressSelectionPanel extends React.Component {
    render() {
        let selection = this.props.selection;

        let householdCount = selection.selectedIds.reduce((sum, addrId) => {
            let addr = this.props.addressById[addrId];
            return sum + (addr? addr.household_count : 0);
        }, 0);

        let householdsLabel = this.props.intl.formatMessage(
            { id: 'panes.allRoutes.selectionPanel.info.households' },
            { count: householdCount });

        let bounds = new google.maps.LatLngBounds();
        selection.selectedIds.forEach(addrId => {
            let addr = this.props.addressById[addrId];
            bounds.extend(new google.maps.LatLng(
                addr.latitude, addr.longitude));
        });

        let dist = google.maps.geometry.spherical.computeDistanceBetween(
            bounds.getSouthWest(), bounds.getNorthEast());

        let sizeLabel = null;
        if (dist > 0) {
            sizeLabel = this.props.intl.formatMessage(
                { id: 'panes.allRoutes.selectionPanel.info.size' },
                { radius: Math.round(dist/10) * 10 });
        }

        return (
            <div className="AddressSelectionPanel">
                <Msg tagName="h3" id="panes.allRoutes.selectionPanel.h"
                    values={{ count: selection.selectedIds.length }}/>
                {/* TODO: Add support for internationalization in InfoList */}
                <InfoList
                    key="info"
                    data={[
                        { name: 'households', value: householdsLabel },
                        { name: 'size', value: sizeLabel }
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
