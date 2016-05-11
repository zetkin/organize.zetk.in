import Z from 'zetkin';

import * as types from '.';


export function retrieveActionParticipants(actionId) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_ACTION_PARTICIPANTS,
            meta: { actionId },
            payload: {
                promise: Z.resource('orgs', orgId, 'actions', actionId,
                    'participants').get(),
            }
        });
    };
}

export function addActionParticipant(personId, actionId) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.ADD_ACTION_PARTICIPANT,
            meta: { actionId, personId },
            payload: {
                promise: Z.resource('orgs', orgId, 'actions', actionId,
                    'participants', personId).put()
            }
        });
    };
}

export function moveActionParticipant(personId, oldActionId, newActionId) {
    return {
        type: types.MOVE_ACTION_PARTICIPANT,
        payload: {
            move: {
                person: personId,
                to: newActionId,
                from: oldActionId
            }
        }
    };
}

export function executeActionParticipantMoves(moves) {
    return function(dispatch, getState) {
        let orgId = getState().org.activeId;
        let apiCalls = [];

        // TODO: Make some server-side batch executer for this?
        for (let i = 0; i < moves.length; i++) {
            var move = moves[i];
            apiCalls.push(Z.resource('orgs', orgId, 'actions',
                move.from, 'participants', move.person)
                .meta('move', move).del());
            apiCalls.push(Z.resource('orgs', orgId, 'actions',
                move.to, 'participants', move.person).put());
        }

        dispatch({
            type: types.EXECUTE_ACTION_PARTICIPANT_MOVES,
            meta: { moves },
            payload: {
                promise: Promise.all(apiCalls),
            }
        });
    }
}

export function undoActionParticipantMoves(moves) {
    return {
        type: types.UNDO_ACTION_PARTICIPANT_MOVES,
        payload: { moves },
    };
}

export function clearActionParticipantMoves() {
    return {
        type: types.CLEAR_ACTION_PARTICIPANT_MOVES,
    }
}
