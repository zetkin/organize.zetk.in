import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default function PersonViewTableHead(props) {
    const cols = props.columnList.items.map((colItem, index) => {
        const classes = cx('PersonViewTableHead-column', colItem.data.type);

        return (
            <th key={ index } className={ classes }>
                { colItem.data.title }
            </th>
        );
    });

    return (
        <thead className="PersonViewTableHead">
            <tr>
                <th className="PersonViewTableHead-avatarColumn"></th>
                <th className="PersonViewTableHead-savedColumn"></th>
                { cols }
                <th className="PersonViewTableHead-newColumn"
                    onClick={ () => props.openPane('addviewcolumn', props.viewId) }>
                    <Msg id="panes.personViews.view.addColumn"/>
                </th>
            </tr>
        </thead>
    );
}
