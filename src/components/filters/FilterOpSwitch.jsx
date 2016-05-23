import cx from 'classnames';
import React from 'react';


export default class FilterOpSwitch extends React.Component {
    static propTypes = {
        selected: React.PropTypes.string,
        onSelect: React.PropTypes.func,
    };

    render() {
        let selected = this.props.selected || 'add';
        let classes = cx('FilterOpSwitch', {
            'FilterOpSwitch-isAddState': (selected === 'add'),
            'FilterOpSwitch-isSubState': (selected === 'sub')
        });

        return (
            <ul className={ classes }>
                <li className="FilterOpSwitch-addOption"
                    onClick={ this.onSelect.bind(this, 'add') }/>
                <li className="FilterOpSwitch-subOption"
                    onClick={ this.onSelect.bind(this, 'sub') }/>
            </ul>
        );
    }

    onSelect(op) {
        if (this.props.onSelect) {
            this.props.onSelect(op);
        }
    }
}
