import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonTimeline from '../misc/timeline/PersonTimeline';
import { getListItemById } from '../../utils/store';
import { retrievePerson } from '../../actions/person';
import { retrievePersonTimeline } from '../../actions/timeline';


const mapStateToProps = (state, props) => ({
    personItem: getListItemById(state.people.personList, props.paneData.params[0]),
    timeline: state.timelines.byPerson[props.paneData.params[0]],
});


@connect(mapStateToProps)
@injectIntl
export default class PersonTimelinePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrievePersonTimeline(this.getParam(0)));
        this.props.dispatch(retrievePerson(this.getParam(0)));
    }

    getPaneTitle() {
        if (this.props.personItem && this.props.personItem.data) {
            const person = this.props.personItem.data;
            const name = person.name
                || ((person.first_name && person.last_name)?
                    (person.first_name + ' ' + person.last_name) : '');
            return this.props.intl.formatMessage({ id: 'panes.personTimeline.title' }, { name });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const timeline = this.props.timeline;
        const personItem = this.props.personItem;

        if (timeline && personItem) {
            if (timeline.isPending || personItem.isPending) {
                return <LoadingIndicator />;
            }
            else {
                const person = personItem.data;

                return (
                    <PersonTimeline
                        timeline={ timeline }
                        person={ person }
                        onSelect={ this.onEventSelect.bind(this) }
                        />
                );
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
}
