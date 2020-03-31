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
                { name: 'error', msgId: 'panes.importLog.noImportLog' }
            ];

            return (<div key="info" className="ImportLogPane-info">
                <InfoList
                    data={ infoListData }
                />
            </div>);
        } else {
            const infoListData = [
                { name: 'status', msgId: 'panes.importLogList.status.' + log.status },
                { name: 'accepted' , value: log.accpeted },
                { name: 'completed' , value: log.completed },
                { name: 'error' , value: log.error },
                { name: 'imported' , value: log.report.imported },
                { name: 'created' , value: log.report.updated },
                { name: 'updated' , value: log.report.updated },
                { name: 'tagged' , value: log.report.updated },
                { name: 'taggings' , value: log.report.updated },
            ];

            return[
                <Avatar key="avatar" ref="avatar" person={ log.imported_by }/>,
                <InfoList
                data={ infoListData } />
            ];
        }
    }
}
