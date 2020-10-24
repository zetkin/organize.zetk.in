import React from 'react';

export default function PageSelect(props) {


    const items = Array.from(Array(props.pageCount).keys()).map(i => {
        return (
            <li key={i}
                onClick={ () => props.onChange? props.onChange(i) : null }
            >{ i + 1 }
            </li>
        );
    });

    // Return <ul> list containing the items
    return (
        <ul>{ items }</ul>
    );
}

