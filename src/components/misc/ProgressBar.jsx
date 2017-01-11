import React from 'react';

export default class ProgressBar extends React.Component {
    static propTypes = {
        progressSum: React.PropTypes.number.isRequired,
    };

    render() {
        return (
            <div className="ProgressBar">
                <div style={{ width: this.props.progressSum + '%' }}
                    className="ProgressBar-content"/>
            </div>
        );
    }
}
