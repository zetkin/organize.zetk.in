import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../misc/Link';
import { SECTIONS } from '../sections';


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
        let subList = null;
        if (this.props.expanded) {
            let src = '/static/img/sections/' + section + '.png';
            img = <img src={ src }/>;

            let subListItems = SECTIONS[section].subSections.map(sub => {
                let path = sub.path;
                let subMsgId = 'sections.subSections.' + section + '.' + path;

                return (
                    <li key={ path }>
                        <Link msgId={ subMsgId }
                            onClick={ this.onSubClick.bind(this, path) }
                            />
                    </li>
                );
            });

            subList = (
                <ul className="Shortcut-subSections">
                    { subListItems }
                </ul>
            );
        }

        return (
            <div className={ classes }>
                <a onClick={ this.onMainClick.bind(this) }>
                    { img }
                    <Msg id={ msgId }/>
                </a>
                { subList }
            </div>
        );
    }

    onMainClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.section);
        }
    }

    onSubClick(subSection) {
        if (this.props.onClick) {
            this.props.onClick(this.props.section, subSection);
        }
    }
}
