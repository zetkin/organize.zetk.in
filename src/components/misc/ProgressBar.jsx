import React from 'react';

export default class ProgressBar extends React.Component {
    static propTypes = {
        progress: React.PropTypes.number.isRequired,
    };

    render() {
        const progress = this.props.progress * 100;
        return (
            <div className="ProgressBar">
                <div style={{ width: progress + '%' }}
                    className="ProgressBar-content"/>
            </div>
        );
    }
}
