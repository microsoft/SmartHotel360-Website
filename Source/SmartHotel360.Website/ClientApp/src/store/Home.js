const initialState = {
    testimonial: {},
    isLoading: false
};

export const actionCreators = {
    requestTestimonial: () => (dispatch, getState) => {
        fetch(`/api/Testimonials`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_TESTIMONIAL_ACTION', testimonial: data });
            });

        dispatch({ type: 'REQUEST_TESTIMONIAL_ACTION' });
    },
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'REQUEST_TESTIMONIAL_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_TESTIMONIAL_ACTION':
            return { ...state, isLoading: false, testimonial: action.testimonial };
        default:
            return state || { ...initialState };
    }
};
