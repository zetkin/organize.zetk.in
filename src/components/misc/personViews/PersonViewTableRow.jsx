import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import Avatar from '../Avatar';

import BooleanViewCell from './cells/BooleanViewCell';
import PlainTextViewCell from './cells/PlainTextViewCell';
import SurveyResponseCell from './cells/SurveyResponseCell';

import {
    addTagsToPerson,
    removeTagFromPerson,
} from '../../../actions/personTag';


export default connect()(function PersonViewTableRow(props) {
    const rowData = props.rowData;
    const columns = props.columnList.items.map(i => i.data);

    const cells = rowData.content.map((cellData, index) => {
        const col = columns[index];
        if (col) {
            const cellProps = {
                key: index,
                content: cellData,
                column: col,
            };

            if (col.type == 'person_tag') {
                const onToggle = toggle => {
                    const tagId = col.config.tag_id;

                    if (toggle) {
                        props.dispatch(addTagsToPerson(rowData.id, [tagId]));
                    }
                    else {
                        props.dispatch(removeTagFromPerson(rowData.id, tagId));
                    }
                };

                return <BooleanViewCell { ...cellProps }
                    interactive={ true }
                    onToggle={ onToggle }
                    />;
            }
            else if (col.type == 'person_query') {
                return <BooleanViewCell { ...cellProps }/>;
            }
            else if (col.type == 'survey_response') {
                return <SurveyResponseCell { ...cellProps }
                    openPane={ props.openPane }/>;
            }
            else {
                return <PlainTextViewCell { ...cellProps }/>;
            }
        }
        else {
            return null;
        }
    });

    const classNames = cx('PersonViewTableRow', {
        saved: rowData.saved,
    });

    return (
        <tr className={ classNames }>
            <td className="PersonViewTableRow-avatar">
                <Avatar
                    person={{ id: rowData.id }}
                    onClick={ () => props.openPane('person', rowData.id ) }
                    />
            </td>
            <td className="PersonViewTableRow-saved"
                onClick={ () => rowData.saved? props.onRemove(rowData) : props.onAdd(rowData) }
                />
            { cells }
            <td className="PersonViewTableRow-placeholder"/>
        </tr>
    );
});
