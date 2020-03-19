import React from 'react';
import isEmail from 'validator/lib/isEmail';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import Button from '../misc/Button';
import { executeImport } from '../../actions/importer';
import InfoList from '../misc/InfoList';

const genderOptions = new Set(['f','m','o','_']);

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
            if(typeName == "person_tag") {
                // Multiple person_tag columns are allowed
                continue;
            }
            if (typeCount[typeName].length > 1) {
                duplicates[typeName] = typeCount[typeName];
            }
        }

        return duplicates;
    }

    getPreviewImport(tableItem) {
        let numberRows = tableItem.data.rows.length;
        return this.props.intl.formatMessage(numberOfRows + ' ' + { id: 'panes.confirmImport.numberOfRows' });
    }

    validateRows(rows, columns) {
        for (const row of rows) {
            if(row.values.length != columns.length) {
                return ['panes.confirmImport.inconsistentRow'];
            }

            for (let i = 0; i < columns.length; i++) {
                const column = this.getFieldID(columns[i]);
                switch(column) {
                    case 'email':
                        if(!isEmail(row.values[i]) && row.values[i] != '') {
                            return 'panes.confirmImport.invalidEmail';
                        }
                        break;
                    case 'gender':
                        if(!genderOptions.has(row.values[i]) && row.values[i] != '') {
                            return 'panes.confirmImport.invalidGender';
                        }
                        break;
                    case 'first_name':
                    case 'last_name':
                    case 'city':
                        if(row.values[i].length > 50) {
                            return 'panes.confirmImport.' + column + 'TooLong';
                        }
                        break;
                    case 'phone':
                    case 'alt_phone':
                        if(row.values[i].length > 60) {
                            return 'panes.confirmImport.' + column + 'TooLong';
                        }
                        if(!row.values[i].match(/^[0-9\-\+ ]*$/)) {
                            return 'panes.confirmImport.' + column + 'Invalid';
                        }
                        break;
                    case 'zip_code':
                        if(row.values[i].length > 10) {
                            return 'panes.confirmImport.' + column + 'TooLong';
                        }
                        break;
                    case 'external':
                        if(row.values[i].length > 12) {
                            return 'panes.confirmImport.' + column + 'TooLong';
                        }
                        break;
                    case 'zetkin':
                        if(!row.values[i].match(/^[0-9]*$/)) {
                            return 'panes.confirmImport.' + column + 'Invalid';
                        }
                    case 'co_address':
                    case 'street_address':
                        if(row.values[i].length > 120) {
                            'panes.confirmImport.' + column + 'TooLong';
                        }
                        break;
                }
            }

        }
        return null;
    }

    getRenderData() {
        const tableId = this.getParam(0);
        if (this.props.importer.tableSet == null) {
            return {
                valid: false,
                msgId: 'panes.confirmImport.noTable'
            };
        }
        const tableList = this.props.importer.tableSet.tableList;
        const tableItem = getListItemById(tableList, tableId);
        this.tableItem = tableItem;

        const typeCount = this.getTypeCount(tableItem.data.columnList);

        const duplicates = this.getDuplicateTypes(typeCount);

        if (Object.keys(duplicates).length > 0) {
            return {
                valid: false,
                messageId: 'panes.confirmImport.duplicatesInfo',
                additionalInfo: JSON.stringify(duplicates)
            }
        } 

        if(!((typeCount.external || typeCount.zetkin) || (typeCount.first_name && typeCount.last_name))) {
            return {
                valid: false,
                messageId: 'panes.confirmImport.missingIdOrName',
            }
        }

        const error = this.validateRows(tableItem.data.rows, tableItem.data.columnList.items);
        if (error) {
            return {
                valid: false,
                messageId: error,
            }
        }

        let preview = this.getPreviewImport(tableItem);

        let result = {
            valid: true,
            warning: false,
            preview: preview
        }

        let messages = [];

        if (!("first_name" in typeCount)) {
            result.warning = true;
            messages.push('panes.confirmImport.missingFirstName');
        }

        if (!("last_name" in typeCount)) {
            result.warning = true;
            messages.push('panes.confirmImport.missingLastName');
        }

        if (!("external" in typeCount || "zetkin" in typeCount)) {
            result.warning = true;
            messages.push('panes.confirmImport.missingIdInfo');
        }

        if ("zetkin" in typeCount) {
            result.warning = true;
            messages.push('panes.confirmImport.zetkinIdWarning');
        }

        if(result.warning) {
            result.messages = messages;
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
                for(const message of data.messages) {
                    infoListData.push({ name: 'warning', msgId: message });
                }
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
