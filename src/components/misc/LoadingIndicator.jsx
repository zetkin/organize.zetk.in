import React from 'react';


export default class LoadingIndicator extends React.Component {

    static propTypes = {
        height: React.PropTypes.number.isRequired
    };

    static defaultProps = {
        height: 100
    };



    render() {
        return (
            <span style={{ height: this.props.height }} 
                className="LoadingIndicator">
                <span style={{ paddingTop: this.props.height / 2 - 16 }}
                className="LoadingIndicator-icon"/>
            </span>
        );
    }

    

}