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
                let text = ev.target.innerText;
                if (text.length <= this.props.maxLength) {
                    this.setState({
                        content: text,
                    });
                } else {
                    text = this.state.content
                }
                console.log(this.state.content)

                const content = this.state.content;
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