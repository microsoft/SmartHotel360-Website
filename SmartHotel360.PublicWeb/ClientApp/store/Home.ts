import { Reducer } from 'redux';
import { AppThunkAction } from 'ClientApp/store';
import { addTask } from 'domain-task';

interface Testimonial {
    customerName: string;
    text: string;
}

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface HomeState {
    testimonial: Testimonial;
    isLoading: boolean;
}

const initialState: HomeState = {
    testimonial: {} as Testimonial,
    isLoading: false
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RequestTestimonialAction { type: 'REQUEST_TESTIMONIAL_ACTION' }
interface ReceiveTestimonialAction { type: 'RECEIVE_TESTIMONIAL_ACTION', testimonial: Testimonial }

type KnownAction = RequestTestimonialAction | ReceiveTestimonialAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestTestimonial: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/Testimonials`)
            .then(response => response.json() as Promise<Testimonial>)
            .then(data => {
                dispatch({ type: 'RECEIVE_TESTIMONIAL_ACTION', testimonial: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TESTIMONIAL_ACTION' });
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<HomeState> = (state: HomeState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_TESTIMONIAL_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_TESTIMONIAL_ACTION':
            return { ...state, isLoading: false, testimonial: action.testimonial };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
