import cx from 'classnames';
import DropZone from 'react-dropzone';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import {
    executeActionImport,
    parseActionImportFile,
    processActionImportData,
    setActionImportMapping,
    toggleActionImportRow,
} from '../../actions/actionImport';
import { retrieveActivities } from '../../actions/activity';
import { retrieveCampaigns } from '../../actions/campaign';
import { retrieveLocations } from '../../actions/location';


const mapStateToProps = state => ({
    activityList: state.activities.activityList,
    campaignList: state.campaigns.campaignList,
    locationList: state.locations.locationList,
    dataRows: state.actionImport.dataRows,
    importIsPending: state.actionImport.isPending,
    importStats: state.actionImport.stats,
});

@connect(mapStateToProps)
@injectIntl
export default class ImportActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            inBrowser: false,
            campaign: '',
            isDragging: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveActivities());
        this.props.dispatch(retrieveCampaigns());
        this.props.dispatch(retrieveLocations());

        this.setState({
            inBrowser: true,
        });
    }

    getPaneTitle() {
        let msgId = 'panes.importActions.title';
        if (this.props.importStats && this.props.importStats.completed) {
            msgId = 'panes.importActions.titleCompleted';
        }

        return this.props.intl.formatMessage({ id: msgId });
    }

    renderPaneContent(data) {
        if (!this.state.inBrowser) {
            // Only run in browser, since DropZone does not render on server
            return null;
        }

        if (this.props.importStats && this.props.importStats.completed) {
            return [
                <div key="stats" className="ImportActionsPane-stats">
                </div>,

                <div key="actions" className="ImportActionsPane-actions">
                    <Msg tagName="h3" id="panes.importActions.importedActions.h"/>
                    { this.renderActionsFromRows(this.props.dataRows) }
                </div>,
            ];
            return <h2>Import complete</h2>;
        }
        else {
            // TODO: Handle multiple sheets
            // TODO: Handle when dependencies haven't loaded

            const campaignOptions = this.props.campaignList.items.map(item => {
                return (
                    <option key={ item.data.id } value={ item.data.id }>
                        { item.data.title }
                    </option>
                );
            });

            let actionContent = null;
            if (this.props.dataRows) {
                actionContent = this.renderActionsFromRows(this.props.dataRows);
            }
            else {
                let classes = cx('ImportActionsPane-dropZone', {
                    'dragging': this.state.isDragging,
                });

                actionContent = (
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

            return [
                <div key="campaign" className="ImportActionsPane-campaign">
                    <Msg tagName="h3" id="panes.importActions.campaign.h"/>
                    <Msg tagName="p" id="panes.importActions.campaign.p"/>
                    <select value={ this.state.campaign }
                        onChange={ this.onCampaignChange.bind(this) }>
                        <option value=""></option>
                        { campaignOptions }
                    </select>
                </div>,

                <div key="actions" className="ImportActionsPane-actions">
                    <Msg tagName="h3" id="panes.importActions.actions.h"/>
                    { actionContent }
                </div>,
            ];
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

            const actionIsLinked = !!(row.parsed.activityLink && row.parsed.locationLink);
            if (!actionIsLinked) {
                numNotLinked++;
            }

            return (
                <ActionItem key={ row.id } row={ row }
                    activityList={ this.props.activityList }
                    locationList={ this.props.locationList }
                    onSelect={ this.onActionSelect.bind(this) }
                    onMapValue={ this.onMapValue.bind(this) }
                    onCreate={ this.onCreate.bind(this) }
                    />
            );
        });

        let warnings = [];
        if (!this.props.importStats) {
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
        }

        return [
            ...warnings,
            <ul key="actionList" className="ImportActionsPane-actionList">
                { actionItems }
            </ul>,
        ];
    }

    renderPaneFooter(data) {
        if (this.props.importStats && this.props.importStats.completed) {
            return null;
        }
        else if (this.props.dataRows && this.state.campaign) {
            const validRows = this.props.dataRows.filter(row => !row.error);
            const rowsToImport = validRows.filter(row => row.selected
                && !!row.parsed.activityLink
                && !!row.parsed.locationLink);

            if (rowsToImport.length) {
                return (
                    <Button className="ImportActionsPane-saveButton"
                        isPending={ this.props.importIsPending }
                        labelMsg="panes.importActions.saveButton"
                        labelValues={{
                            count: rowsToImport.length,
                            max: validRows.length,
                        }}
                        onClick={ this.onSubmit.bind(this) }/>
                );
            }
        }

        return (
            <Msg id="panes.importActions.beforeSaving"/>
        );
    }

    onActionSelect(id, ev) {
        this.props.dispatch(toggleActionImportRow(id, ev.target.checked));
    }

    onSubmit(ev) {
        this.props.dispatch(executeActionImport(this.state.campaign));
        ev.preventDefault();

        // Content has ref defined in PaneBase
        const contentDOMNode = ReactDOM.findDOMNode(this.refs.content);
        if (contentDOMNode) {
            const animatedScrollTo = require('animated-scrollto');
            animatedScrollTo(contentDOMNode, 0, 400);
        }
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
        this.props.dispatch(setActionImportMapping(type, value, id));
    }

    onCampaignChange(ev) {
        this.setState({
            campaign: ev.target.value,
        });
    }
}

class ActionItem extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.row != this.props.row
            || nextProps.activityList != this.props.activityList
            || nextProps.locationList != this.props.locationList
        );
    }

    render() {
        const row = this.props.row;

        const dateString = row.parsed.date.medium();
        const pad = n => ('0' + n).slice(-2);
        const timeString = pad(row.parsed.startTime[0]) + ':' + pad(row.parsed.startTime[1])
            + '-' + pad(row.parsed.endTime[0]) + ':' + pad(row.parsed.endTime[1]);

        const actionIsLinked = !!(row.parsed.activityLink && row.parsed.locationLink);
        const participantCount = row.parsed.participants;
        const infoString = row.parsed.info;
        const checked = actionIsLinked && row.selected;
        const classes = cx('ImportActionsPane-actionItem', {
            valid: actionIsLinked,
        });

        return (
            <li className={ classes }>
                <div className="ImportActionsPane-actionItemMeta">
                    <input type="checkbox"
                        disabled={ !actionIsLinked } checked={ checked }
                        onChange={ this.props.onSelect.bind(this, row.id) }
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
                        value={ row.parsed.locationLink || '' }
                        originalText={ row.values[3] }
                        onLinkClick={ id => this.openPane('location', id) }
                        onMapValue={ this.props.onMapValue.bind(this, 'location') }
                        onCreate={ this.props.onCreate.bind(this, 'location') }
                        />
                </div>
                <div className="ImportActionsPane-actionItemActivity">
                    <Msg tagName="h4"
                        id="panes.importActions.action.labels.activity"/>
                    <LinkingWidget
                        list={ this.props.activityList }
                        value={ row.parsed.activityLink || '' }
                        originalText={ row.values[4] }
                        onLinkClick={ id => this.openPane('editactivity', id) }
                        onMapValue={ this.props.onMapValue.bind(this, 'activity') }
                        onCreate={ this.props.onCreate.bind(this, 'activity') }
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
    }
}

@injectIntl
class LinkingWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const list = this.props.list;
        const value = this.props.value;

        if (value && value.id) {
            return (
                <span className="linked"
                    onClick={ this.props.onLinkClick.bind(this, value.id) }>
                    <a>{ value.title }</a>
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
                unlinked: !this.props.value,
                linked: !!this.props.value,
            });

            return (
                <div className={ classes }>
                    <Msg tagName="small" key="label"
                        id="panes.importActions.action.linking.originalText"
                        values={{ title }}
                        />
                    <select className={ classes } value={ this.props.value }
                        onChange={ this.onSelectChange.bind(this) }>
                        <option value=""></option>
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
            this.props.onCreate(this.props.originalText);
        }
        else if (ev.target.value) {
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
