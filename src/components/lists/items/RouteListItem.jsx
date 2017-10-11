import React from 'react';


export default class RouteListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
        })
    }

    render() {
        let route = this.props.data;

        return (
            <div className="RouteListItem"
                onMouseOut={ this.props.onItemMouseOut }
                onMouseOver={ this.props.onItemMouseOver }
                onClick={ this.props.onItemClick }>

                <div className="RouteListItem-col">
                    { route.id }
                </div>
            </div>
        );
    }
}

