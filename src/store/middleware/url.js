import { setPanesFromUrlPath } from '../../actions/view';

export const subscribeToUrlChanges = store => {
    window.onpopstate = ev => {
        store.dispatch(setPanesFromUrlPath(location.pathname));
    };

    return store;
}

export const urlMiddleware = store => next => action => {
    let preState = store.getState();
    next(action);
    let postState = store.getState();

    // This is only possible (and relevant) when running on the client
    if (typeof history !== 'undefined') {
        // Data is immutable, so this comparison is enough
        if (preState.view != postState.view) {
            let view = postState.view;
            let path = '/' + view.section;

            if (view.panes.length) {
                path += '/' + view.panes.map(pane => {
                    if (pane.params && pane.params.length > 0) {
                        return pane.type + ':' + pane.params.join(',');
                    }
                    else {
                        return pane.type;
                    }
                }).join('/');
            }

            if (path !== location.pathname) {
                history.pushState(view, '', path);
            }
        }
    }
};
