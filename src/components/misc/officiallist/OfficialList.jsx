import cx from 'classnames';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';

import OfficialListItem from './OfficialListItem';


const officialTarget = {
    canDrop(props, monitor) {
        let person = monitor.getItem();
        let officials = props.officials;
        let duplicate = officials.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        return {
            targetType: 'official',
            onDropPerson: p => props.onAdd(p)
        };
    }
};

function collectOfficial(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOfficialOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}


@injectIntl
@DropTarget('person', officialTarget, collectOfficial)
export default class OfficialList extends React.Component {
    static propTypes = {
        addMsg: React.PropTypes.string.isRequired,
        selectLinkMsg: React.PropTypes.string.isRequired,
        officials: React.PropTypes.array.isRequired,
        userProfile: React.PropTypes.object.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onAdd: React.PropTypes.func,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let selectLink = (
            <a onClick={ this.onClickAddOfficials.bind(this) }>
                { formatMessage({ id: this.props.selectLinkMsg }) }</a>
        );

        let addItem = this.props.connectDropTarget(
            <li key="add" className="OfficialList-addItem">
                <Msg tagName="p" id={ this.props.addMsg }
                    values={{ selectLink }}/>
            </li>
        );

        let classes = cx('OfficialList', {
            'OfficialList-isPersonOver': this.props.isOfficialOver,
        });

        return (
            <ul className={ classes }>
            { this.props.officials.map(o => {
                let isUser = (o.id == this.props.userProfile.id);

                return (
                    <OfficialListItem key={ o.id } official={ o }
                        isUser={ isUser }
                        onSelect={ this.props.onSelect.bind(this) }
                        onRemove={ this.props.onRemove.bind(this) }/>
                );
            }) }
                { addItem }
            </ul>
        );
    }

    onClickAddOfficials(ev) {
        if (this.props.onAdd) {
            this.props.onAdd(null);
        }
    }
}
