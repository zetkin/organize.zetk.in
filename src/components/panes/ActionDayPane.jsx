import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ActionList from '../misc/actionlist/ActionList';
import { retrieveActions } from '../../actions/action';
import { moveActionParticipant } from '../../actions/participant';


@connect(state => state)
export default class ActionDayPane extends PaneBase {
    componentDidMount() {
        if (this.props.actions.actionList.items.length == 0) {
            this.props.dispatch(retrieveActions());
        }
    }

    getPaneTitle(data) {
        const d = moment(this.getParam(0));

        return 'Actions on ' + d.format('YYYY-MM-DD');
    }

    renderPaneContent(data) {
        let date = moment(this.getParam(0));
        let actionList = this.props.actions.actionList;
        let actions = actionList.items.map(i => i.data).filter(a =>
            moment(a.start_time).isSame(date, 'day'));

        return [
            <input key="prevBtn" type="button" value="<"
                onClick={ this.onClickPrev.bind(this) }/>,
            <input key="nextBtn" type="button" value=">"
                onClick={ this.onClickNext.bind(this) }/>,
            <ActionList key="actionList" actions={ actions }
                dispatch={ this.props.dispatch }
                participants={ this.props.participants }
                onMoveParticipant={ this.onMoveParticipant.bind(this) }
                onActionOperation={ this.onActionOperation.bind(this) }/>
        ];
    }

    onClickPrev() {
        const curDate = Date.create(this.getParam(0));
        const newDate = curDate.rewind({ days: 1 });
        const dateStr = newDate.format('{yyyy}-{MM}-{dd}');

        this.gotoPane('actionday', dateStr);
    }

    onClickNext() {
        const curDate = Date.create(this.getParam(0));
        const newDate = curDate.advance({ days: 1 });
        const dateStr = newDate.format('{yyyy}-{MM}-{dd}');

        this.gotoPane('actionday', dateStr);
    }

    onMoveParticipant(action, person, oldAction) {
        this.props.dispatch(moveActionParticipant(
            person.id, oldAction.id, action.id));

        if (this.props.participants.moves.length) {
            this.pushPane('moveparticipants');
        }
    }

    onActionOperation(action, operation) {
        if (operation == 'edit') {
            this.openPane('editaction', action.id);
        }
        else if (operation == 'sendreminders') {
            this.openPane('reminder', action.id);
        }
    }
}
