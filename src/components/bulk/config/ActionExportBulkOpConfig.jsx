import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

@injectIntl
export default class ActionExportBulkOpConfig extends React.Component {
    static propTypes = {
        openPane: React.PropTypes.func,
        config: React.PropTypes.object.isRequired,
        onConfigChange: React.PropTypes.func.isRequired,
        selection: React.PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.onConfigChange(this.props.config);
    }

    render() {
        let maxActionsSupportedInExport = 100;

        if (this.props.selection.selectedIds.length > maxActionsSupportedInExport) {
            return (
                <div className="ActionExportBulkOpConfig-errorRow">
                    <div key="link" className="ActionExportBulkOpConfig-maxActionsWarning">
                        <Msg id='panes.bulkOp.tooLargeActionExport' values={{ maxActionsSupportedInExport}}></Msg>
                    </div>
                </div>
            );
        }

        return null;
    }
}
