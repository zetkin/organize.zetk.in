import React from 'react';
import { injectIntl } from 'react-intl';


@injectIntl
export default class PersonTagColumnSummary extends React.Component {
    render() {
        let column = this.props.column;
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

        const formatMessage = this.props.intl.formatMessage;

        let numTags = distinctTags.length;
        let summary = formatMessage(
            { id: 'panes.import.summary.personTag.summary' },
            { numTagged, numValues, numTags });

        return (
            <p className="PersonTagColumnSummary">
                { summary }
            </p>
        );
    }
}
