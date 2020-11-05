import React from 'react';
import cx from 'classnames';

import DraggableAvatar from '../../misc/DraggableAvatar';
import { FormattedMessage as Msg } from 'react-intl';


export default class JoinFormListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    render() {
        const form = this.props.data;

        const embeddable = form.renderable? (
            <span className="JoinFormListItem-embeddable">
                <Msg id={ `lists.joinFormList.item.embeddable.${form.embeddable}` }/>
            </span>
        ) : null;

        return (
            <div className="JoinFormListItem"
                onClick={ this.props.onItemClick }>
                <div className="JoinFormListItem-content">
                    <span className="JoinFormListItem-title">
                        { form.title }</span>
                    {/*
                    <span className="JoinFormListItem-renderable">
                        <Msg id={ `lists.joinFormList.item.renderable.${form.renderable}` }/>
                    </span>
                    { embeddable }
                    */}
                </div>
            </div>
        );
    }
}

