import React from 'react';
import isEmail from 'validator/lib/isEmail';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import getDate from '../../utils/getDate';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import Button from '../misc/Button';
import { executeImport } from '../../actions/importer';
import InfoList from '../misc/InfoList';

const genderOptions = new Set(['f','m','o','_']);

@connect(state => ({ importer: state.importer, 
                     fieldTypes: state.personFields.fieldTypes }))
@injectIntl
export default class ConfirmImportPane extends PaneBase {
    getPaneTitle(data) {
        if(data.valid) {
            return this.props.intl.formatMessage({ id: 'panes.confirmImport.confirmTitle' });
        } else {
            return this.props.intl.formatMessage({ id: 'panes.confirmImport.errorTitle' });
        }
    }

    getFieldID(item) {
        if (item.data.type == "id") {
            return { type: item.data.config.origin, name: item.data.config.origin };
        } else if (item.data.type == "person_data") {
            return { type: item.data.config.field, name: item.data.config.field };
        } else if (item.data.type == "person_tag") {
            return { type: item.data.type };
        } else if (item.data.type == "person_field") {
            const field = this.props.fieldTypes.items.find((f) => 
                f.data.id == item.data.config.field_id);
            return { type: field.data.type, name: 'field.' + item.data.config.field_id };
        } else {
            return { type: "unknown_type" };
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
            let column = this.getFieldID(items[i]);
            if (column.name && column.name in typeCount) {
                typeCount[column.name].push(i)
            } else if(column.name) {
                typeCount[column.name]= [i];
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
        return numberRows + ' ' + this.props.intl.formatMessage({ id: 'panes.confirmImport.numberOfRows' });
    }

    addError(column, row, msgSuffix) {
        if(this.props.importer.tableSet.tableList.items[0].data.useFirstRowAsHeader) {
            // If first row is header, adjust the row
            row = row + 1;
        }
        if (column in this.errors) {
            this.errors[column].msgNumbers.rows.push(row);
        } else {
            this.errors[column] = {
                msgId: 'panes.confirmImport.' + column + msgSuffix,
                msgNumbers: { rows: [ row ] } 
            }
        }
    }

    validateRows(rows, columns) {
        for (let rowidx = 0; rowidx < rows.length; rowidx++) {
            const row = rows[rowidx];
            if(row.values.length != columns.length) {
                return { inconsistent: { msgId: 'panes.confirmImport.inconsistentRow' }}
            }

            let id = false;
            let first_name = false;
            let last_name = false;

            for (let colidx = 0; colidx < columns.length; colidx++) {
                const column = this.getFieldID(columns[colidx]);
                if(row.values[colidx]) {
                    if(typeof(row.values[colidx]) !== 'string') {
                        row.values[colidx] = row.values[colidx].toString();
                    }

                    switch(column.type) {
                        case 'email':
                            if(!isEmail(row.values[colidx].trim()) && row.values[colidx] != '') {
                                this.addError(column.type, rowidx+1, 'Invalid');
                            }
                            break;
                        case 'gender':
                            if(!genderOptions.has(row.values[colidx]) && row.values[colidx] != '') {
                                this.addError(column.type, rowidx+1, 'Invalid');
                            }
                            break;
                        case 'first_name':
                            if(row.values[colidx].trim().length > 0) {
                                first_name = true;
                            }
                            if(row.values[colidx].length > 50) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            break;
                        case 'last_name':
                            if(row.values[colidx].trim().length > 0) {
                                last_name = true;
                            }
                        case 'city':
                            if(row.values[colidx].length > 50) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            break;
                        case 'phone':
                        case 'alt_phone':
                            if(row.values[colidx].length > 60) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            const value = row.values[colidx].replace(/[^\x00-\x7FåÅäÄöÖéÉèÈØøÆæ]/g, '');
                            if(!value.match(/^[0-9\-\−\–\—\+\s\(\)]*$/)) {
                                this.addError(column.type, rowidx+1, 'Invalid');
                            }
                            break;
                        case 'zip_code':
                            if(row.values[colidx].length > 10) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            break;
                        case 'country':
                            if(row.values[colidx].length > 60) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            break;
                        case 'external':
                            if(row.values[colidx].trim().length > 96) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            if(row.values[colidx].trim().length > 0) {
                                id = true;
                            }
                            break;
                        case 'zetkin':
                            if(!row.values[colidx].trim().match(/^[0-9]*$/)) {
                                this.addError(column.type, rowidx+1, 'Invalid');
                            }
                            if(row.values[colidx].trim().length > 0) {
                                id = true;
                            }
                            break;
                        case 'co_address':
                        case 'street_address':
                            if(row.values[colidx].length > 120) {
                                this.addError(column.type, rowidx+1, 'TooLong');
                            }
                            break;
                        case 'date':
                            if(!getDate(row.values[colidx])) {
                                this.addError(column.type, rowidx+1, 'Invalid')
                            }
                            break;
                        case 'url':
                            try {
                                new URL(row.values[colidx])
                            } catch(err) {
                                this.addError(column.type, rowidx+1, 'Invalid')
                            }
                            break;
                        case 'text':
                            // Anything goes
                            break;
                    }
                }
            }
            if(!(id || (first_name && last_name)) && !('missingIdOrName' in this.errors)) {
                this.addError('row', rowidx+1, 'Invalid');
            }
        }
    }

    getRenderData() {
        const tableId = this.getParam(0);
        if (this.props.importer.tableSet == null) {
            return {
                valid: false,
                messages: [{ msgId: 'panes.confirmImport.noTable' }]
            };
        }
        const tableList = this.props.importer.tableSet.tableList;
        const tableItem = getListItemById(tableList, tableId);
        this.tableItem = tableItem;

        const typeCount = this.getTypeCount(tableItem.data.columnList);

        const duplicates = this.getDuplicateTypes(typeCount);

        this.errors = {};

        if (Object.keys(duplicates).length > 0) {
            this.errors.duplicates = { msgId: 'panes.confirmImport.duplicatesInfo' };
        }

        if(!((typeCount.external || typeCount.zetkin) || 
                (typeCount.first_name && typeCount.last_name))) {
            this.errors.missingIdOrName = { msgId: 'panes.confirmImport.missingIdOrName' };
        }

        this.validateRows(tableItem.data.rows, tableItem.data.columnList.items);

        if (Object.keys(this.errors).length) {
            return {
                valid: false,
                messages: this.errors,
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
            messages.push({ msgId: 'panes.confirmImport.missingFirstName' });
        }

        if (!("last_name" in typeCount)) {
            result.warning = true;
            messages.push({ msgId: 'panes.confirmImport.missingLastName' });
        }

        if (!("external" in typeCount || "zetkin" in typeCount)) {
            result.warning = true;
            messages.push({ msgId: 'panes.confirmImport.missingIdInfo' });
        }

        if ("zetkin" in typeCount) {
            result.warning = true;
            messages.push({ msgId: 'panes.confirmImport.zetkinIdWarning' });
        }

        if(result.warning) {
            result.messages = messages;
        }

        return result;
    }

    renderPaneContent(data) {
        if (!data.valid) {
            let infoListData = [];
            for(const messageKey in data.messages ) {
                const message = data.messages[messageKey];
                infoListData.push({ name: 'error', ...message })
            }

            return (<div key="info" className="ConfirmImportPane-info">
                <InfoList
                    data={ infoListData }
                />
            </div>);
        } else {
            let infoListData = [];
            if (data.warning) {
                for(const message of data.messages) {
                    infoListData.push({ name: 'warning', ...message });
                }
            }
            infoListData.push({ name: 'preview', value: data.preview });

            return (<div key="info" className="ConfirmImportPane-info">
                <InfoList data={ infoListData } />
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
