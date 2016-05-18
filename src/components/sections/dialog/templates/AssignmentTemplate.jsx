import React from 'react';
import cx from 'classnames';

import Form from '../../../forms/Form';


export default class AssignmentTemplate extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        image: React.PropTypes.string.isRequired,
    };

    render() {
        let type = this.props.type;
        let classes = cx('AssignmentTemplate', 'AssignmentTemplate-' + type);

        return (
            <div className={ classes }>
                <h2>{ this.props.title }</h2>
                <img className="AssignmentTemplate-image"
                    src={ this.props.image }/>

                <div className="AssignmentTemplate-config">
                    <Form ref="form">
                    { this.props.children }
                    </Form>
                </div>

                <button className="AssignmentTemplate-okButton"
                    onClick={ this.onOkClick.bind(this) }>Create</button>
            </div>
        );
    }

    onOkClick() {
        if (this.props.onCreate) {
            this.props.onCreate(this.props.type, this.refs.form.getValues());
        }
    }
}
