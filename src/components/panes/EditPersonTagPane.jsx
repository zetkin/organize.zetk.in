import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonTagForm from '../forms/PersonTagForm';
import { getListItemById } from '../../utils/store';
import {
    retrievePersonTag,
    updatePersonTag,
} from '../../actions/personTag';


@connect(state => ({ personTags: state.personTags }))
export default class EditPersonTagPane extends PaneBase {
    componentDidMount() {
        let tagId = this.getParam(0);
        this.props.dispatch(retrievePersonTag(tagId));
    }

    getRenderData() {
        let tagId = this.getParam(0);
        let tagList = this.props.personTags.tagList;

        return {
            tagItem: getListItemById(tagList, tagId),
        };
    }

    getPaneTitle(data) {
        if (data.tagItem && data.tagItem.data) {
            return data.tagItem.data.title;
        }
        else {
            return 'Edit person tag';
        }
    }

    renderPaneContent(data) {
        if (data.tagItem) {
            let tag = data.tagItem.data;

            return (
                <PersonTagForm ref="form" tag= { tag }
                    onSubmit={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let tagId = this.getParam(0);
        let values = this.refs.form.getValues();

        this.props.dispatch(updatePersonTag(tagId, values));
    }
}
