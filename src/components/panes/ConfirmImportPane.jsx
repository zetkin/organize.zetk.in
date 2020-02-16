import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import Button from '../misc/Button';
import { executeImport } from '../../actions/importer';
import InfoList from '../misc/InfoList';


@connect(state => ({ importer: state.importer }))
@injectIntl
export default class ConfirmImportPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.confirmImport.title' });
    }

    getFieldID(item) {
        if (item.data.type == "id") {
            return item.data.config.origin;
        } else if (item.data.type == "person_data") {
            return item.data.config.field;
        } else if (item.data.type == "person_tag") {
            return item.data.type;
        } else {
            return "unknown_type";
        }
    }

    getTypeCount(columnList) {
        let typeCount = {};
        let items = columnList.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].data.type == "unknown") {
                continue;
            }
            // Create a reasonable key name
            let typeName = this.getFieldID(items[i]);
            if (typeName in typeCount) {
                typeCount[typeName].push(i)
            } else {
                typeCount[typeName]= [i];
            }
        }

        return typeCount;
    }

    getDuplicateTypes(typeCount) {
        // Pick out the types which have duplicates
        let duplicates = {};
        for (var typeName in typeCount) {
            if (typeCount[typeName].length > 1) {
                duplicates[typeName] = typeCount[typeName];
            }
        }

        return duplicates;
    }

    getPreviewImport(tableItem) {
        let numberRows = tableItem.data.rows.length;
        return this.props.intl.formatMessage({ id: 'panes.confirmImport.numberOfRows' }) + ": " + numberRows;
    }

    getRenderData() {
        let tableId = this.getParam(0);
        if (this.props.importer.tableSet == null) {
            return {
                valid: false,
                msgId: 'panes.confirmImport.noTable'
            };
        }
        let tableList = this.props.importer.tableSet.tableList;
        let tableItem = getListItemById(tableList, tableId);
        this.tableItem = tableItem;

        let typeCount = this.getTypeCount(tableItem.data.columnList);

        let displayMessage;
        let duplicates = this.getDuplicateTypes(typeCount);

        if (Object.keys(duplicates).length > 0) {
            return {
                valid: false,
                messageId: 'panes.confirmImport.duplicatesInfo',
                additionalInfo: JSON.stringify(duplicates)
            }
        }

        if (!("first_name" in typeCount)) {
            return {
                valid: false,
                messageId: 'panes.confirmImport.missingFirstName',
            }
        }
        if (!("last_name" in typeCount)) {
            return {
                valid: false,
                messageId: 'panes.confirmImport.missingLastName',
            }
        }

        let preview = this.getPreviewImport(tableItem);

        let result = {
            valid: true,
            warning: false,
            preview: preview
        }

        if (!("external" in typeCount)) {
            result['warning'] = true;
            result['messageId'] = 'panes.confirmImport.missingExternalIdInfo';
        }

        return result;
    }

    renderPaneContent(data) {
        if (!data.valid) {
            let infoListData = [
                { name: 'what', msgId: 'panes.confirmImport.invalidData' },
                { name: 'error', msgId: data.messageId }
            ];

            if (data.additionalInfo) {
                infoListData.push({ name: 'additionalInfo', value: data.additionalInfo });
            }

            return (<div>
                <InfoList key="info"
                    data={ infoListData }
                />
            </div>);
        } else {
            let infoListData = [];
            if (data.warning) {
                infoListData.push({ name: 'warning', msgId: data.messageId });
            }
            infoListData.push({ name: 'preview', value: data.preview });

            return (<div>
                <InfoList key="info" data={ infoListData } />
            </div>);
        }

    }

    renderPaneFooter(data) {
        if (data.valid) {
            return (
                <Button className="ConfirmImportPane-continueImportButton"
                    labelMsg="panes.confirmImport.continueImportButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        } else {
            return null;
        }
    }

    onSubmit(ev) {
        let selectedTableId = this.tableItem.data.id;
        this.props.dispatch(executeImport(selectedTableId));
        this.closePane();
    }
}
