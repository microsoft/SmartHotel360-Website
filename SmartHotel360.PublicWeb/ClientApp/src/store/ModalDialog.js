const initialState = {
    isModalOpen: true
};

export const actionCreators = {
    init: () => (dispatch, getState) => {
        dispatch({ type: 'INIT_ACTION' });
    },
    open: () => (dispatch, getState) => {
        dispatch({ type: 'OPEN_MODAL_ACTION' });
    },
    close: () => (dispatch, getState) => {
        dispatch({ type: 'CLOSE_MODAL_ACTION' });
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT_ACTION':
            return { ...state, isModalOpen: false };
        case 'OPEN_MODAL_ACTION':
            return { ...state, isModalOpen: true };
        case 'CLOSE_MODAL_ACTION':
            return { ...state, isModalOpen: false };
        default:
            return { ...initialState };
    }
};
