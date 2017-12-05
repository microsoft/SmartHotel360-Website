import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'ClientApp/store';
import { Reducer } from 'redux';
import { settings } from '../Settings';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface Room {
    id: number;
    name: string;
    itemType: string;
    city: string;
    rating: number;
    price: number;
    picture: string
}

export enum Sources {
    Featured,
    Filtered
}

export type StarValues = 1 | 2 | 3 | 4 | 5;

interface Filters {
    rating: StarValues,
    minPrice: number,
    maxPrice: number
}

export interface RoomsState {
    list: Room[];
    isLoading: boolean;
    filters: Filters
}

const initialState: RoomsState = {
    list: [],
    filters: {
        rating: 4,
        minPrice: 0,
        maxPrice: 1000
    },
    isLoading: false,
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RequestFeaturedAction { type: 'REQUEST_FEATURED_ACTION' }
interface ReceiveFeaturedAction { type: 'RECEIVE_FEATURED_ACTION', list: Room[] }
interface RequestFilteredAction { type: 'REQUEST_FILTERED_ACTION' }
interface ReceiveFilteredAction { type: 'RECEIVE_FILTERED_ACTION', list: Room[] }
interface UpdatePriceAction { type: 'UPDATE_PRICE_ACTION', minPrice: number, maxPrice: number }
interface UpdateRatingAction { type: 'UPDATE_RATING_ACTION', rating: StarValues }

type KnownAction = RequestFeaturedAction | ReceiveFeaturedAction | RequestFilteredAction | ReceiveFilteredAction | UpdatePriceAction | UpdateRatingAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requestFeatured: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

       let fetchTask = fetch(`${settings.urls.hotels}Featured`)
            .then(response => response.json() as Promise<Room[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_FEATURED_ACTION', list: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_FEATURED_ACTION' });
    },

    requestFiltered: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        const state = getState();
        let fetchTask = fetch(`${settings.urls.hotels}Hotels/search?cityId=${state.search.where.value.id}&rating=${state.rooms.filters.rating}&minPrice=${state.rooms.filters.minPrice}&maxPrice=${state.rooms.filters.maxPrice}`, { method: 'GET' })
            .then(response => response.json() as Promise<Room[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_FILTERED_ACTION', list: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_FILTERED_ACTION' });
    },

    updatePrice: (minPrice: number, maxPrice: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_PRICE_ACTION', minPrice, maxPrice });
    },

    updateRating: (rating: StarValues): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_RATING_ACTION', rating });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<RoomsState> = (state: RoomsState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_FEATURED_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_FEATURED_ACTION':
            return { ...state, isLoading: false, list: action.list };
        case 'REQUEST_FILTERED_ACTION':
            return { ...state, isLoading: true };
        case 'UPDATE_PRICE_ACTION':
            return { ...state, filters: { ...state.filters, minPrice: action.minPrice, maxPrice: action.maxPrice } };
        case 'UPDATE_RATING_ACTION':
            return { ...state, filters: { ...state.filters, rating: action.rating } };
        case 'RECEIVE_FILTERED_ACTION':
            return {
                ...state, isLoading: false, list: action.list
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
