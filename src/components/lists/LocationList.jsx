import React from 'react';

import List from './List';
import LocationListItem from './items/LocationListItem';


export default class LocationList extends React.Component {
    render() {
        let columns = [
            { 'title': 'Title' }
        ];

        let locationList = this.props.locationList;

        return (
                <List className="LocationList" headerColumns={ columns }
                    list={ locationList } itemComponent={ LocationListItem }
                    onSelect={ this.props.onSelect }/>
        );
    }
}
