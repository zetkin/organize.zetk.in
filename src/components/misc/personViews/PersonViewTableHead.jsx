import cx from 'classnames';
import React from 'react';


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
                { cols }
            </tr>
        </thead>
    );
}
