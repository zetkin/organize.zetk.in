import React from 'react';
import { connect } from 'react-redux';

import RelSelectInput from '../../forms/inputs/RelSelectInput';
import PersonSelectWidget from '../PersonSelectWidget';


export default connect()(function PersonViewTableRow(props) {
    return (
        <tr className="PersonViewAddRow">
            <td/>
            <td/>
            <td colSpan={ 2 }>
                <PersonSelectWidget
                    isPending={ props.rowList && props.rowList.addIsPending }
                    onSelect={ props.onSelect }
                    />
            </td>
            <td colSpan={ props.columnList.items.length - 2 }/>
            <td className="PersonViewTableRow-placeholder"/>
        </tr>
    );
});
