import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonViewColumnForm from '../forms/PersonViewColumnForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import { getListItemById } from '../../utils/store';
import {
    removePersonViewColumn,
    retrievePersonViewColumns,
    updatePersonViewColumn,
} from '../../actions/personView';


const mapStateToProps = (state, props) => {
    const viewId = props.paneData.params[0];
    const columnId = props.paneData.params[1];
    const viewItem = getListItemById(state.personViews.viewList, viewId);

    return {
        columnItem: getListItemById(state.personViews.columnsByView[viewId], columnId),
    }
};


@connect(mapStateToProps)
@injectIntl
export default class EditViewColumnPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.columnItem) {
            const viewId = this.getParam(0);
            this.props.dispatch(retrievePersonViewColumns(viewId));
        }
    }

    getPaneTitle() {
        const formatMessage = this.props.intl.formatMessage;
        if (this.props.columnItem && this.props.columnItem.data) {
            return formatMessage({ id: 'panes.editViewColumn.title' },
                { title: this.props.columnItem.data.title });
        }
    }


    renderPaneContent(data) {
        if (this.props.columnItem && this.props.columnItem.data) {
            const column = this.props.columnItem.data;

            return [
                <PersonViewColumnForm key="form"
                    ref="form" column={ column }
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
        return (
            <Button className="EditViewColumnPane-saveButton"
                labelMsg="panes.editViewColumn.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const viewId = this.getParam(0);
        const columnId = this.getParam(1);
        const values = this.refs.form.getValues();

        this.props.dispatch(updatePersonViewColumn(viewId, columnId, values));
        this.closePane();
    }

    onDeleteClick() {
        const viewId = this.getParam(0);
        const columnId = this.getParam(1);
        this.props.dispatch(removePersonViewColumn(viewId, columnId));
        this.closePane();
    }
}
