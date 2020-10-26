import React from 'react';
import cx from 'classnames';

import List from './List';
import JoinFormListItem from './items/JoinFormListItem';


export default class SurveyList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        formList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        let columns = [
            {
                'title':
                    'lists.joinFormList.header.title',
                'renderable':
                    'lists.joinFormList.header.renderable',
            },
            {
                'embeddable':
                    'lists.joinFormList.header.embeddable',
            }
        ];

        return (
            <List className="JoinFormList"
                headerColumns={ columns }
                itemComponent={ JoinFormListItem }
                list={ this.props.formList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
