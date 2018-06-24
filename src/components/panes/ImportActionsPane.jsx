import cx from 'classnames';
import DropZone from 'react-dropzone';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import {
    parseActionImportFile,
} from '../../actions/actionImport';


const mapStateToProps = state => ({
    tableSet: state.actionImport.tableSet,
});

@connect(mapStateToProps)
@injectIntl
export default class ImportActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.importActions.title' });
    }

    renderPaneContent(data) {
        if (this.props.tableSet) {
            // TODO Handle multiple sheets
            let table = this.props.tableSet.tableList.items[0].data;
            return this.renderActionsFromTable(table);
        }
        else {
            let classes = cx('ImportActionsPane-dropZone', {
                'dragging': this.state.isDragging,
            });

            return (
                <DropZone key="dropZone" className={ classes }
                    onDragEnter={ this.onDragEnter.bind(this) }
                    onDragLeave={ this.onDragLeave.bind(this) }
                    onDrop={ this.onDrop.bind(this) }>
                    <div className="ImportActionsPane-dropZoneMessage">
                        <Msg tagName="h3" id="panes.importActions.dropZone.h"/>
                        <Msg tagName="p" id="panes.importActions.dropZone.p"/>
                        <ul>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.date"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.startTime"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.endTime"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.location"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.activity"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.participants"/>
                            <Msg tagName="li" id="panes.importActions.dropZone.columns.info"/>
                        </ul>
                    </div>
                </DropZone>
            );
        }
    }

    renderActionsFromTable(table) {
        let rows = table.rows;

        if (rows.length == 0) {
            // TODO: Return message about empty table
            return null;
        }

        // Could first row be headers? Try parsing date
        const firstDate = Date.create(rows[0].values[0]);
        if (isNaN(firstDate)) {
            rows = rows.slice(1);
        }

        let actionItems = rows.map((row, index) => {
            let data = row.values;
            let date = Date.create(data[0]);

            let dateString = data[0];
            let timeString = data[1] + '-' + data[2];
            let locationString = data[3];
            let activityString = data[4];
            let participantsString = data[5];
            let infoString = data[6];

            return (
                <li key={ index } className="ImportActionsPane-actionItem">
                    <ul className="ImportActionsPane-actionItemData">
                        <li>
                            <Msg tagName="label"
                                id="panes.importActions.action.labels.dateTime"/>
                            <span>{ dateString }</span>
                            <span>{ timeString }</span>
                        </li>
                        <li>
                            <Msg tagName="label"
                                id="panes.importActions.action.labels.location"/>
                            <span>{ locationString }</span>
                        </li>
                        <li>
                            <Msg tagName="label"
                                id="panes.importActions.action.labels.activity"/>
                            <span>{ activityString }</span>
                        </li>
                        <li>
                            <Msg tagName="label"
                                id="panes.importActions.action.labels.info"/>
                            <span>{ participantsString }</span>
                            <span>{ infoString }</span>
                        </li>
                    </ul>
                </li>
            );
        });

        return (
            <ul className="ImportActionsPane-actionList">
                { actionItems }
            </ul>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button className="ImportActionsPane-saveButton"
                labelMsg="panes.importActions.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();
    }

    onDragEnter() {
        this.setState({
            isDragging: true,
        });
    }

    onDragLeave() {
        this.setState({
            isDragging: false,
        });
    }

    onDrop(files) {
        this.setState({
            isDragging: false,
        });

        // TODO: Check file count, format et c

        let file = files[0];
        this.props.dispatch(parseActionImportFile(file));
    }
}
