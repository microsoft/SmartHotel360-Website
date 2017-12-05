import { Reducer } from 'redux';
import { AppThunkAction } from 'ClientApp/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface ModalDialogState {
    isModalOpen: boolean;
    onRef?: any;
}

const initialState: ModalDialogState = {
    isModalOpen: true
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface InitAction { type: 'INIT_ACTION' }
interface OpenModalAction { type: 'OPEN_MODAL_ACTION' }
interface CloseModalAction { type: 'CLOSE_MODAL_ACTION' }

type KnownAction = InitAction | OpenModalAction | CloseModalAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    init: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let state = getState().modalDialog;
        dispatch({ type: 'INIT_ACTION' });
    },
    open: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'OPEN_MODAL_ACTION' });
    },
    close: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'CLOSE_MODAL_ACTION' });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<ModalDialogState> = (state: ModalDialogState, action: KnownAction) => {
    switch (action.type) {
        case 'INIT_ACTION':
            return { ...state, isModalOpen: false };
        case 'OPEN_MODAL_ACTION':
            return { ...state, isModalOpen: true };
        case 'CLOSE_MODAL_ACTION':
            return { ...state, isModalOpen: false };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above using any because only one case
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
