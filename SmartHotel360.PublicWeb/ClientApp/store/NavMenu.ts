import { Reducer } from 'redux';
import { History, Location } from 'history';
import { AppThunkAction } from 'ClientApp/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface NavMenuState {
    isHome: boolean;
}

const initialState: NavMenuState = {
    isHome: true
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface NavigateAction { type: 'NAVIGATE_ACTION' }
interface NavigateHomeAction { type: 'NAVIGATE_HOME_ACTION' }

type KnownAction = NavigateAction | NavigateHomeAction ;

// ---------------
// FUNCTIONS - Our functions to reuse in this code.
function checkIsHome(pathname: string): boolean {
    return pathname === '/';
}

function chooseDispatcher(location: Location, dispatch: (action: KnownAction) => void): void {
    if (checkIsHome(location.pathname)) {
        dispatch({ type: 'NAVIGATE_HOME_ACTION' });
        return;
    }

    dispatch({ type: 'NAVIGATE_ACTION' });
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    listen: (history: History): AppThunkAction<KnownAction> => (dispatch, getState) => {
        history.listen((location: Location) => chooseDispatcher(location, dispatch));
        chooseDispatcher(history.location, dispatch)
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<NavMenuState> = (state: NavMenuState, action: KnownAction) => {
    switch (action.type) {
        case 'NAVIGATE_ACTION':
            return { ...state, isHome: false };
        case 'NAVIGATE_HOME_ACTION':
            return { ...state, isHome: true };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above using any because only one case
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
