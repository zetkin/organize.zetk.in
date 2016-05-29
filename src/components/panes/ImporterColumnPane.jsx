import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import SelectInput from '../forms/inputs/SelectInput';
import { getListItemById } from '../../utils/store';
import { updateImportColumn } from '../../actions/importer';

import { resolveSettingsComponent } from '../misc/importer/settings';


const TYPE_OPTIONS = {
    'unknown': 'Select column type',
    'person_data': 'Person data',
    'person_tag': 'Tag',
};


@connect(state => ({ importer: state.importer }))
export default class ImporterColumnPane extends PaneBase {
    getRenderData() {
        let tableId = this.getParam(0);
        let tableList = this.props.importer.tableSet.tableList;
        let tableItem = getListItemById(tableList, tableId);

        let columnId = this.getParam(1);
        let columnList = tableItem.data.columnList;

        return {
            columnItem: getListItemById(columnList, columnId),
        }
    }

    getPaneTitle(data) {
        if (data.columnItem && data.columnItem.data.name) {
            return 'Edit column settings: ' + data.columnItem.data.name;
        }
        else {
            return 'Edit column settings';
        }
    }

    renderPaneContent(data) {
        let column = data.columnItem.data;

        let SettingsComponent = resolveSettingsComponent(column.type);
        let settings = null;

        if (SettingsComponent) {
            // TODO: Remove openPane attribute after pane refactor
            settings = (
                <SettingsComponent config={ column.config }
                    openPane={ this.openPane.bind(this) }
                    onChangeConfig={ this.onChangeConfig.bind(this) }/>
            );
        }
        else {
            settings = "Select a column type and edit it's settings here";
        }

        return [
            <SelectInput key="type" name="type"
                options={ TYPE_OPTIONS } value={ column.type }
                onValueChange={ this.onChangeType.bind(this) }/>,
            <div key="typeSettings" className="ImporterColumnPane-settings">
                { settings }
            </div>
        ];
    }

    onChangeType(prop, value) {
        let tableId = this.getParam(0);
        let columnId = this.getParam(1);
        let props = {
            type: value,
        };

        this.props.dispatch(
            updateImportColumn(tableId, columnId, props));
    }

    onChangeConfig(config) {
        let tableId = this.getParam(0);
        let columnId = this.getParam(1);
        this.props.dispatch(
            updateImportColumn(tableId, columnId, { config }));
    }
}
