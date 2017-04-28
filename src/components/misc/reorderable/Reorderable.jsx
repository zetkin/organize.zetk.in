import cx from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import ReorderableItem from './ReorderableItem';


export default class Reorderable extends React.Component {
    static propTypes = {
        onReordering: React.PropTypes.func,
        onReorder: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            activeKey: null,
            dragging: false,
            order: props.children.map(child => child.key),
        };

        this.onDocMouseMoveBound = this.onDocMouseMove.bind(this);
        this.onDocMouseUpBound = this.onDocMouseUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let curKeys = this.props.children.map(child => child.key);
        let nextKeys = nextProps.children.map(child => child.key);

        if (!curKeys.equals(nextKeys)) {
            let order = nextProps.children.map(child => child.key);
            this.setState({ order });
        }
    }

    render() {
        this.items = [];

        let children = this.props.children
            .concat()
            .sort((c0, c1) => {
                let idx0 = this.state.order.indexOf(c0.key);
                let idx1 = this.state.order.indexOf(c1.key);

                return idx0 - idx1;
            });

        let items = children.map((child, idx) => {
            if (!child.key) {
                throw 'Reorderable children must have keys';
            }

            let key = child.key;
            let item = (
                <ReorderableItem key={ key } itemKey={ key } ref={ key }
                    dragging={ key == this.state.activeKey }
                    onBeginDrag={ this.onItemBeginDrag.bind(this) }>
                    { child }
                </ReorderableItem>
            );

            this.items[idx] = { key, item };

            return item;
        });

        let classes = cx('Reorderable', {
            dragging: this.state.dragging,
        });

        return (
            <div className={ classes }>
                { items }
            </div>
        );
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onDocMouseMoveBound);
        document.removeEventListener('mouseup', this.onDocMouseUpBound);
    }

    onItemBeginDrag(key, itemNode, childNode, ev) {
        this.setState({
            activeKey: key,
        });

        let ctrNode = ReactDOM.findDOMNode(this);
        let ctrRect = ctrNode.getBoundingClientRect();
        let itemRect = itemNode.getBoundingClientRect();

        this.childNode = childNode;
        this.mouseDY = ctrRect.top + (ev.clientY - itemRect.top);
        this.startY = itemRect.top - ctrRect.top;

        document.addEventListener('mousemove', this.onDocMouseMoveBound);
        document.addEventListener('mouseup', this.onDocMouseUpBound);
    }

    componentDidUpdate() {
        let ctrNode = ReactDOM.findDOMNode(this);
        let ctrRect = ctrNode.getBoundingClientRect();

        this.items = this.items.map(item => {
            let childNode = ReactDOM.findDOMNode(this.refs[item.key]);
            let childRect = childNode.getBoundingClientRect();
            return Object.assign({}, item, {
                y: childRect.top - ctrRect.top,
            });
        });
    }

    onDocMouseMove(ev) {
        let newState = {};

        let y = (ev.clientY - this.mouseDY);

        if (!this.state.dragging) {
            newState.dragging = true;
        }

        let prevKeys = this.items.map(item => item.key);
        let orderedKeys = this.items
            .map(item => ({
                y: (item.key == this.state.activeKey)? y : item.y,
                key: item.key,
            }))
            .sort((i0, i1) => (i0.y - i1.y))
            .map(item => item.key);

        this.childNode.style.top = y + 'px';

        if (!prevKeys.equals(orderedKeys)) {
            if (this.props.onReordering) {
                this.props.onReordering(orderedKeys);
            }

            newState.order = orderedKeys;
        }

        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    onDocMouseUp(ev) {
        if (this.state.activeKey) {
            this.setState({
                dragging: false,
                activeKey: null,
            });

            document.removeEventListener('mousemove', this.onDocMouseMoveBound);
            document.removeEventListener('mouseup', this.onDocMouseUpBound);

            let prevOrder = this.props.children.map(child => child.key);

            if (!prevOrder.equals(this.state.order) && this.props.onReorder) {
                this.props.onReorder(this.state.order);
            }
        }
    }
}
