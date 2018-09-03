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
            return state || { ...initialState };
    }
};
