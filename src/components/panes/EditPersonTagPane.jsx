import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonTagForm from '../forms/PersonTagForm';
import Button from '../misc/Button';
import { getListItemById } from '../../utils/store';
import {
    retrievePersonTag,
    updatePersonTag,
} from '../../actions/personTag';


@connect(state => ({ personTags: state.personTags }))
@injectIntl
export default class EditPersonTagPane extends PaneBase {

    constructor(props) {
        super(props);

        const item = this.getRenderData().tagItem.data.title;
        const shouldShowButton = Boolean(item);

        this.state = {
            shouldShowButton: shouldShowButton,
        };
    }
    componentDidMount() {
        super.componentDidMount();

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
        const formatMessage = this.props.intl.formatMessage;

        if (data.tagItem && data.tagItem.data) {
            return data.tagItem.data.title;
        }
        else {
            return formatMessage({ id: 'panes.editPersonTag.title' });
        }
    }

    renderPaneContent(data) {
        if (data.tagItem) {
            let tag = data.tagItem.data;

            return (
                <PersonTagForm ref="form" tag= { tag }
                onValueChange={ this.onValueChange.bind(this) }
                    onSubmit={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    renderPaneFooter(data) {
        if (this.state.shouldShowButton) {
        return (
            <Button className="EditPersonTagPane-saveButton"
                labelMsg="panes.editPersonTag.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
        } else {
    return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let tagId = this.getParam(0);
        let values = this.refs.form.getValues();

        this.props.dispatch(updatePersonTag(tagId, values));
        this.closePane();
    }

    onValueChange(name, value) {
        if (name === "title") {
            this.setState({ shouldShowButton: Boolean(value) })
        }
    }
}
