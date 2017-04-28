import cx from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';


export default class ReorderableItem extends React.Component {
    static propTypes = {
        dragging: React.PropTypes.bool,
    };

    render() {
        let classes = cx('ReorderableItem', {
            dragging: this.props.dragging,
        });

        return (
            <div className={ classes } ref="item"
                onMouseDown={ this.onMouseDown.bind(this) }>
                { this.props.children }
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dragging != nextProps.dragging) {
            let itemNode = ReactDOM.findDOMNode(this);
            let itemRect = itemNode.getBoundingClientRect();

            let childNode = itemNode.firstChild;
            let childRect = childNode.getBoundingClientRect();

            if (nextProps.dragging) {
                itemNode.style.height = itemRect.height + 'px';

                childNode.style.position = 'absolute';
                childNode.style.width = childRect.width + 'px';
            }
            else {
                itemNode.style.height = '';
                childNode.style.position = '';
                childNode.style.top = '';
                childNode.style.width = '';
            }
        }
    }

    onMouseDown(ev) {
        if (this.props.onBeginDrag) {
            ev.preventDefault();

            let itemNode = ReactDOM.findDOMNode(this);
            let childNode = itemNode.firstChild;

            this.props.onBeginDrag(this.props.itemKey, itemNode, childNode, ev);
        }
    }
}
