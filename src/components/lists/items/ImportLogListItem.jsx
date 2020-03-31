import React from 'react';
import { FormattedDate, FormattedTime, FormattedNumber, FormattedMessage as Msg } from 'react-intl';

import Avatar from '../../misc/Avatar';


export default class ImportLogListItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.shape({
            id: React.PropTypes.number.required,
            accepted: React.PropTypes.string.required,
            completed: React.PropTypes.string,
            status: React.PropTypes.string.required,
            imported_by: React.PropTypes.Object,
            error: React.PropTypes.string,
            report: React.PropTypes.Object,
        })
    }

    render() {
        const log = this.props.data;

        return (
            <div onClick={ this.onClick.bind(this) }className="ImportLogListItem">
                <div className="ImportLogListItem-col">
                    <FormattedDate value={ log.accepted } />
                    <FormattedTime value={ log.accepted } />
                </div>
                <div className="ImportLogListItem-col">
                    <Msg id={ "lists.importLogList.item.status." + log.status } />
                    { log.report ? <FormattedNumber value={log.report.imported} /> : null }
                </div>
            </div>
        );
    }

    onClick() {
        this.props.onItemClick(this.props.data);
    }
}

