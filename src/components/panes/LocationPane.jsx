import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Link from '../misc/Link';
import StaticMap from '../misc/StaticMap';
import TagCloud from '../misc/tagcloud/TagCloud'

import { 
    retrieveLocation, 
    updateLocation, 
    deleteLocation,
    createPendingLocation,
    savePendingLocation,
} from '../../actions/location';

import { 
    retrieveLocationTag,
    addTagsToLocation,
    retrieveTagsForLocation,
    removeTagFromLocation
} from '../../actions/locationTag';

import { getListItemById } from '../../utils/store';
import { createSelection } from '../../actions/selection';

@connect(state => state)
export default class LocationPane extends PaneBase {
    componentDidMount() {
        let locId = this.getParam(0);
        let locItem = getListItemById(this.props.locations.locationList, locId);

        if (!locItem) {
            this.props.dispatch(retrieveLocation(locId));
        }

        this.props.dispatch(retrieveLocationTag(locId))
        this.props.dispatch(retrieveTagsForLocation(locId))
    }

    getRenderData() {
        let locId = this.getParam(0);

        return {
            locItem: getListItemById(this.props.locations.locationList, locId)
        }
    }

    getPaneTitle(data) {
        if (data.locItem) {
            return data.locItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.locItem) {
            let location = data.locItem.data;
            let tagCloud = null;

            if (location.tagList && !location.tagList.isPending) {
                let tagList = this.props.locationTags.tagList;
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
                        { data.locItem.data.info_text }</p>
                    <Link
                        className="edit"
                        msgId="panes.locations.edit"
                        onClick={ this.onLocationEdit.bind(this) }/>

                    <StaticMap
                        location={ data.locItem.data }
                        onClick={ this.onMapClick.bind(this) }
                        />

                    <h3 className="LocationPane-tagsHeader">Tags</h3>
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
        let locationId = this.getParam(0);
        let locationList = this.props.locations.locationList;
        let locationItem = getListItemById(locationList, locationId);

        let initialPosition = {
            lat: locationItem.data.lat,
            lng: locationItem.data.lng,
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
