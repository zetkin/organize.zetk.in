import * as types from './';


export function retrieveGroup(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_GROUP,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'groups', id)
                    .get(),
            }
        });
    };
}

export function retrieveGroups() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_GROUPS,
            payload: {
                promise: z.resource('orgs', orgId, 'groups')
                    .get(),
            }
        });
    };
}

export function updateGroup(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_GROUP,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'groups', id).patch(data),
            }
        });
    };
}

export function deleteGroup(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_GROUP,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'groups', id).del(),
            }
        });
    };
}

export function retrieveGroupMembers(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_GROUP_MEMBERS,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'groups', id, 'members')
                    .get(),
            }
        });
    };
}

export function addGroupMember(groupId, personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.ADD_GROUP_MEMBER,
            meta: { groupId, personId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'groups', groupId, 'members', personId).put(),
            }
        });
    }
}

export function removeGroupMember(groupId, personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;

        dispatch({
            type: types.REMOVE_GROUP_MEMBER,
            meta: { groupId, personId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'groups', groupId, 'members', personId).del()
            }
        });
    }
}

export function promoteGroupManager(groupId, personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = { role: 'manager' };

        dispatch({
            type: types.PROMOTE_GROUP_MANAGER,
            meta: { groupId, personId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'groups', groupId, 'members', personId).put(data),
            }
        });
    }
}

export function demoteGroupManager(groupId, personId) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        let data = { role: null };

        dispatch({
            type: types.DEMOTE_GROUP_MANAGER,
            meta: { groupId, personId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'groups', groupId, 'members', personId).put(data),
            }
        });
    }
}
