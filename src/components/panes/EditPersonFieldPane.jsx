import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonFieldForm from '../forms/PersonFieldForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import { getListItemById } from '../../utils/store';
import {
    updatePersonField,
    deletePersonField,
} from '../../actions/personField';


@connect(state => ({ personFields: state.personFields.fieldTypes }))
@injectIntl
export default class EditPersonFieldPane extends PaneBase {

    constructor(props) {
        super(props);

        const item = this.getRenderData().fieldItem.data.title;
        const shouldShowButton = Boolean(item);

        this.state = {
            shouldShowButton: shouldShowButton,
        };
    }
    componentDidMount() {
        super.componentDidMount();

        let fieldId = this.getParam(0);
    }

    getRenderData() {
        let fieldId = this.getParam(0);
        let fieldList = this.props.personFields;

        return {
            fieldItem: getListItemById(fieldList, fieldId),
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        if (data.fieldItem && data.fieldItem.data) {
            return data.fieldItem.data.title;
        }
        else {
            return formatMessage({ id: 'panes.editPersonField.title' });
        }
    }

    renderPaneContent(data) {
        if (data.fieldItem) {
            let field = data.fieldItem.data;

            return [
                <PersonFieldForm ref="form" field= { field }
                    onValueChange={ this.onValueChange.bind(this) }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <DeleteButton key="deleteButton"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            return null;
        }
    }

    renderPaneFooter(data) {
        if (this.state.shouldShowButton) {
            return (
                <Button className="EditPersonFieldPane-saveButton"
                    labelMsg="panes.editPersonField.saveButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        } else {
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let fieldId = this.getParam(0);
        let values = this.refs.form.getChangedValues();

        this.props.dispatch(updatePersonField(fieldId, values));
        this.closePane();
    }

    onValueChange(name, value) {
        if (name === "title") {
            this.setState({ shouldShowButton: !!value})
            this.setState({ slug: this.determineSlug(value) })
        }
    }

    determineSlug(value) {
        const fields = this.props.personFields;
    }

    onDeleteClick() {
        const fieldId = this.getParam(0);
        this.props.dispatch(deletePersonField(fieldId));
        this.closePane();
    }
}
