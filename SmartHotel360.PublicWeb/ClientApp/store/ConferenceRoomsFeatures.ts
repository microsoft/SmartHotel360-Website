import { AppThunkAction } from 'ClientApp/store';
import { Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface Feature {
    title: string | null;
    imageUrl: string | null;
    description: string | null;
}

type TranslationUnits = 'rem' | 'px' | 'em' | '%';

export interface Translation {
    current: number;
    factor: number;
    units: TranslationUnits;
    styles: any;
    min: number;
    max: number;
}

export interface FeaturesState {
    list: Feature[];
    translation: Translation;
}

const initialState: FeaturesState = {
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

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RequestFeaturesAction { type: 'REQUEST_FEATURES_ACTION' }
interface ReceiveFeaturesAction { type: 'RECEIVE_FEATURES_ACTION', list: Feature[] }
interface TranslateAction { type: 'TRANSLATE_ACTION', current: number }


type KnownAction = RequestFeaturesAction | ReceiveFeaturesAction | TranslateAction;

// ---------------
// FUNCTIONS - Our functions to reuse in this code.
function createStyles(value: number, units: TranslationUnits): any {
    return {
        transform: `translateX(${value}${units})`
    };
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    request: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
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

    translateLeft: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().conferenceRoomsFeatures;
        let current = state.translation.current -= state.translation.factor;
        current = current < state.translation.max ? state.translation.current += state.translation.factor : current;

        dispatch({ type: 'TRANSLATE_ACTION', current: current});
    },

    translateRight: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().conferenceRoomsFeatures;
        let current = state.translation.current += state.translation.factor;
        current = current > state.translation.min ? state.translation.current -= state.translation.factor : current;

        dispatch({ type: 'TRANSLATE_ACTION', current: current });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<FeaturesState> = (state: FeaturesState, action: KnownAction) => {
    let translation = 0;

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
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
