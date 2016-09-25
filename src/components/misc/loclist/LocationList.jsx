import React from 'react';

import ListHeader from '../list/ListHeader';
import LocationListItem from '../loclist/LocationListItem';


export default class LocationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortField: undefined
        };
    }

    render() {
        const sortField = this.state.sortField;

        const columns = [
            { 'title': 'Title' }
        ];

        var locations = this.props.locations;
        if (sortField) {
            locations = locations.concat().sort(function(l0, l1) {
                if (l0[sortField] < l1[sortField]) return -1;
                if (l0[sortField] > l1[sortField]) return 1;
                return 0;
            });
        }

        return (
            <div className="LocationList">
                <ListHeader columns={ columns } sortField={ sortField }
                    onFieldClick={ this.onFieldClick.bind(this) }/>
                <ul className="LocationList-items">
                    {locations.map(function(loc) {
                        return (
                            <LocationListItem location={ loc }
                                key={ loc.data.id }
                                onSelect={ this.onSelect.bind(this, loc.data) }/>
                        );
                    }, this)}
                </ul>
            </div>
        );
    }

    onFieldClick(field) {
        if (field == this.state.sortField) {
            // Click the same twice? Reset
            field = undefined;
        }

        this.setState({
            sortField: field
        });
    }

    onSelect(loc) {
        if (this.props.onSelect) {
            this.props.onSelect(loc);
        }
    }
}

LocationList.propTypes = {
    locations: React.PropTypes.array.isRequired,
    onSelect: React.PropTypes.func
};
