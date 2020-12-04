import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default function PersonViewTableHead(props) {
    const cols = props.columnList.items.map((colItem, index) => {
        const classes = cx('PersonViewTableHead-column', colItem.data.type, {
            sorted: props.sortIndex == index,
            inverted: props.sortInverted,
        });

        const onClickSort = ev => {
            ev.preventDefault();
            ev.stopPropagation();

            if (props.onSort) {
                props.onSort(index);
            }
        };

        return (
            <th key={ colItem.data.id } className={ classes }
                onClick={ () => props.openPane('editviewcolumn', props.viewId, colItem.data.id) }>
                { colItem.data.title }
                <a className="PersonViewTableHead-columnSort"
                    onClick={ onClickSort }
                    />
            </th>
        );
    });

    return (
        <thead className="PersonViewTableHead" style={{ left: -1 * props.scrollLeft }}>
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
