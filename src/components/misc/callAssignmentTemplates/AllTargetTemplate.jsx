import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class AllTargetTemplate extends React.Component {
    render() {
        return (
            <AssignmentTemplate type="allTarget"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>
            </AssignmentTemplate>
        );
    }
}
