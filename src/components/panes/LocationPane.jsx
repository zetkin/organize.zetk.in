import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import PaneBase from './PaneBase';
import Link from '../misc/Link';
import StaticMap from '../misc/StaticMap';
import TagCloud from '../misc/clouds/TagCloud'

import {
    retrieveLocation,
    updateLocation,
    deleteLocation,
    createPendingLocation,
    savePendingLocation,
} from '../../actions/location';

import {
    addTagsToLocation,
    retrieveTagsForLocation,
    removeTagFromLocation
} from '../../actions/locationTag';

import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';


const mapStateToProps = (state, props) => ({
    locItem: getListItemById(
                state.locations.locationList,
                props.paneData.params[0]),
    locationTags: state.locationTags,
});

@connect(mapStateToProps)
export default class LocationPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let locId = this.getParam(0);
        const { locItem } = this.props;

        if (!locItem) {
            this.props.dispatch(retrieveLocation(locId));
        }

        this.props.dispatch(retrieveTagsForLocation(locId))
    }

    getPaneTitle(data) {
        const { locItem } = this.props;
        if (locItem) {
            return locItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const { locItem, locationTags } = this.props;
        if (locItem) {
            let location = locItem.data;
            let tagCloud = null;

            if (location.tagList && !location.tagList.isPending) {
                let tagList = locationTags.tagList;
                let tags = location.tagList.items
                    .map(i => getListItemById(tagList, i.data.id))
                    .filter(i => i !== null)
                    .map(i => i.data);

                tagCloud = (
                    <TagCloud tags={ tags }
                        showAddButton={ true }
                        showEditButtons={ false }
                        showRemoveButtons={ true }
                        onAdd={ this.onAddTag.bind(this) }
                        onRemove={ this.onRemoveTag.bind(this) }
                        />
                );
            }

            return (
                <div>
                    <p className="LocationPane-desc">
                        { locItem.data.info_text }</p>
                    <Link
                        className="edit"
                        msgId="panes.locations.description.editLink"
                        onClick={ this.onLocationEdit.bind(this) }/>

                    <StaticMap
                        location={ locItem.data }
                        onClick={ this.onMapClick.bind(this) }
                        />

                    <h3 className="LocationPane-tagsHeader">
                        <Msg id="panes.locations.tags"/>
                    </h3>
                    { tagCloud }
                </div>
            );
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onMapClick() {
        const locationId = this.getParam(0);
        const { locItem } = this.props;

        let initialPosition = {
            lat: locItem.data.lat,
            lng: locItem.data.lng,
        };

        let action = createPendingLocation(initialPosition, pos => {
            this.props.dispatch(updateLocation(locationId, pos));
        });

        this.props.dispatch(action);
        this.openPane('placelocation', action.payload.id);
    }

    onLocationEdit() {
        let locationId = this.getParam(0);
        this.openPane('editlocation', locationId);
    }

    onAddTag() {
        let locationId = this.getParam(0);
        let action = createSelection('locationtag', null, null, ids => {
            this.props.dispatch(addTagsToLocation(locationId, ids));
        });

        this.props.dispatch(action);
        this.openPane('selectlocationtags', action.payload.id);
    }

    onRemoveTag(tag) {
        let locationId = this.getParam(0);
        this.props.dispatch(removeTagFromLocation(locationId, tag.id));
    }
}
