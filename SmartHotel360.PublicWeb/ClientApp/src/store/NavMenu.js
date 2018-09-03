const initialState = {
    isHome: true
};

function checkIsHome(pathname) {
    return pathname === '/';
}

function chooseDispatcher(location, dispatch) {
    if (checkIsHome(location.pathname)) {
        dispatch({ type: 'NAVIGATE_HOME_ACTION' });
        return;
    }

    dispatch({ type: 'NAVIGATE_ACTION' });
}

export const actionCreators = {
    listen: (history) => (dispatch, getState) => {
        history.listen((location) => chooseDispatcher(location, dispatch));
        chooseDispatcher(history.location, dispatch)
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'NAVIGATE_ACTION':
            return { ...state, isHome: false };
        case 'NAVIGATE_HOME_ACTION':
            return { ...state, isHome: true };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above using any because only one case
            const exhaustiveCheck = action;
    }

    return state || { ...initialState };
};
