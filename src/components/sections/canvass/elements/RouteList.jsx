import React from 'react';


export default class RouteList extends React.Component {
    render() {
        let items = this.props.list.items.map(item => {
            let route = item.data;

            return (
                <li key={ route.id } className="RouteList-item">
                    <span className="RouteList-itemTitle">{ route.id }</span>
                    <span className="RouteList-itemAddrCount">{ route.addresses.length }</span>
                </li>
            );
        });

        return (
            <ul className="RouteList">
                { items }
            </ul>
        );
    }
}
