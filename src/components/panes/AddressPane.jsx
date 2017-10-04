import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import TagCloud from '../misc/tagcloud/TagCloud';
import { getListItemById } from '../../utils/store';
import { dmsStringFromLatLng } from '../../utils/location';
import { createSelection } from '../../actions/selection';


const mapStateToProps = (state, props) => {
    let addrList = state.addresses.addressList;
    let addrId = props.paneData.params[0];

    return {
        tagList: state.locationTags.tagList,
        addrItem: getListItemById(addrList, addrId),
    };
};

@connect(mapStateToProps)
export default class AddressPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        // TODO: Retrieve address and tags
        //this.props.dispatch(retrieveAddress(this.getParam(0)));
        //this.props.dispatch(retrieveAddressTags(this.getParam(0)));
    }

    getRenderData() {
        return {
            addrItem: this.props.addrItem,
        };
    }

    getPaneTitle(data) {
        if (data.addrItem && data.addrItem.data) {
            let addr = data.addrItem.data;
            return (addr.street || '') + ' '
                + (addr.number || '')
                + (addr.suffix || '');
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.addrItem && data.addrItem.data) {
            let addr = data.addrItem.data;
            let posLabel = dmsStringFromLatLng(addr.latitude, addr.longitude);
            let addrLabel = (addr.street || '') + ' '
                + (addr.number || '')
                + (addr.suffix || '') + ' '
                + (addr.zip || '') + ' '
                + (addr.city || '');

            let tags = [];
            if (addr.tags) {
                tags = addr.tags.map(tagId =>
                    getListItemById(this.props.tagList, tagId).data);
            }

            return [
                <InfoList key="info">
                    <InfoList.Item key="address">
                        { addrLabel }
                    </InfoList.Item>
                    <InfoList.Item key="position">
                        { posLabel }
                    </InfoList.Item>
                </InfoList>,
                <TagCloud key="tags" tags={ tags }
                    showAddButton={ true }
                    showRemoveButtons={ true }
                    onAdd={ this.onAddTag.bind(this) }
                    onRemove={ this.onRemoveTag.bind(this) }
                    />
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    onAddTag() {
        let action = createSelection('locationtag', null, null, ids => {
            // TODO: Dispatch relevant action
            //this.props.dispatch(addTagsToAddress(this.getParam(0), ids));
        });

        this.props.dispatch(action);
        this.openPane('selectlocationtags', action.payload.id);
    }


    onRemoveTag(tag) {
        // TODO: Dispatch relevant action
        //this.props.dispatch(removeTagFromAddress(this.getParam(0), tag.id));
    }
}
