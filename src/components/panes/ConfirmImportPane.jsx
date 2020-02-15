import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';


@connect(() => ({}))
@injectIntl
export default class ImporterConfirmPane extends PaneBase {
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

    getPreviewImport(tableSet) {
        let numberRows = tableSet.tableList.items[0].data.columnList.items.length;
        return "This many rows will be imported: "+numberRows;
    }

    getRenderData() {
        let tableSet = this.getParam(0);

        let typeCount = this.getTypeCount(tableSet.tableList.items[0].data.columnList);


        console.log("typeCount");
        console.log(typeCount);

        let displayMessage;
        let duplicates = this.getDuplicateTypes(typeCount);

        if (Object.keys(duplicates).length > 0) {
            displayMessage = "You have duplicates: "+JSON.stringify(duplicates);

            return {
                valid: false,
                message: displayMessage
            }
        }

        if (!("first_name" in typeCount)) {
            displayMessage = "You need to set a column for first name";

            return {
                valid: false,
                message: displayMessage
            }
        }
        if (!("last_name" in typeCount)) {
            displayMessage = "You need to set a column for last name";

            return {
                valid: false,
                message: displayMessage
            }
        }

        let preview = this.getPreviewImport(tableSet);

        if (!("external" in typeCount)) {
            displayMessage = 'You have not entered an external id. Are you sure you want to continue?';

            return {
                valid: true,
                warning: true,
                preview: preview,
                message: displayMessage
            }
        }


        return {
            valid: true,
            warning: false,
            preview: preview
        }


        return {
            tableSet: tableSet
        }
    }



    renderPaneContent(data) {
        console.log("data.tableSet");
        console.log(data.tableSet);
        if (!data.valid) {

            return (<div>
                <h2>Invalid import</h2>
                <div>{ data.message }</div>
            </div>);
        }

        let warning = "";
        if (data.warning) {
            warning = <div>Warning: { data.message }</div>;
        }

        return (<div>
            { warning }
            <div>{ data.preview }</div>
        </div>);
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
        console.log("onSubmit");
    }
}
