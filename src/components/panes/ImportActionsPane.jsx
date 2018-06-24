import cx from 'classnames';
import DropZone from 'react-dropzone';
import React from 'react';
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
    dataProcessed: state.actionImport.dataProcessed,
    dataRows: state.actionImport.dataRows,
});

@connect(mapStateToProps)
@injectIntl
export default class ImportActionsPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            inBrowser: false,
            campaign: '_',
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


            const checked = actionIsLinked && row.selected;
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
                            selectedId={ row.output.locationLink }
                            forceMapping={ row.output.locationMapped }
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
                            selectedId={ row.output.activityLink }
                            forceMapping={ row.output.activityMapped }
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
        if (this.props.dataProcessed && this.state.campaign != '_') {
            return (
                <Button className="ImportActionsPane-saveButton"
                    labelMsg="panes.importActions.saveButton"
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
    }

    onActionSelect(id, ev) {
        this.props.dispatch(toggleActionImportRow(id, ev.target.checked));
    }

    onSubmit(ev) {
        this.props.dispatch(executeActionImport(this.state.campaign));
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
        this.props.dispatch(setActionImportMapping(type, value, id));
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
    }

    render() {
        const list = this.props.list;

        if (this.props.selectedId && !this.props.forceMapping) {
            let item = getListItemById(list, this.props.selectedId);
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
                unlinked: !this.props.selectedId,
                linked: !!this.props.selectedId,
            });

            return (
                <div className={ classes }>
                    <Msg tagName="small" key="label"
                        id="panes.importActions.action.linking.originalText"
                        values={{ title }}
                        />
                    <select className={ classes } value={ this.props.selectedId }
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
            this.props.onCreate(this.props.originalText);
        }
        else if (ev.target.value != '_') {
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
