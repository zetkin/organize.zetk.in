import cx from 'classnames';
import React from 'react';


export default class EditableText extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
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
                // Check maxLength of  ev.target.innerText
                // If not maxlength  Set state content to  ev.target.innerText
                // Else set  ev.target.innerText= state content
                if(this.props.maxLength && value.length > this.props.maxLength) {
                    return
                }   this.props.onChange(attr, value);   
            },
            dangerouslySetInnerHTML: {
                __html: this.state.editing? this.props.content : (this.props.content || this.props.placeholder),
            },
        };

        return React.createElement(tagName, props);
    }
}