import cx from 'classnames';
import React from 'react';


export default class EditableText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            content: "",
        };
    }

    render() {
        const tagName = this.props.tagName || 'p';
        const props = {
            className: cx('EditableText', this.props.className, {
                editing: this.state.editing,
                empty: !this.props.content,
                flashing: this.props.flash,
            }),
            contentEditable: true,
            onFocus: ev => {
                const text = ev.target.innerText;
                const state = {
                    editing: true,
                };

                if (text != this.props.content && text == this.props.placeholder) {
                    state.text = '';
                }

                this.setState(state);
            },
            onBlur: ev => {
                const text = ev.target.innerText;
                if (text != this.props.content) {
                    if (this.props.onChange) {
                        this.props.onChange(text);
                    }
                }

                this.setState({
                    editing: false,
                });
            },
            onInput: ev => {
                if (this.props.maxLength && ev.target.innerText.length <= this.props.maxLength) {
                    this.setState({
                        content: ev.target.innerText,
                    });
                } else {
                    ev.target.innerText = this.state.content
                }
                this.props.onChange()            
            },
            dangerouslySetInnerHTML: {
                __html: this.state.editing ? this.props.content : (this.props.content || this.props.placeholder),
            },
        };

        return React.createElement(tagName, props);
    }
}