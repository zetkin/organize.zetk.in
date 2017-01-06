import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import cx from 'classnames';

import Button from '../Button';


export default class AssignmentTemplate extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool.isRequired,
        configValues: React.PropTypes.object,
        onSelect: React.PropTypes.func,
    };

    render() {
        let type = this.props.type;

        const msgBase = 'panes.addCallAssignment.templates.' + type;

        let titleMsg = msgBase + '.title';
        let configMsg = msgBase + '.config';
        let classes = cx('AssignmentTemplate', 'AssignmentTemplate-' + type, {
            selected: this.props.selected,
        });

        return (
            <div className={ classes }
                onClick={ this.onSelect.bind(this) }>

                <Msg tagName="h2" id={ titleMsg }/>

                <div className="AssignmentTemplate-config">
                    <Msg tagName="p" id={ configMsg }
                        values={ this.props.configValues }/>
                </div>
            </div>
        );
    }

    onSelect() {
        if (!this.props.selected && this.props.onSelect) {
            this.props.onSelect(this.props.type);
        }
    }
}
