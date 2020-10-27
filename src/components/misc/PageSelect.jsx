import React from 'react';
import { injectIntl } from 'react-intl';


export default injectIntl(function PageSelect(props) {
    const items = Array.from(Array(props.pageCount).keys()).map(i => {
        return (
            <option key={i} value={i}>
                { props.intl.formatMessage(
                    { id: 'misc.pageSelect.label' },
                    { page: i + 1, count: props.pageCount }) }
            </option>
        );
    });

    return (
        <select className="PageSelect"
            onChange={ ev => props.onChange? props.onChange(parseInt(ev.target.value)) : true }
            value={ props.page }
            >
            { items }
        </select>
    );
});
