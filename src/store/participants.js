import * as types from '../actions';


export default function participants(state = null, action) {
    let byAction;
    let actionId;

    switch (action.type) {
        case types.SET_ACTION_CONTACT + '_FULFILLED':
            let contact = action.payload.participant;

            byAction = Object.assign({}, state.byAction);
            actionId = action.meta.actionId;
            byAction[actionId] = (byAction[actionId] || []).concat();
            if (!byAction[actionId].find(p => p.id == contact.id)) {
                byAction[actionId].push(contact);
            }
            return Object.assign({}, state, { byAction: byAction });

        case types.RETRIEVE_ACTION_PARTICIPANTS + '_PENDING':
            return Object.assign({}, state, {
                byAction: Object.assign({}, state.byAction, {
                    [action.meta.actionId]: [],
                }),
            });

        case types.RETRIEVE_ACTION_PARTICIPANTS + '_FULFILLED':
            return Object.assign({}, state, {
                byAction: Object.assign({}, state.byAction, {
                    [action.meta.actionId]: action.payload.data.data,
                }),
            });

        case types.ADD_ACTION_PARTICIPANT + '_FULFILLED':
            byAction = Object.assign({}, state.byAction);
            actionId = action.meta.actionId;
            byAction[actionId] = (byAction[actionId] || []).concat();
            byAction[actionId].push(action.payload.data.data);
            return Object.assign({}, state, { byAction: byAction });

        case types.ADD_ACTION_PARTICIPANTS + '_FULFILLED':
            byAction = Object.assign({}, state.byAction);
            actionId = action.meta.actionId;
            byAction[actionId] = (byAction[actionId] || []).concat();
            action.payload.forEach(payload => {
                let data = payload.data.data;
                if (!byAction[actionId].find(p => p.id == data.id)) {
                    byAction[actionId].push(data);
                }
            });
            return Object.assign({}, state, { byAction });

        case types.REMOVE_ACTION_PARTICIPANT + '_FULFILLED':
            byAction = Object.assign({}, state.byAction);
            actionId = action.meta.actionId;
            byAction[actionId] = (byAction[actionId] || []).filter(p =>
                p.id != action.meta.personId);
            return Object.assign({}, state, { byAction: byAction });

        case types.MOVE_ACTION_PARTICIPANT:
            let move = action.payload.move;
            byAction = state.byAction;
            return Object.assign({}, state, {
                moves: addMove(state, action.payload.move),
                byAction: moveBetweenLists(byAction,
                    move.from, move.to, move.person),
            });

        case types.EXECUTE_ACTION_PARTICIPANT_MOVES + '_FULFILLED':
            let executedMoves = action.payload.map(r => r.meta.move)
                .filter(m => m !== undefined);

            return Object.assign({}, state, {
                // Keep only the moves that weren't executed
                moves: state.moves.filter(m0 => (!executedMoves.find(m1 =>
                    movesMatch(m0, m1))))
            });
            return state;

        case types.UNDO_ACTION_PARTICIPANT_MOVES:
            let moves = action.payload.moves;
            byAction = state.byAction;
            for (let i = 0; i < moves.length; i++) {
                byAction = moveBetweenLists(byAction,
                    moves[i].to, moves[i].from, moves[i].person);
            }

            return Object.assign({}, state, {
                moves: state.moves.filter(m => moves.indexOf(m) < 0),
                byAction: byAction,
            });

        case types.SEND_ACTION_REMINDERS + '_FULFILLED':
            actionId = action.meta.actionId;
            byAction = Object.assign({}, state.byAction);
            byAction[actionId] = byAction[actionId].map(p => {
                let updated = action.payload.data.data.find(res =>
                    res.person.id == p.id);

                if (updated) {
                    return Object.assign({}, p, {
                        reminder_sent: updated.sent,
                    });
                }
                else {
                    return p;
                }
            });

            return Object.assign({}, state, { byAction });

        default:
            return state || {
                byAction: {},
                moves: []
            };
    }
}

function movesMatch(m0, m1) {
    return (m0.from == m1.from && m0.to == m1.to && m0.person == m1.person);
}

function moveBetweenLists(byAction, fromAction, toAction, personId) {
    let person = null;

    byAction = Object.assign({}, byAction);
    let arr0 = byAction[fromAction] = byAction[fromAction].concat();
    let arr1 = byAction[toAction] = byAction[toAction].concat();

    for (let i = 0; i < arr0.length; i++) {
        if (arr0[i].id == personId) {
            person = arr0[i];
            arr0.splice(i, 1);
            break;
        }
    }

    if (person) {
        arr1.push(person);
    }

    return byAction;
}

function addMove(state, move) {
    var i;
    var oldMove;
    var updated = false;
    var moves = state.moves.concat();

    // Search for inverses
    for (i = 0; i < moves.length; i++) {
        oldMove = moves[i];
        if (oldMove.person == move.person
            && oldMove.from == move.to && oldMove.to == move.from) {
            // This is an inverse of a previous move, i.e. it undos it,
            // and can thus just be removed since the result is no move.
            moves.splice(i, 1);
            updated = true;
            break;
        }
    }

    // Search for chain
    oldMove = moves.find(m =>
        (m.to == move.from && m.person == move.person));

    if (oldMove) {
        // This extends a chain of moves for this person. Just update the
        // previous move to avoid storing the entire chain.
        oldMove.to = move.to;
        updated = true;
    }

    // Search for replace
    oldMove = moves.find(m =>
        (m.from == move.to && m.person == move.person));

    if (oldMove) {
        // This moves the person to an action from which it was previously
        // moved away, i.e. A > B, C > A. In effect, there has only really
        // been one move made, C > B.
        oldMove.from = move.from;
        updated = true;
    }

    if (!updated) {
        // If no old move was updated this is a new move
        moves.push(move);
    }

    return moves;
}
