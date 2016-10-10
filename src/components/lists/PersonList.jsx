import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonListItem from './items/PersonListItem';


export default class PersonList extends React.Component {
    static propTypes = {
        personList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.personList !== this.props.personList);
    }

    render() {
        const columns = [
            {
                'first_name': 'lists.personList.header.firstName',
                'last_name': 'lists.personList.header.lastName',
            },
            {
                'email': 'lists.personList.header.email',
                'phone': 'lists.personList.header.phone',
            }
        ];

        return (
            <List className="PersonList"
                headerColumns={ columns } itemComponent={ PersonListItem }
                list={ this.props.personList }
                onSelect={ this.props.onSelect }/>
        );
    }
}
