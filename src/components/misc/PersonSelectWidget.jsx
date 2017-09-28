import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { FormattedMessage as Msg } from 'react-intl';

import DraggableAvatar from './DraggableAvatar';
import Link from './Link';
import Person from './elements/Person';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { retrievePeople } from '../../actions/person';
import { getListItemById } from '../../utils/store';


const contactTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props) {
        return {
            targetType: 'person',
            onDropPerson: person => {
                if (props.onSelect) {
                    props.onSelect(person);
                }
            }
        }
    }
};

const collectPerson = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isPersonOver: monitor.isOver(),
    canDropPerson: monitor.canDrop()
});

const mapStateToProps = state => ({
    personList: state.people.personList,
});


@connect(mapStateToProps)
@DropTarget('person', contactTarget, collectPerson)
export default class PersonSelectWidget extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func,
        person: React.PropTypes.object,
        personList: React.PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            forceShowInput: false,
        };
    }

    componentDidMount() {
        if (!this.props.person) {
            this.props.dispatch(retrievePeople(null, null));
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let inputWasVisible = this.state.forceShowInput || !this.props.person;
        let inputWillBeVisible = nextState.forceShowInput || !nextProps.person;

        if (inputWillBeVisible && !inputWasVisible) {
            if (nextProps.personList && nextProps.personList.isPending) {
                return;
            }

            this.props.dispatch(retrievePeople(null, null));
        }
    }

    render() {
        let content = [];
        let classes = cx('PersonSelectWidget', {
            selected: !!this.props.person,
            selecting: !this.props.person,
            changing: this.state.forceShowInput,
        });

        if (this.props.person) {
            content.push(
                <DraggableAvatar key="avatar"
                    person={ this.props.person }
                    />,
            );
        }

        if (this.state.forceShowInput || !this.props.person) {
            let personList = this.props.personList;
            let people = personList.items? personList.items.map(i => i.data) : [];

            content.push(
                <RelSelectInput key="input" name="person"
                    labelFunc={ p => p.first_name + ' ' + p.last_name }
                    minFilterLength={ 2 }
                    onValueChange={ this.onInputChange.bind(this) }
                    objects={ people }
                    />
            );

            if (this.state.forceShowInput) {
                content.push(
                    <p key="instructions"
                        className="PersonSelectWidget-instructions">
                        <Link msgId="misc.personSelectWidget.undoLink"
                            onClick={ this.onUndoLinkClick.bind(this) }
                            />
                    </p>
                );
            }
            else {
                content.push(
                    <p key="instructions"
                        className="PersonSelectWidget-instructions">
                        <Msg id="misc.personSelectWidget.selectInstructions"
                            />
                    </p>
                );
            }
        }
        else {
            let selectLink = (
                <Link msgId="misc.personSelectWidget.selectLink"
                    onClick={ this.onSelectLinkClick.bind(this) }
                    />
            );

            content.push(
                <Person key="name"
                    person={ this.props.person }
                    />,
                <p key="instructions"
                    className="PersonSelectWidget-instructions">
                    <Msg id="misc.personSelectWidget.changeInstructions"
                        values={{ selectLink }}
                        />
                </p>,
                <a key="clearLink"
                    className="PersonSelectWidget-clearLink"
                    onClick={ this.onClearLinkClick.bind(this) }>
                    <i className="fa fa-remove"></i>
                </a>
            );
        }

        return this.props.connectDropTarget(
            <div className={ classes }>
                { content }
            </div>
        );
    }

    onInputChange(name, value) {
        let item = getListItemById(this.props.personList, value);

        if (item) {
            this.setState({
                forceShowInput: false,
            }, () => {
                if (this.props.onSelect) {
                    this.props.onSelect(item.data)
                }
            });
        }
    }

    onSelectLinkClick() {
        this.setState({
            forceShowInput: true
        });
    }

    onClearLinkClick() {
        if (this.props.onSelect) {
            this.props.onSelect(null);
        }
    }

    onUndoLinkClick() {
        this.setState({
            forceShowInput: false,
        });
    }
}
