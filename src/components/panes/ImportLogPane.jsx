import React from 'react';
import isEmail from 'validator/lib/isEmail';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import { getListItemById } from '../../utils/store';
import Button from '../misc/Button';
import { executeImport } from '../../actions/importer';
import InfoList from '../misc/InfoList';
import PersonCollectionItem from '../misc/personcollection/PersonCollectionItem';
import { PCDuplicateItem as ItemComponent } from '../misc/personcollection/items'

const genderOptions = new Set(['f','m','o','_']);

@connect((state, props) => ({
    importLog: getListItemById(
        state.importer.importLogList,
        props.paneData.params[0])
}))
@injectIntl
export default class ImportLogPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.importLog.title' });
    }

    getRenderData() {
        return this.props.importLog;
    }

    onPersonClick(person) {
        this.openPane('person', person.id)
    }

    renderPaneContent(data) {
        const log = data.data;
        if (!log) {
            const infoListData = [
                { name: 'error', msgId: 'panes.importLog.error.noImportLog' }
            ];

            return (<div key="info" className="ImportLogPane-info">
                <InfoList
                    data={ infoListData }
                />
            </div>);
        } else {
            let infoListData = [
                {
                    name: 'status-' + log.status,
                    msgId: 'lists.importLogList.item.status.' + log.status
                },
                {
                    name: 'accepted',
                    msgId: 'panes.importLog.accepted',
                    msgDatetimes: { accepted: log.accepted },
                }, 
            ];

            if(log.status == 'completed') {
                let completedData = [
                    {
                        name: 'completed',
                        msgId: 'panes.importLog.completed',
                        msgDatetimes: { completed: log.completed }
                    },
                    {
                        name: 'imported',
                        msgId: 'panes.importLog.report.imported',
                        msgNumbers: { imported: [log.report.imported] },
                    },
                    {
                        name: 'created',
                        msgId: 'panes.importLog.report.created',
                        msgNumbers: { created: [log.report.created] },
                    },
                    {
                        name: 'updated',
                        msgId: 'panes.importLog.report.updated',
                        msgNumbers: { updated: [log.report.updated] },
                    },
                    {
                        name: 'tagged',
                        msgId: 'panes.importLog.report.tagged',
                        msgNumbers: { tagged: [log.report.tagged] },
                    },
                    {
                        name: 'taggings',
                        msgId: 'panes.importLog.report.taggings',
                        msgNumbers: { taggings: [log.report.taggings] },
                    },
                ];
                infoListData = infoListData.concat(completedData);
            }

            let importedby;
            if(log.imported_by) {
                importedby = <PersonCollectionItem
                                item={ log.imported_by }
                                onSelect={ () => this.onPersonClick(log.imported_by) }
                                itemComponent={ ItemComponent }
                                draggableAvatar={ false } />;
            } else {
                importedby = <FormattedMessage tag="p" id="panes.importlog.noperson" />
            }

            return[
                <InfoList key="info" data={ infoListData } />,
                <Msg tagName="h3" id="panes.importLog.imported_by" />,
                importedby
            ];
        }
    }
}
