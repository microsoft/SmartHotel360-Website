const initialState = {
    list: [],
    translation: {
        current: 0,
        factor: 30,
        units: 'rem',
        styles: {},
        min: 0,
        max: 0
    }
};

function createStyles(value, units) {
    return {
        transform: `translateX(${value}${units})`
    };
}

export const actionCreators = {
    request: () => (dispatch, getState) => {
        // Static content
        const data = [
            {
                title: null,
                imageUrl: null,
                description: null
            },
            {
                title: 'Book a smart conference room',
                imageUrl: '/assets/images/conference_room_1.png',
                description: 'Find the perfect place to hold that big meeting. Sign-in, customize and reserve a room now. SmartHotel360 Tools will help you find just what you need.'
            },
            {
                title: 'Smart room automatic adaptations',
                imageUrl: '/assets/images/conference_room_2.png',
                description: 'Using sensors and technology, the SmartHotel360 conference room can help dim the shades if it is a sunny day, or order catering services for your guests. The rooms can help take an ordinary experience to the extraordinary.'
            },
            {
                title: 'Person recognition',
                imageUrl: '/assets/images/conference_room_3.png',
                description: 'Our SmartHotel360 facial recognition technology will provide great insight into your audience. Identify the people in the conference room by name, and gain insight into engagement and efficiency of your presentation.'
            },
            {
                title: 'Personalize room on one click',
                imageUrl: '/assets/images/conference_room_4.png',
                description: 'Use the SmartHotel360 app to customize your presentation space. Create focus by hosting the custom environment you require for your audience. Making an impact just go easier, thanks to SmartHotel360.'
            }
        ];

        dispatch({ type: 'RECEIVE_FEATURES_ACTION', list: data });
    },

    translateLeft: () => (dispatch, getState) => {
        const state = getState().conferenceRoomsFeatures;
        let current = state.translation.current -= state.translation.factor;
        current = current < state.translation.max ? state.translation.current += state.translation.factor : current;

        dispatch({ type: 'TRANSLATE_ACTION', current: current});
    },

    translateRight: () => (dispatch, getState) => {
        const state = getState().conferenceRoomsFeatures;
        let current = state.translation.current += state.translation.factor;
        current = current > state.translation.min ? state.translation.current -= state.translation.factor : current;

        dispatch({ type: 'TRANSLATE_ACTION', current: current });
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'REQUEST_FEATURES_ACTION':
            return { ...state };
        case 'RECEIVE_FEATURES_ACTION':
            const length = action.list.length % 2 === 0 ? action.list.length : action.list.length + 1;
            const min = ((length / 2) - 3) * state.translation.factor;
            const max = -((length / 2) - 2) * state.translation.factor;

            return {
                ...state, list: action.list, translation: { ...state.translation, min: min, max: max }
            };
        case 'TRANSLATE_ACTION':
            return { ...state, translation: { ...state.translation, current: action.current, styles: createStyles(action.current, state.translation.units) } };
        default:
            return state || { ...initialState };
    }
};
