import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import DraggableAvatar from '../DraggableAvatar';
import Avatar from '../Avatar';


export default class OfficialListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func,
        isUser: React.PropTypes.bool,
        official: React.PropTypes.shape({
            role: React.PropTypes.string.isRequired,
            id: React.PropTypes.any.isRequired,     // TODO: Use string
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
        }).isRequired
    };

    render() {
        let official = this.props.official;
        let name = official.first_name + ' ' + official.last_name;

        let classes = cx('OfficialListItem', {
            user: this.props.isUser,
        });

        let avatar;
        let removeButton;

        if (this.props.isUser) {
            removeButton = (
                <div className="OfficialListItem-userLabel">
                    <Msg id="misc.officialList.userLabel"/>
                </div>
            );

            avatar = <Avatar person={ official }/>;
        }
        else {
            removeButton = (
                <a className="OfficialListItem-removeButton"
                    onClick={ this.onRemove.bind(this) }></a>
            );

            avatar = <DraggableAvatar person={ official }/>;
        }

        return (
            <li className={ classes }
                onClick={ this.props.onSelect.bind(this, official) }>
                { avatar }
                <span className="OfficialListItem-name">{ name }</span>
                { removeButton }
            </li>
        );
    }

    onRemove(ev) {
        ev.stopPropagation();
        if (this.props.onRemove) {
            this.props.onRemove(this.props.official);
        }
    }
}
