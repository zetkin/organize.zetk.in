import React from 'react';

import CallListItem from './CallListItem';
import ListHeader from '../list/ListHeader';


function r(obj, fieldPath) {
    let path = fieldPath.split('.');
    return path.reduce((o, e) => o[e], obj);
}

export default class CallList extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        callList: React.PropTypes.shape({
            error: React.PropTypes.any,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let sortField = this.state.sortField;
        let items = this.props.callList.items;

        let columns = [
            {
                'target.name': 'Target',
                'caller.name': 'Caller',
            },
            {
                'allocation_time': 'Time',
                'state': 'Status',
            }
        ];

        if (sortField) {
            items = items.concat().sort((i0, i1) => {
                if (r(i0.data, sortField) < r(i1.data, sortField)) return -1;
                if (r(i0.data, sortField) > r(i1.data, sortField)) return 1;
                return 0;
            });
        }

        return (
            <div className="CallList">
                <ListHeader columns={ columns } sortField={ sortField }
                    onFieldClick={ this.onFieldClick.bind(this) }/>
                <ul key="CallList-items">
                { items.map((i, index) => {
                    let key = i.data? i.data.id : index;
                    return (
                        <CallListItem key={ key } callItem={ i }
                            onSelect={ this.onSelect.bind(this) }/>
                    );
                }) }
                </ul>
            </div>
        );
    }

    onSelect(call) {
        if (this.props.onSelect) {
            this.props.onSelect(call);
        }
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
}
