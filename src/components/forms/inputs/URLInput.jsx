import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import normalizeUrl from 'normalize-url';
import cx from 'classnames';

import InputBase from './InputBase';

@injectIntl
export default class URLInput extends InputBase {

    renderInput() {
        let placeholder; 

        if(this.props.placeholder) {
            placeholder = this.props.intl.formatMessage(
                { id: this.props.placeholder });
        }

        return (
            <input type="text" ref="input"
                maxLength={ this.props.maxLength } value={ this.props.value }
                placeholder={ placeholder }
                onFocus={ this.props.onFocus }
                onChange={ this.onChange.bind(this) }
                onBlur={ this.handleBlur.bind(this) }
            />
        );
    }

    handleBlur(ev) {
        const url = ev.target.value;
        let normUrl = '';
        if(url != '') {
            try {
                normUrl = normalizeUrl(ev.target.value, { stripHash: false, stripwWWW: false, sortQueryParameters: false, stripAuthentication: false });
                this.props.onValueChange(this.props.name, normUrl);
            } catch(e) {
                // TODO: Do something with this.
                console.log('Invalid URL');
            }
        }
    }
}
