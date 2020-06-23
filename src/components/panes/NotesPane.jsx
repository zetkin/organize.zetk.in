import React from 'react';
import { injectIntl, FormattedMessage as Msg, FormattedDate, FormattedTime } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrievePerson } from '../../actions/person';
import { createNote, retrieveNotes } from '../../actions/note';

let RichTextEditor = null;
if (typeof window != 'undefined') {
    RichTextEditor = require('react-rte').default;
}

const mapStateToProps = (state, props) => ({
    personItem: getListItemById(state.people.personList, props.paneData.params[1]),
    notes: state.notes.byPerson[props.paneData.params[1]],
});


@connect(mapStateToProps)
@injectIntl
export default class NotesPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            inBrowser: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveNotes(this.getParam(0), this.getParam(1)));
        if (this.getParam(0) == 'person') {
            this.props.dispatch(retrievePerson(this.getParam(1)));
        }

        this.setState({
            inBrowser: true,
            value: RichTextEditor.createValueFromString('', 'html'),
        });
    }

    getPaneTitle() {
        if (this.props.personItem && this.props.personItem.data) {
            const person = this.props.personItem.data;
            const context = person.name
                || ((person.first_name && person.last_name)?
                    (person.first_name + ' ' + person.last_name) : '');
            return this.props.intl.formatMessage({ id: 'panes.notes.title' }, { context });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const notes = this.props.notes;
        const personItem = this.props.personItem;

        if (notes && personItem) {
            if (notes.isPending || personItem.isPending) {
                return <LoadingIndicator />;
            }
            else {
                let textEditor = null;

                if (this.state.inBrowser) {
                    const m = id => this.props.intl
                        .formatMessage({ id: 'panes.editText.editor.' + id });

                    const toolbarConfig = {
                        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'BLOCK_TYPE_BUTTONS'],
                        INLINE_STYLE_BUTTONS: [
                            { label: m('bold'), style: 'BOLD', className: 'custom-css-class' },
                            { label: m('italic'), style: 'ITALIC' },
                            { label: m('underline'), style: 'UNDERLINE' },
                        ],
                        BLOCK_TYPE_DROPDOWN: [
                            { label: m('p'), style: 'unstyled' },
                            { label: m('h1'), style: 'header-one' },
                            { label: m('h2'), style: 'header-two' },
                            { label: m('h3'), style: 'header-three' },
                        ],
                        BLOCK_TYPE_BUTTONS: [
                            { label: m('ul'), style: 'unordered-list-item' },
                            { label: m('ol'), style: 'ordered-list-item' },
                        ],
                    };

                    textEditor = (
                        <div key="form" className="NotesPane-form">
                            <RichTextEditor
                                className="NotesPane-editor"
                                value={ this.state.value }
                                toolbarConfig={ toolbarConfig }
                                onChange={ this.onChange.bind(this) }/>
                            <Button labelMsg="panes.notes.saveButton"
                                onClick={ this.onClickSave.bind(this) } />
                        </div>
                    );
                }

                const notesElements = notes.items
                    .sort((i0, i1) => new Date(i1.data.created) - new Date(i0.data.created))
                    .map(noteItem => {
                        return (
                            <div key={ noteItem.data.id } className="NotesPane-note">
                                <div className="NotesPane-noteMeta">
                                    <Msg id="panes.notes.meta"
                                        values={{
                                            author: noteItem.data.author.name,
                                            date: <FormattedDate value={ noteItem.data.created }/>,
                                            time: <FormattedTime value={ noteItem.data.created }/>,
                                        }}/>
                                </div>
                                <div className="NotesPane-noteContent"
                                    dangerouslySetInnerHTML={{ __html: noteItem.data.text }}
                                    />
                            </div>
                        );
                    });

                return [textEditor].concat(notesElements);
            }
        }
        else {
            return null;
        }
    }

    onEventSelect(eventType, data) {
        if (eventType == 'action') {
            this.openPane('action', data.id);
        }
    }

    onChange(value) {
        this.setState({ value });
    }

    onClickSave() {
        const html = this.state.value.toString('html');
        this.props.dispatch(createNote(this.getParam(0), this.getParam(1), html));
        this.setState({
            value: RichTextEditor.createValueFromString('', 'html'),
        });
    }
}
