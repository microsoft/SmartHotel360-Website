import { settings } from '../Settings';

export const Sources = {
    Featured: 1,
    Filtered: 2
}

const initialState = {
    list: [],
    filters: {
        rating: 4,
        minPrice: 0,
        maxPrice: 1000
    },
    isLoading: false,
};

export const actionCreators = {
    requestFeatured: () => (dispatch, getState) => {
       fetch(`${settings().urls.hotels}Featured`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_FEATURED_ACTION', list: data });
            });

        dispatch({ type: 'REQUEST_FEATURED_ACTION' });
    },

    requestFiltered: () => (dispatch, getState) => {

        const state = getState();
        fetch(`${settings().urls.hotels}Hotels/search?cityId=${state.search.where.value.id}&rating=${state.rooms.filters.rating}&minPrice=${state.rooms.filters.minPrice}&maxPrice=${state.rooms.filters.maxPrice}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_FILTERED_ACTION', list: data });
            });

        dispatch({ type: 'REQUEST_FILTERED_ACTION' });
    },

    updatePrice: (minPrice, maxPrice) => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_PRICE_ACTION', minPrice, maxPrice });
    },

    updateRating: (rating) => (dispatch, getState) => {
        dispatch({ type: 'UPDATE_RATING_ACTION', rating });
    }
};

export const reducer = (state, action) => {
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
            return state || { ...initialState };
    }
};
