import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import SelectInput from '../forms/inputs/SelectInput';


@injectIntl
export default class BulkOpSelect extends React.Component {
    static propTypes = {
        openPane: React.PropTypes.func.isRequired,
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

        let formatMessage = this.props.intl.formatMessage;
        let selectLabel = formatMessage({ id: 'bulkOps.selectLabel' });
        let optionLabel = op => formatMessage(
            { id: 'bulkOps.ops.' + type + '.' + op }, { count });

        return (
            <select className="BulkOpSelect" value="_"
                onChange={ this.onChange.bind(this) }>
                <option value="_">{ selectLabel }</option>
            { ops.map(op => (
                <option key={ op } value={ op }>
                    { optionLabel(op) }
                </option>
            )) }
            </select>
        );
    }

    onChange(ev) {
        let op = this.props.objectType + '.' + ev.target.value;
        let selectionId = this.props.selection.id;

        this.props.openPane('bulk', op, selectionId);
    }
}
