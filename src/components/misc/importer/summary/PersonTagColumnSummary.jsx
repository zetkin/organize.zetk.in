import React from 'react';


export default function PersonTagColumnSummary(props) {
    let column = props.column;
    let numValues = 0;
    let numTagged = 0;
    let numUntagged = 0;
    let distinctTags = [];

    column.config.mappings.forEach(mapping => {
        if (mapping.value !== null) {
            numValues++;
            if (mapping.tags.length == 0) {
                numUntagged++;
            }
            else {
                numTagged++;
                mapping.tags.forEach(tag => {
                    if (!distinctTags.find(t => t === tag)) {
                        distinctTags.push(tag);
                    }
                });
            }
        }
    });

    let summary = 'Mapped ' + numTagged + '/' + numValues + ' values to '
        + distinctTags.length + ' distinct tags';

    let warning = null;
    if (numUntagged > 0) {
        warning = (
            <span>
                { ' NOTE: ' + numUntagged + ' values left untagged!' }
            </span>
        );
    }

    return (
        <p className="PersonTagColumnSummary">
            { summary }
            { warning }
        </p>
    );
}
