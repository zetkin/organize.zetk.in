import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import SelectInput from '../forms/inputs/SelectInput';


@injectIntl
export default class BulkOpSelect extends React.Component {
    static propTypes = {
        objectType: React.PropTypes.string.isRequired,
        operations: React.PropTypes.arrayOf(
            React.PropTypes.string).isRequired,
        selection: React.PropTypes.shape({
            selectedIds: React.PropTypes.array.isRequired,
        }).isRequired,
    };


    render() {
        let count = this.props.selection.selectedIds.length;
        let type = this.props.objectType;
        let ops = this.props.operations;
        let label = op => this.props.intl.formatMessage(
            { id: 'bulkOps.ops.' + type + '.' + op }, { count });

        return (
            <select className="BulkOpSelect">
                <Msg tagName="option" id="bulkOps.selectLabel"/>
            { ops.map(op => (
                <option key={ op } value={ op }>
                    { label(op) }
                </option>
            )) }
            </select>
        );
    }
}
