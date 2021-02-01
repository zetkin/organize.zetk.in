import { connect } from 'react-redux';
import cx from 'classnames';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from '../../Avatar';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../../forms/inputs/TextInput';
import {
    beginSearch,
    clearSearch,
    resetSearchQuery,
    search,
} from '../../../../actions/search';
import makeRandomString from '../../../../utils/makeRandomString';

const mapStateToProps = state => ({
    search: state.search,
});

@connect(mapStateToProps)
export default class PersonViewCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSelect: false,
            fieldId: makeRandomString(10)
        };

        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentWillUnmount(){
        this.props.dispatch(clearSearch(this.state.fieldId));
    }

    render() {
        const classes = cx('PersonViewCell', this.props.column.type, {
            'selected': !!this.props.content,
        });

        let selectDialog = null;
        if (this.state.showSelect) {
            const searchStore = this.props.search[this.state.fieldId];

            let resultList = null;
            if (searchStore && searchStore.isPending) {
                resultList = <LoadingIndicator/>;
            }
            else if (searchStore && searchStore.results) {
                if (searchStore.results.length) {
                    resultList = (
                        <ul>
                        {searchStore.results.map(match => (
                            <li key={ match.data.id }
                                onClick={ this.onPersonClick.bind(this, match.data) }>
                                <Avatar person={ match.data }/>
                                <span>
                                    { match.data.first_name } { match.data.last_name }
                                </span>
                            </li>
                        ))}
                        </ul>
                    );
                }
                else if (searchStore.query) {
                    resultList = (
                        <div className="PersonViewCell-noMatches">
                            <Msg id="misc.personViewTable.cells.local_person.noMatches"
                                values={{ query: searchStore.query }}
                                />
                        </div>
                    );
                }
            }
            else if (this.props.content) {
                resultList = (
                    <div className="PersonViewCell-current">
                        <Avatar person={ this.props.content }
                            onClick={ () => this.props.openPane('person', this.props.content.id) }
                            />
                        <div>
                            { this.props.content.first_name } { this.props.content.last_name }
                        </div>
                        <a onClick={ this.onPersonClick.bind(this, { id: null }) }>
                            <Msg id="misc.personViewTable.cells.local_person.clear"/>
                        </a>
                    </div>
                );
            }

            selectDialog = (
                <div ref="selectDialog" className="PersonViewCell-select">
                    <TextInput name="search"
                        onFocus={ this.onFocus.bind(this) }
                        onValueChange={ this.onQueryChange.bind(this) }
                        labelMsg="misc.personViewTable.cells.local_person.inputLabel"
                        placeholder="misc.personViewTable.cells.local_person.inputPlaceholder"/>
                    <div className="PersonViewCell-selectResults">
                        { resultList }
                    </div>
                </div>
            );
        }

        const avatar = this.props.content?
            <Avatar person={ this.props.content }/> : null;

        return (
            <td className={ classes }>
                <div className="PersonViewCell-avatar"
                    onClick={ this.onClickCurrent.bind(this) }
                    >
                    { avatar }
                </div>
                { selectDialog }
            </td>
        );
    }

    onPersonClick(person) {
        if (this.props.onSelect) {
            this.props.onSelect(person);
        }

        this.closeSelectDialog();
    }

    onQueryChange(name, query) {
        if (query){
            this.props.dispatch(search(this.state.fieldId, query));
        }
        else {
            this.props.dispatch(resetSearchQuery(this.state.fieldId));
        }
    }

    onFocus(ev) {
        let searchStore = this.props.search[this.state.fieldId];
        if (!searchStore || !searchStore.isActive) {
            this.props.dispatch(beginSearch(this.state.fieldId, ['person']));
        }
    }

    onClickCurrent() {
        const show = !this.state.showSelect;

        this.setState({
            showSelect: show,
        });

        if (show) {
            document.addEventListener('click', this.onClickOutside);
        }
        else {
            document.removeEventListener('click', this.onClickOutside);
        }
    };

    onClickOutside(ev) {
        const selectDialog = ReactDOM.findDOMNode(this.refs.selectDialog);
        if (selectDialog && !selectDialog.contains(ev.target)) {
            this.closeSelectDialog();
        }
    }

    closeSelectDialog() {
        this.setState({
            showSelect: false,
        });

        document.removeEventListener('click', this.onClickOutside);

        this.props.dispatch(clearSearch(this.state.fieldId));
    }
}
