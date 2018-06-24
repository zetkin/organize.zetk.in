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
import { retrieveActivities } from '../../actions/activity';
import { retrieveLocations } from '../../actions/location';


const mapStateToProps = state => ({
    activityList: state.activities.activityList,
    locationList: state.locations.locationList,
    tableSet: state.actionImport.tableSet,
});

@connect(mapStateToProps)
@injectIntl
export default class ImportActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
            mappings: {
                location: {},
                activity: {},
            },
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveActivities());
        this.props.dispatch(retrieveLocations());
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.importActions.title' });
    }

    renderPaneContent(data) {
        if (this.props.tableSet) {
            // TODO: Handle multiple sheets
            // TODO: Handle when dependencies haven't loaded
            // TODO: Handle campaigns
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
            let locationString = data[3].toString();
            let activityString = data[4].toString();
            let participantsString = data[5];
            let infoString = data[6];

            const classes = cx('ImportActionsPane-actionItem', {
                valid: this.actionIsLinked(row.values),
            });

            return (
                <li key={ index } className={ classes }>
                    <div className="ImportActionsPane-actionItemMeta">
                    </div>
                    <div className="ImportActionsPane-actionItemDate">
                        <Msg tagName="h4"
                            id="panes.importActions.action.labels.dateTime"/>
                        <span>{ dateString }</span>
                        <span>{ timeString }</span>
                    </div>
                    <div className="ImportActionsPane-actionItemLocation">
                        <Msg tagName="h4"
                            id="panes.importActions.action.labels.location"/>
                        <LinkingWidget
                            list={ this.props.locationList }
                            mappings={ this.state.mappings.location }
                            originalText={ locationString }
                            onLinkClick={ id => this.openPane('location', id) }
                            onMapValue={ this.onMapValue.bind(this, 'location') }
                            onCreate={ this.onCreate.bind(this, 'location') }
                            />
                    </div>
                    <div className="ImportActionsPane-actionItemActivity">
                        <Msg tagName="h4"
                            id="panes.importActions.action.labels.activity"/>
                        <LinkingWidget
                            list={ this.props.activityList }
                            mappings={ this.state.mappings.activity }
                            originalText={ activityString }
                            onLinkClick={ id => this.openPane('editactivity', id) }
                            onMapValue={ this.onMapValue.bind(this, 'activity') }
                            onCreate={ this.onCreate.bind(this, 'activity') }
                            />
                    </div>
                    <div className="ImportActionsPane-actionItemInfo">
                        <Msg tagName="h4"
                            id="panes.importActions.action.labels.info"/>
                        <Msg id="panes.importActions.action.participantCount"
                            values={{ count: participantsString }}
                            />
                        <span>{ infoString }</span>
                    </div>
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

    actionIsLinked(row) {
        const locationLinked = (
            getItemByTitle(this.props.locationList, row[3])
            || getSelectedFromMappings(this.state.mappings.location, row[3])
        );

        const activityLinked = (
            getItemByTitle(this.props.activityList, row[4])
            || getSelectedFromMappings(this.state.mappings.activity, row[4])
        );

        return !!(locationLinked && activityLinked);
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

    onCreate(type, title) {
        if (type == 'activity') {
            this.openPane('addactivity', title);
        }
        else if (type == 'location') {
            this.openPane('addlocation', title);
        }
    }

    onMapValue(type, value, id) {
        this.setState({
            mappings: Object.assign({}, this.state.mappings, {
                [type]: Object.assign({}, this.state.mappings[type], {
                    [value]: id,
                }),
            }),
        });
    }
}

@injectIntl
class LinkingWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: getSelectedFromMappings(
                props.mappings, props.originalText) || '_',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: getSelectedFromMappings(
                nextProps.mappings, nextProps.originalText) || '_',
        });
    }

    render() {
        const list = this.props.list;

        let item = getItemByTitle(list, this.props.originalText);

        if (item) {
            return (
                <span className="linked"
                    onClick={ this.props.onLinkClick.bind(this, item.data.id) }>
                    <a>{ item.data.title }</a>
                </span>
            );
        }
        else {
            const options = list.items.map(item => (
                <option key={ item.data.id } value={ item.data.id }>
                    { item.data.title }
                </option>
            ));

            const title = this.props.originalText;
            const createLabel = this.props.intl.formatMessage(
                { id: 'panes.importActions.action.linking.create' });
            const groupLabel = this.props.intl.formatMessage(
                { id: 'panes.importActions.action.linking.options' });

            return (
                <div>
                    <Msg tagName="small" key="label"
                        id="panes.importActions.action.linking.originalText"
                        values={{ title }}
                        />
                    <select value={ this.state.selected }
                        onChange={ this.onSelectChange.bind(this) }>
                        <option value="_"></option>
                        <option value="+">{ createLabel }</option>
                        <optgroup label={ groupLabel }>
                            { options }
                        </optgroup>
                    </select>
                </div>
            );
        }
    }

    onSelectChange(ev) {
        if (ev.target.value == '+') {
            this.setState({
                selected: '_',
            });

            this.props.onCreate(this.props.originalText);
        }
        else if (ev.target.value != '_') {
            this.setState({
                selected: ev.target.value,
            });

            this.props.onMapValue(this.props.originalText, ev.target.value);
        }
    }
}

function cleanTitle(originalTitle) {
   return originalTitle.trim().toLowerCase();
}

function getItemByTitle(list, originalTitle) {
    let title = cleanTitle(originalTitle);
    return list.items.find(i => i.data.title.toLowerCase() == title);
}

function getSelectedFromMappings(mappings, originalTitle) {
    let title = originalTitle;
    return mappings[title] || null;
}
