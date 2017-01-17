import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import cx from 'classnames';


const SCOPES = [ 'all', 'people', 'campaign', 'dialog', 'maps' ];

export default class ScopeSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        var selectedScope = this.props.value || 'all';
        var selectedClassNames = cx(
            'ScopeSelect-value',
            selectedScope
        );

        var listClassNames = cx({
            'ScopeSelect': true,
            'open': this.state.open
        });

        return (
            <ul className={ listClassNames }
                onClick={ this.onListClick.bind(this) }>

                <li key={ selectedScope } className={ selectedClassNames }/>

                {SCOPES.map(function(scope) {
                    var classNames = cx(
                        'ScopeSelect-item',
                        scope,
                        {'selected': scope == selectedScope}
                    );

                    return (
                        <li key={ scope } className={ classNames }
                            onClick={ this.onScopeClick.bind(this, scope) }>
                            <Msg id={ 'header.search.scopes.' + scope }/></li>
                    );
                }, this)}
            </ul>
        );
    }

    onListClick() {
        this.setState({
            open: !this.state.open
        });
    }

    onScopeClick(scope) {
        if (this.props.onSelect) {
            this.props.onSelect(scope);
        }
    }
}

ScopeSelect.propTypes = {
    value: React.PropTypes.string,
    onSelect: React.PropTypes.func
};
