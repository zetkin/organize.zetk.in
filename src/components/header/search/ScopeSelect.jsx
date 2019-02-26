import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import cx from 'classnames';


const SCOPES = [ ['all'], ['people', 'person'], ['campaign'], ['dialog'], ['maps'], ['survey'] ];

export default class ScopeSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        var selectedScope = this.props.value.length ? this.props.value : ['all'];
        var selectedClassNames = cx(
            'ScopeSelect-value',
            ...selectedScope
        );

        var listClassNames = cx({
            'ScopeSelect': true,
            'open': this.state.open
        });

        return (
            <ul className={ listClassNames }
                onClick={ this.onListClick.bind(this) }>

                <li key={ selectedScope.join('-') } className={ selectedClassNames }/>

                {SCOPES.map(function(scope) {
                    var classNames = cx(
                        'ScopeSelect-item',
                        ...scope,
                        {'selected': scope.every(s => selectedScope.includes(s))}
                    );

                    return (
                        <li key={ scope.join('-') } className={ classNames }
                            onClick={ this.onScopeClick.bind(this, scope) }>
                            <Msg id={ 'header.search.scopes.' + scope[0] }/></li>
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
    value: React.PropTypes.array,
    onSelect: React.PropTypes.func
};
