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
            let locationString = data[3].toString().trim().toLowerCase();
            let activityString = data[4].toString().trim().toLowerCase();
            let participantsString = data[5];
            let infoString = data[6];

            return (
                <li key={ index } className="ImportActionsPane-actionItem">
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

    onCreate(type) {
        if (type == 'activity') {
            this.openPane('addactivity');
        }
        else if (type == 'location') {
            this.openPane('addlocation');
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
            selected: this.getSelectedFromProps(props),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: this.getSelectedFromProps(nextProps),
        });
    }

    render() {
        const list = this.props.list;

        let title = this.props.originalText.trim().toLowerCase();
        let item = list.items.find(i => i.data.title.toLowerCase() == title);

        if (item) {
            return (
                <span className="linked"
                    onClick={ this.props.onLinkClick.bind(this, item.data.id) }>
                    <a>{ item.data.title }</a>
                </span>
            );
        }
        else {
            let options = list.items.map(item => (
                <option key={ item.data.id } value={ item.data.id }>
                    { item.data.title }
                </option>
            ));

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

    getSelectedFromProps(props) {
        let title = props.originalText.trim().toLowerCase();
        return props.mappings[title] || '_';
    }

    onSelectChange(ev) {
        if (ev.target.value == '+') {
            this.setState({
                selected: '_',
            });

            this.props.onCreate();
        }
        else if (ev.target.value != '_') {
            this.setState({
                selected: ev.target.value,
            });

            this.props.onMapValue(this.props.originalText, ev.target.value);
        }
    }
}
