import React from 'react';
import { injectIntl } from 'react-intl';
import cx from 'classnames';

import { componentClassNames } from '..';


@injectIntl
export default class ListHeader extends React.Component {
    render() {
        const formatMessage = this.props.intl.formatMessage;
        const columns = this.props.columns;
        const sortField = this.props.sortField;

        return (
            <ul className={ cx(componentClassNames(this)) }>
            {columns.map(function(column, index) {
                const links = [];
                const keys = Object.keys(column);

                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let label = formatMessage({ id: column[key] });
                    let classes = cx({
                        'selected': (key == sortField)
                    });

                    links.push(
                        <a key={ key } className={ classes }
                            onClick={ this.onClick.bind(this, key) }>
                            { label }</a>
                    );

                    if (i < (keys.length-1)) {
                        links.push(' / ');
                    }
                }

                return (
                    <li key={ index }>
                        { links }
                    </li>
                );
            }, this)}
            </ul>
        );
    }

    onClick(key) {
        if (this.props.onFieldClick) {
            this.props.onFieldClick(key);
        }
    }
}

ListHeader.propTypes = {
    columns: React.PropTypes.array.isRequired,
    sortField: React.PropTypes.string,
    onFieldClick: React.PropTypes.func
};
