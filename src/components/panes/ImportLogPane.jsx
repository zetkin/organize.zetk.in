import React from 'react';
import isEmail from 'validator/lib/isEmail';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import { getListItemById } from '../../utils/store';
import Button from '../misc/Button';
import { executeImport } from '../../actions/importer';
import InfoList from '../misc/InfoList';

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
            const infoListData = [
                {
                    name: 'status',
                    msgId: 'lists.importLogList.item.status.' + log.status
                },
                {
                    name: 'accepted',
                    datetime: log.accepted
                },
                {
                    name: 'completed',
                    datetime: log.completed
                },
                {
                    name: 'error',
                    value: log.error
                },
                {
                    name: 'imported',
                    msgId: 'panes.importLog.report.imported',
                    msgNumbers: { imported: log.report.imported },
                },
                {
                    name: 'created',
                    msgId: 'panes.importLog.report.created',
                    msgNumbers: { created: log.report.created },
                },
                {
                    name: 'updated',
                    msgId: 'panes.importLog.report.updated',
                    msgNumbers: { updated: log.report.updated },
                },
                {
                    name: 'tagged',
                    msgId: 'panes.importLog.report.tagged',
                    msgNumbers: { tagged: log.report.tagged },
                },
                {
                    name: 'taggings',
                    msgId: 'panes.importLog.report.taggings',
                    msgNumbers: { taggings: log.report.taggings },
                },
            ];

            return[
                <Avatar key="avatar" ref="avatar" person={ log.imported_by }/>,
                <InfoList
                key="info"
                data={ infoListData } />
            ];
        }
    }
}
