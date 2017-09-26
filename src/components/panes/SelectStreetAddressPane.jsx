import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import AddressList from '../lists/AddressList';
import Button from '../misc/Button';
import PaneBase from './PaneBase';
import ViewSwitch from '../misc/ViewSwitch';
import { getListItemById } from '../../utils/store';

import {
    addToSelection,
    finishSelection,
    removeFromSelection
} from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let selectionId = props.paneData.params[0];
    let selectionList = state.selections.selectionList;
    let selectionItem = getListItemById(selectionList, selectionId);

    let addresses = null;
    let streetItem = null;
    if (selectionItem) {
        let streetId = selectionItem.data.meta.streetId;
        streetItem = getListItemById(state.addresses.streetList, streetId);

        addresses = streetItem.data.addresses
            .map(addrId => state.addresses.addressById[addrId]);
    }

    return {
        streetItem,
        selectionItem,
        addresses,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class SelectStreetAddressPane extends PaneBase {
    constructor(props) {
        super(props)

        this.state = {
            viewState: 'all',
        };
    }

    componentDidMount() {
        super.componentDidMount();

        if (!this.props.selectionItem) {
            this.closePane();
        }
    }

    getPaneTitle(data) {
        if (this.props.streetItem) {
            return this.props.intl.formatMessage(
                { id: 'panes.selectStreetAddress.title' },
                { street: this.props.streetItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (this.props.streetItem) {
            let viewState = this.state.viewState;
            let viewStates = {
                'all': 'panes.selectStreetAddress.views.all',
                'even': 'panes.selectStreetAddress.views.even',
                'odd': 'panes.selectStreetAddress.views.odd',
            };

            // Mimic a list structure
            let addrList = {
                items: this.props.addresses.map(addr => ({
                    data: addr,
                })),
            };

            if (viewState !== 'all') {
                addrList.items = addrList.items.filter(item => {
                    let num = parseInt(item.data.number);
                    let mod = num % 2;

                    if (viewState == 'odd' && mod == 1) {
                        return true;
                    }
                    else if (viewState == 'even' && mod == 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }

            return [
                <ViewSwitch key="viewSwitch"
                    states={ viewStates } selected={ viewState }
                    onSwitch={ this.onViewSwitch.bind(this) }
                    />,
                <AddressList key="addresses" addressList={ addrList }
                    allowBulkSelection={ true }
                    bulkSelection={ this.props.selectionItem.data }
                    onItemSelect={ this.onItemSelect.bind(this) }
                    />
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    renderPaneFooter() {
        let numSelected = this.props.selectionItem.data.selectedIds.length;
        return (
            <Button className="SelectStreetAddressPane-saveButton"
                labelMsg="panes.selectStreetAddress.saveButton"
                labelValues={{ numSelected }}
                onClick={ this.onSaveButtonClick.bind(this) }
                />
        );
    }

    onItemSelect(item, selected) {
        let selectionId = this.getParam(0);

        if (selected) {
            this.props.dispatch(addToSelection(selectionId, item.data.id));
        }
        else {
            this.props.dispatch(removeFromSelection(selectionId, item.data.id));
        }
    }

    onViewSwitch(state) {
        this.setState({
            viewState: state,
        });
    }

    onSaveButtonClick() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }
}
