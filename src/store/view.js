import * as types from '../actions';

import makeRandomString from '../utils/makeRandomString';


export default function viewState(state = null, action) {
    if (action.type === types.SET_PANES_FROM_URL_PATH) {
        let path = action.payload.path;

        // Remove leading slash
        if (path[0] === '/') {
            path = path.substr(1);
        }

        // Remove trailing slash
        if (path[path.length-1] === '/') {
            path = path.substr(0, path.length-1);
        }

        let segments = path.split('/');

        // Remove first segment if empty
        if (segments[0] === '') {
            segments.splice(0, 1);
        }

        let section, panes;

        if (segments.length == 0) {
            section = '';
            panes = [];
        }
        else {
            section = segments[0];
            panes = segments.slice(1).map(segment => {
                let fields = segment.split(':');
                let id = '$' + makeRandomString(6);
                let type = fields[0];
                let params = (fields.length > 1)? fields[1].split(',') : [];

                return { id, type, params };
            });
        }

        return Object.assign({}, state, {
            section, panes,
        });
    }
    else if (action.type == types.OPEN_PANE) {
        let panes = state.panes.concat();
        panes.splice(action.payload.index + 1, 0, {
            id: '$' + makeRandomString(6),
            type: action.payload.paneType,
            params: action.payload.params || [],
        });

        return Object.assign({}, state, {
            panes
        });
    }
    else if (action.type == types.CLOSE_PANE) {
        let panes = state.panes.concat();
        panes.splice(action.payload.index, 1);

        return Object.assign({}, state, {
            panes
        });
    }
    else if (action.type == types.REPLACE_PANE) {
        let panes = state.panes.concat();
        panes[action.payload.index] = {
            id: '$' + makeRandomString(6),
            type: action.payload.paneType,
            params: action.payload.params || [],
        };

        return Object.assign({}, state, {
            panes
        });
    }
    else if (action.type == types.PUSH_PANE) {
        let panes = state.panes.concat([{
            id: '$' + makeRandomString(6),
            type: action.payload.paneType,
            params: action.payload.params || [],
        }]);

        return Object.assign({}, state, {
            panes
        });
    }
    else if (action.type == types.GOTO_SECTION) {
        let section = action.payload.section || '';
        let panes = state.panes;

        if (action.payload.subSection) {
            panes = [{
                id: '$' + makeRandomString(6),
                type: action.payload.subSection,
                params: [],
            }];
        }
        else {
            panes = [];
        }

        return Object.assign({}, state, {
            section, panes
        });
    }
    else if (action.type == types.CREATE_CALL_ASSIGNMENT + '_FULFILLED') {
        // Replace the relevant AddCallAssignmentPane with a CallAssignmentPane
        // showing the newly created assignment.
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'callassignment',
                        params: [ action.payload.data.data.id ]
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_QUERY + '_FULFILLED') {
        // Replace the relevant AddQueryPane with an EditQueryPane
        // showing the newly created query.
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'editquery',
                        params: [ action.payload.data.data.id ]
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_SURVEY + '_FULFILLED') {
        // Replace the relevant AddSurveyPane with a SurveyPane
        // showing the newly created survey.
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'survey',
                        params: [ action.payload.data.data.id ]
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_SURVEY_ELEMENT + '_FULFILLED' && action.meta.paneId) {
        // Replace the relevant AddSurveyPane with a SurveyPane
        // showing the newly created survey.
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'editsurveyquestion',
                        params: [
                            action.meta.surveyId,
                            action.payload.data.data.id
                        ],
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_ROUTE + '_FULFILLED') {
        // Replace the relevant pane with a RoutePane showing the
        // newly created route.
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'route',
                        params: [ action.payload.data.data.id ],
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_CANVASS_ASSIGNMENT + '_FULFILLED') {
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'canvassassignment',
                        params: [ action.payload.data.data.id ],
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.CREATE_ASSIGNED_ROUTE + '_FULFILLED') {
        return Object.assign({}, state, {
            panes: state.panes.map(paneData => {
                if (paneData.id == action.meta.paneId) {
                    return {
                        id: '$' + makeRandomString(6),
                        type: 'assignedroute',
                        params: [ action.payload.data.data.id ],
                    };
                }
                else {
                    return paneData;
                }
            }),
        });
    }
    else if (action.type == types.MERGE_PERSON_DUPLICATES + '_FULFILLED') {
        // Close the relevant pane
        return Object.assign({}, state, {
            panes: state.panes.filter(paneData => paneData.id != action.meta.paneId),
        });
    }
    else if (action.type == types.MOVE_ACTION_PARTICIPANT) {
        if (!state.panes.find(p => p.type == 'moveparticipants')) {
            return Object.assign({}, state, {
                panes: state.panes.concat([{
                    id: '$' + makeRandomString(6),
                    type: 'moveparticipants',
                    params: []
                }])
            });
        }
        else {
            return state;
        }
    }
    else if (action.meta && action.meta.paneId && action.type.slice(-10) == '_FULFILLED') {
        // Generically close pane after successful async action
        return Object.assign({}, state, {
            panes: state.panes.filter(paneData =>
                paneData.id != action.meta.paneId),
        });
    }
    else {
        return state || {
            section: '',
            panes: [],
        };
    }
}
