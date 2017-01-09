import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';



export default class Shortcut extends React.Component {
    static propTypes = {
        section: React.PropTypes.string.isRequired,
        expanded: React.PropTypes.bool,
        onClick: React.PropTypes.func,
    };

    render() {
        let section = this.props.section;
        let msgId = 'sections.labels.' + section;
        let classes = cx('Shortcut', 'Shortcut-' + section, {
            expanded: this.props.expanded,
        });

        let img = null;
        if (this.props.expanded) {
            let src = '/static/img/sections/' + section + '.png';
            img = <img src={ src }/>;
        }

        return (
            <div className={ classes }>
                <a onClick={ this.props.onClick }>
                    { img }
                    <Msg id={ msgId }/>
                </a>
            </div>
        );
    }
}
