import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class TimelineEvent extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        title: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
        ]),
        subItems: React.PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        };
    }

    render() {
        let toggle = null;
        let subContent = null;

        if (this.props.subItems) {
            const subItems = this.props.subItems.map((item, idx) => {
                return (
                    <div className="TimelineEvent-subItem" key={ idx }>
                        { item }
                    </div>
                );
            });

            subContent = (
                <div className="TimelineEvent-subItems">
                    { subItems }
                </div>
            );

            const toggleMsg = this.state.expanded?
                'timeline.event.toggleCollapsed' : 'timeline.event.toggleExpanded';

            toggle = (
                <a className="TimelineEvent-toggle"
                    onClick={ this.onToggle.bind(this) }>
                    <Msg id={ toggleMsg }/>
                </a>
            );
        }

        const classes = cx('TimelineEvent', this.props.className, {
            expanded: this.state.expanded
        });

        return (
            <div className={ classes }>
                <h4>{ this.props.title }</h4>
                <div className="TimelineEvent-info">
                    { this.props.children }
                </div>
                { toggle }
                { subContent }
            </div>
        );
    }

    onToggle() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }
}
