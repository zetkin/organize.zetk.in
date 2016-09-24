import React from 'react';
import cx from 'classnames';

import List from './List';
import PersonListItem from './items/PersonListItem';


export default class PersonList extends React.Component {
    static propTypes: {
        personList: React.PropTypes.array.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.personList !== this.props.personList);
    }

    render() {
        const columns = [
            {
                'first_name': 'First name',
                'last_name': 'Last name',
            },
            {
                'email': 'E-mail address',
                'phone': 'Phone number',
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
