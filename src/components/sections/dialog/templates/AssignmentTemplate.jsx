import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import cx from 'classnames';

import Button from '../../../misc/Button';


export default class AssignmentTemplate extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        configValues: React.PropTypes.object,
    };

    render() {
        let type = this.props.type;

        const msgBase = 'panes.callAssignmentTemplate.templates.' + type;

        let titleMsg = msgBase + '.title';
        let configMsg = msgBase + '.config';
        let buttonMsg = msgBase + '.okButton';
        let classes = cx('AssignmentTemplate', 'AssignmentTemplate-' + type);
        let imgSrc = '/static/img/assignments/' + type + '.png';

        return (
            <div className={ classes }>
                <Msg tagName="h2" id={ titleMsg }/>
                <img className="AssignmentTemplate-image"
                    src={ imgSrc }/>

                <div className="AssignmentTemplate-config">
                    <Msg tagName="p" id={ configMsg }
                        values={ this.props.configValues }/>
                </div>

                <Button className="AssignmentTemplate-okButton"
                    labelMsg={ buttonMsg }
                    onClick={ this.onOkClick.bind(this) }/>
            </div>
        );
    }

    onOkClick() {
        if (this.props.onCreate) {
            this.props.onCreate(this.props.type, null);
        }
    }
}
