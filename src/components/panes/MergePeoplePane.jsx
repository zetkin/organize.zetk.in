import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import { mergeDuplicates } from '../../actions/person';


const mapStateToProps = (state, props) => {
    let duplicateItem = null;
    if (state.people.duplicateList && state.people.duplicateList.items) {
        duplicateItem = state.people.duplicateList.items
            .find(i => {
                let id = '$' + i.data.objects[0].id.toString();
                return id == props.paneData.params[0];
            });
    }

    return {
        duplicateItem,
    }
};

const OVERRIDE_FIELDS = [
    'ext_id',
    'first_name',
    'last_name',
    'email',
    'phone',
    'co_address',
    'street_address',
    'zip',
    'city',
];

const stateFromProps = props => {
    let override = {};
    let objects = props.duplicateItem.data.objects.concat();

    objects.sort((o0, o1) => {
        if (o0.is_user && !o1.is_user) return -1;
        if (o1.is_user && !o0.is_user) return 1;
        return 0;
    });

    OVERRIDE_FIELDS.forEach(field => {
        // Get unique non-null values
        let values = objects
            .map(o => o[field])
            .filter(val => !!val)
            .reverse()
            .filter((val, idx, arr) => arr.indexOf(val, idx+1) === -1)
            .reverse();

        if (values.length) {
            override[field] = values[0];
        }
    });

    return { override };
};

@injectIntl
@connect(mapStateToProps)
export default class MergePeoplePane extends PaneBase {
    constructor(props) {
        super(props);

        if (props.duplicateItem) {
            this.state = stateFromProps(props);
        }
    }

    getPaneTitle(data) {
        if (this.props.duplicateItem) {
            return this.props.intl.formatMessage(
                { id: 'panes.mergePeople.title' },
                { count: this.props.duplicateItem.data.objects.length });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.duplicateItem && nextProps.duplicateItem) {
            this.setState(stateFromProps(nextProps));
        }
    }

    renderPaneContent(data) {
        if (this.props.duplicateItem) {
            let canChange = false;
            let objects = this.props.duplicateItem.data.objects;

            let overrideItems = OVERRIDE_FIELDS.map(field => {
                let msgId = 'panes.mergePeople.override.fields.' + field;
                let values = objects
                    .map(o => o[field])
                    .filter(val => !!val)
                    .map(val => val.trim())
                    .filter((val, idx, arr) => arr.lastIndexOf(val) === idx);

                let valueElem = null;

                if (values.length > 1) {
                    canChange = true;

                    let options = values.map(value => (
                        <option key={ value } value={ value }>{ value }</option>
                    ));

                    valueElem = (
                        <select key={ field } value={ this.state.override[field] }
                            onChange={ this.onOverrideChange.bind(this, field) }>
                            { options }
                        </select>
                    );
                }
                else if (values.length == 1) {
                    valueElem = <span>{ values[0] }</span>;
                }

                if (valueElem) {
                    let classes = cx('MergePeoplePane-fieldItem', {
                        multiple: values.length > 1,
                    });

                    return (
                        <li key={ field } className={ classes }>
                            <Msg tagName="label" id={ msgId }/>
                            { valueElem }
                        </li>
                    );
                }
            });

            let instructions = null;
            if (canChange) {
                instructions = (
                    <div className="MergePeoplePane-overrideInstructions">
                        <Msg tagName="small"
                            id="panes.mergePeople.override.instructions"/>
                    </div>
                );
            }

            return [
                <Msg key="intro" tagName="p" id="panes.mergePeople.intro"/>,
                <div key="override" className="MergePeoplePane-override">
                    <Msg tagName="h3" id="panes.mergePeople.override.h"/>
                    <ul className="MergePeoplePane-overrideList">
                        { overrideItems }
                    </ul>
                    { instructions }
                </div>,
            ];
        }
    }

    renderPaneFooter(paneData) {
        return (
            <Button className="MergePeoplePane-execute"
                labelMsg="panes.mergePeople.execButton"
                onClick={ this.onClickExecute.bind(this) }
                />
        );
    }

    onClickExecute() {
        let objects = this.props.duplicateItem.data.objects.concat();
        let override = this.state.override;

        // Sort objects so that any who are connected to a user account
        // appear first. The master should be a user to not lose access.
        objects.sort((o0, o1) => {
            if (o0.is_user && !o1.is_user) return -1;
            if (o1.is_user && !o0.is_user) return 1;
            return 0;
        });

        let data = {
            id: this.props.duplicateItem.data.id,
            objects: objects.map(o => o.id),
        };

        this.props.dispatch(mergeDuplicates(data, override, this.props.paneData.id));
    }

    onOverrideChange(field, ev) {
        this.setState({
            override: {
                [field]: ev.target.value,
            }
        });
    }
}
