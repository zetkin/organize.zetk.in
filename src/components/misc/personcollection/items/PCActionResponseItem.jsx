import React from 'react';


export default class PCActionResponseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){

        this.setState({hasJavascript:true});

    }

    render() {
        let item = this.props.item;
        let name = item.person.name;
        let responseTimeLabel = this.state.hasJavascript ? Date.create(item.response_date).format('{yyyy}-{MM}-{dd} {HH}:{mm}') :  null;

        return (
            <div className="PCActionResponseItem">
                <span className="PCActionResponseItem-name">
                    { name }</span>
                <span className="PCActionResponseItem-time">
                    { responseTimeLabel }</span>
            </div>
        );
    }
}
