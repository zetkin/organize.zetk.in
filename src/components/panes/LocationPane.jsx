import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import StaticMap from '../misc/StaticMap';
import TagCloud from '../misc/tagcloud/TagCloud'

import { 
    retrieveLocation, 
    updateLocation, 
    deleteLocation,
    setPendingLocation, 
    clearPendingLocation 
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

        if (locItem) {
            this.props.dispatch(setPendingLocation(locItem.data));
        }
        else {
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
                    <p>{ data.locItem.data.info_text }</p>
                    <a onClick={ this.onLocationEdit.bind(this) }>Edit</a>

                    <StaticMap location={ data.locItem.data }/>

                    <h3>Tags</h3>
                    { tagCloud }
                </div>
            );
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
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

    onCloseClick() {
        this.props.dispatch(clearPendingLocation());
        this.closePane();
    }
}
