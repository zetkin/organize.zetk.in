import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import SelectInput from '../forms/inputs/SelectInput';
import { getListItemById } from '../../utils/store';
import { updateImportColumn } from '../../actions/importer';

import { resolveSettingsComponent } from '../misc/importer/settings';


@connect(state => ({ importer: state.importer }))
@injectIntl
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
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.importerColumn.title' },
            { column: data.columnItem.data.name });
    }

    renderPaneContent(data) {
        let column = data.columnItem.data;

        let SettingsComponent = resolveSettingsComponent(column.type);
        let settings = null;

        const msg = id => this.props.intl.formatMessage({ id });
        const TYPE_OPTIONS = {
            'unknown': msg('panes.importerColumn.typeOptions.unknown'),
            'person_data': msg('panes.importerColumn.typeOptions.personData'),
            'person_tag': msg('panes.importerColumn.typeOptions.personTag'),
            'person_field': msg('panes.importerColumn.typeOptions.personField'),
        };

        if (SettingsComponent) {
            // TODO: Remove openPane attribute after pane refactor
            settings = (
                <SettingsComponent config={ column.config }
                    openPane={ this.openPane.bind(this) }
                    onChangeConfig={ this.onChangeConfig.bind(this) }/>
            );
        }
        else {
            settings = (
                <Msg id="panes.importerColumn.instructions"/>
            );
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
