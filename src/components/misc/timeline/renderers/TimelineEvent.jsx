import cx from 'classnames';
import React from 'react';


export default class TimelineEvent extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        title: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
        ]),
        subItems: React.PropTypes.array,
    };

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
        }

        const classes = cx('TimelineEvent', this.props.className);

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
}
