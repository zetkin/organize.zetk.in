import cx from 'classnames';
import DropZone from 'react-dropzone';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import {
    processActionImportData,
    executeActionImport,
    parseActionImportFile,
} from '../../actions/actionImport';
import { retrieveActivities } from '../../actions/activity';
import { retrieveCampaigns } from '../../actions/campaign';
import { retrieveLocations } from '../../actions/location';


const mapStateToProps = state => ({
    activityList: state.activities.activityList,
    campaignList: state.campaigns.campaignList,
    locationList: state.locations.locationList,
    dataProcessed: state.actionImport.dataProcessed,
    dataRows: state.actionImport.dataRows,
});

@connect(mapStateToProps)
@injectIntl
export default class ImportActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            campaign: '_',
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
        this.props.dispatch(retrieveCampaigns());
        this.props.dispatch(retrieveLocations());
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.importActions.title' });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activityList != this.props.activityList) {
            this.props.dispatch(processActionImportData());
        }

        if (nextProps.locationList != this.props.locationList) {
            this.props.dispatch(processActionImportData());
        }

        if (nextProps.dataRows && !this.props.dataRows) {
            this.props.dispatch(processActionImportData());
        }

        if (nextProps.dataRows) {
            this.setState({
                selected: nextProps.dataRows.map(row => row.id),
            });
        }
    }

    renderPaneContent(data) {
        if (!this.state.inBrowser) {
            // Only run in browser, since DropZone does not render on server
            return null;
        }

        if (this.props.dataRows) {
            if (!this.props.dataProcessed) {
                // Just wait, will be processed momentarily
                // TODO: Show loading indicator
                return;
            }

            // TODO: Handle multiple sheets
            // TODO: Handle when dependencies haven't loaded

            const campaignOptions = this.props.campaignList.items.map(item => {
                return (
                    <option key={ item.data.id } value={ item.data.id }>
                        { item.data.title }
                    </option>
                );
            });

            return [
                <div key="campaign" className="ImportActionsPane-campaign">
                    <Msg tagName="h3" id="panes.importActions.campaign.h"/>
                    <Msg tagName="p" id="panes.importActions.campaign.p"/>
                    <select value={ this.state.campaign }
                        onChange={ this.onCampaignChange.bind(this) }>
                        <option value="_"></option>
                        { campaignOptions }
                    </select>
                </div>,

                this.renderActionsFromRows(this.props.dataRows),
            ];
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

    renderActionsFromRows(rows) {
        let numNotLinked = 0;
        let numBadRows = 0;

        if (rows.length == 0) {
            // TODO: Return message about empty table
            return null;
        }

        let actionItems = rows.map((row, index) => {
            if (row.error) {
                // Ignore error if this is first row. Probably just header
                if (index == 0) {
                    return null;
                }
                else {
                    numBadRows++;
                    return (
                        <ErrorRow key={ index } type={ row.error.type }
                            index={ index } value={ row.error.value }
                            />
                    );
                }
            }

            const data = row.values;

            const dateString = row.output.date.medium();

            const pad = n => ('0' + n).slice(-2);
            const timeString = pad(row.output.startTime[0]) + ':' + pad(row.output.startTime[1])
                + '-' + pad(row.output.endTime[0]) + ':' + pad(row.output.endTime[1]);


            const participantCount = row.output.participants;
            const infoString = row.output.info;

            const actionIsLinked = !!(row.output.activityLink && row.output.locationLink);
            if (!actionIsLinked) {
                numNotLinked++;
            }

            const checked = actionIsLinked && this.state.selected.indexOf(row.id) >= 0;
            const classes = cx('ImportActionsPane-actionItem', {
                valid: actionIsLinked,
            });

            return (
                <li key={ row.id } className={ classes }>
                    <div className="ImportActionsPane-actionItemMeta">
                        <input type="checkbox"
                            disabled={ !actionIsLinked } checked={ checked }
                            onChange={ this.onActionSelect.bind(this, row.id) }
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
                            originalText={ data[3] }
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
                            originalText={ data[4] }
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
        if (this.props.tableSet && this.state.campaign != '_') {
            return (
                <Button className="ImportActionsPane-saveButton"
                    labelMsg="panes.importActions.saveButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
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

    onActionSelect(rowId, ev) {
        let selected = this.state.selected.filter(id => id !== rowId);
        if (ev.target.checked) {
            selected.push(rowId);
        }

        this.setState({ selected });
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

    onCampaignChange(ev) {
        this.setState({
            campaign: ev.target.value,
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
