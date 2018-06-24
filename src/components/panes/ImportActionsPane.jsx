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
            selected: [],
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.tableSet && nextProps.tableSet != this.props.tableSet) {
            this.setState({
                selected: nextProps.tableSet.tableList.items[0].data.rows.map((r, i) => i),
            });
        }
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
        let numNotLinked = 0;
        let numBadRows = 0;

        if (rows.length == 0) {
            // TODO: Return message about empty table
            return null;
        }

        let actionItems = rows.map((row, index) => {
            const data = row.values;

            const date = Date.create(data[0]);
            if (isNaN(date)) {
                if (index == 0) {
                    // Ignore faulty first row. Probably header
                    return null;
                }
                else {
                    numBadRows++;
                    return (
                        <ErrorRow key={ index } type="date"
                            index={ index } value={ data[0] }
                            />
                    );
                }
            }

            const dateString = date.medium();

            const startTime = parseTime(data[1]);
            const endTime = parseTime(data[2]);
            if (!startTime || !endTime) {
                let badValue = startTime? data[2] : data[1];
                numBadRows++;
                return (
                    <ErrorRow key={ index } type="time"
                        index={ index } value={ badValue }
                        />
                );
            }

            const pad = n => ('0' + n).slice(-2);
            const timeString = pad(startTime[0]) + ':' + pad(startTime[1])
                + '-' + pad(endTime[0]) + ':' + pad(endTime[1]);

            const locationString = data[3];
            if (!locationString) {
                // Invalid location!
                numBadRows++;
                return (
                    <ErrorRow key={ index } type="location"
                        index={ index } value={ data[3] }
                        />
                );
            }

            const activityString = data[4];
            if (!activityString) {
                // Invalid activity!
                numBadRows++;
                return (
                    <ErrorRow key={ index } type="activity"
                        index={ index } value={ data[4] }
                        />
                );
            }

            const participantCount = parseInt(data[5]) || 2;
            const infoString = data[6] || '';

            const actionIsLinked = this.actionIsLinked(row.values);
            if (!actionIsLinked) {
                numNotLinked++;
            }

            const checked = actionIsLinked && this.state.selected.indexOf(index) >= 0;
            const classes = cx('ImportActionsPane-actionItem', {
                valid: this.actionIsLinked(row.values),
            });

            return (
                <li key={ index } className={ classes }>
                    <div className="ImportActionsPane-actionItemMeta">
                        <input type="checkbox"
                            disabled={ !actionIsLinked } checked={ checked }
                            onChange={ this.onActionSelect.bind(this, index) }
                            />
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
                            values={{ count: participantCount }}
                            />
                        <span>{ infoString }</span>
                    </div>
                </li>
            );
        });

        let warnings = [];
        if (numNotLinked) {
            warnings.push(
                <div key="link" className="ImportActionsPane-linkWarning">
                    <Msg id="panes.importActions.warnings.linking"/>
                </div>
            );
        }

        if (numBadRows) {
            warnings.push(
                <div key="format" className="ImportActionsPane-formatWarning">
                    <Msg id="panes.importActions.warnings.format"/>
                </div>
            );
        }

        return (
            <div key="actions" className="ImportActionsPane-actions">
                <Msg tagName="h3" id="panes.importActions.actions.h"/>
                { warnings }
                <ul className="ImportActionsPane-actionList">
                    { actionItems }
                </ul>
            </div>
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

    onActionSelect(index, ev) {
        let row = this.props.tableSet.tableList.items[0].data.rows[index];
        if (this.actionIsLinked(row.values)) {
            let selected = this.state.selected.filter(i => i !== index);
            if (ev.target.checked) {
                selected.push(index);
            }

            this.setState({ selected });
        }
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

            const classes = cx({
                unlinked: this.state.selected == '_',
                linked: this.state.selected != '_',
            });

            return (
                <div className={ classes }>
                    <Msg tagName="small" key="label"
                        id="panes.importActions.action.linking.originalText"
                        values={{ title }}
                        />
                    <select className={ classes } value={ this.state.selected }
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

const ErrorRow = props => {
    return (
        <div className="ImportActionsPane-errorRow">
            <Msg id="panes.importActions.errorRow.index"
                values={{ index: props.index + 1 }}/>

            <Msg id={ 'panes.importActions.errorRow.types.' + props.type }
                values={{ value: props.value }}/>

            <Msg id="panes.importActions.errorRow.instructions"/>
        </div>
    );
}

function parseTime(str) {
    const fields = str.split(/[\.:]+/);
    if (fields.length && fields.length <= 3) {
        let h = parseInt(fields[0])
        if (isNaN(h)) return null;

        let m = 0;
        if (fields.length > 1) {
            m = parseInt(fields[1]);
            if (isNaN(m)) {
                return null;
            }
        }

        if (m >= 0 && m < 60 && h >= 0 && h < 24) {
            return [h, m];
        }
        else {
            return null;
        }
    }
    else {
        const n = parseInt(str);
        if (!isNaN(n)) {
            return [n, 0];
        }
        else {
            return null;
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
