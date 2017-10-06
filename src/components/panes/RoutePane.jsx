import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Link from '../misc/Link';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import TagCloud from '../misc/tagcloud/TagCloud';
import { getListItemById } from '../../utils/store';
import { retrieveRouteAddresses } from '../../actions/address';


const mapStateToProps = (state, props) => {
    let routeId = props.paneData.params[0];
    let list = state.routes.routeList;
    let item = getListItemById(list, routeId);

    let addressIds = state.addresses.addressesByRoute[routeId];
    let addresses = null;
    if (item && item.data && addressIds) {
        addresses = addressIds.map(id => state.addresses.addressById[id]);
    }

    return {
        routeItem: item,
        routeAddresses: addresses,
        tagList: state.locationTags.tagList,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class RoutePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        // TODO: Retrieve route data
        //this.props.dispatch(retrieveRoute(this.getParam(0)));
        this.props.dispatch(retrieveRouteAddresses(this.getParam(0)));
    }

    getRenderData() {
        return {
            routeItem: this.props.routeItem,
        };
    }

    getPaneTitle(data) {
        if (data.routeItem && data.routeItem.data) {
            return this.props.intl.formatMessage({ id: 'panes.route.title' },
                { id: data.routeItem.data.id });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const formatMessage = this.props.intl.formatMessage;

        if (data.routeItem) {
            let route = data.routeItem.data;
            let addressCount = this.props.routeAddresses?
                this.props.routeAddresses.length : 0;

            let createInfoItem = (name, content) => {
                let className = 'RoutePane-' + name;

                return (
                    <li key={ name } className={ className }>
                        { content }
                    </li>
                );
            };

            let tagInfo = null;

            if (this.props.routeAddressItems) {
                let tagIdsInRoute = [];

                this.props.routeAddressItems.forEach(ai => {
                    // TODO: Use tags retrieved elsewhere
                    if (ai.data.tags) {
                        ai.data.tags.forEach(tagId => {
                            if (tagIdsInRoute.indexOf(tagId) < 0) {
                                tagIdsInRoute.push(tagId);
                            }
                        });
                    }
                });

                if (tagIdsInRoute.length) {
                    let tagsInRoute = tagIdsInRoute.map(id =>
                        getListItemById(this.props.tagList, id).data);

                    tagInfo = (
                        <TagCloud tags={ tagsInRoute }
                            showAddButton={ false } showRemoveButtons={ false }
                            />
                    );
                }
                else {
                    tagInfo = (
                        <Msg id="panes.route.tags.emptyLabel"/>
                    );
                }
            }

            let routeInfo = (
                <div key="info"className="RoutePane-info">
                    <ul key="infoList" className="RoutePane-infoList">
                        { createInfoItem('address_count',
                            formatMessage(
                                { id: 'panes.route.info.addresses' },
                                { count: addressCount })) }

                        { createInfoItem('household_count',
                            formatMessage(
                                { id: 'panes.route.info.households' },
                                { count: route.household_count})) }
                    </ul>
                    <Button
                        className="RoutePane-editLink"
                        labelMsg="panes.route.editLink"
                        onClick={ this.onClickEdit.bind(this) }
                        />
                </div>
            );

            return [
                routeInfo,
                <div key="owner" className="RoutePane-owner">
                    <Msg tagName="h3" id="panes.route.owner.h"/>
                    <PersonSelectWidget person={ route.owner }
                        onSelect={ this.onOwnerSelect.bind(this) }/>
                </div>,

                <div key="tags" className="RoutePane-tags">
                    <Msg tagName="h3" id="panes.route.tags.h"/>
                    { tagInfo }
                </div>
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    onClickEdit(ev) {
        this.openPane('routecontent', this.getParam(0));
    }

    onOwnerSelect(person) {
        // TODO: Perform action
        /*
        let routeId = this.getParam(0);
        if (person) {
            this.props.dispatch(setRouteOwner(routeId, person.id));
        }
        else {
            this.props.dispatch(updateRoute(routeId, { owner_id: null }));
        }
        */
    }
}
