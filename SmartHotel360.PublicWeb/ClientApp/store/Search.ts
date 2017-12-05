import { Reducer } from 'redux';
import * as moment from 'moment';
import { AppThunkAction } from 'ClientApp/store';
import { settings } from '../Settings';
import { fetch, addTask } from 'domain-task';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export enum Option {
    Where,
    When,
    Guests,
    People
}

export enum Tab {
    Smart,
    Conference
}

export enum Guest {
    Adults,
    Kids,
    Babies
}

interface Input<T> {
    value: T;
    list: T[];
}

export class City {
    constructor(
        public id?: number,
        public name?: string,
        public country?: string) {}
}

export class Guests {
    constructor(
        public adults: number,
        public kids: number,
        public baby: number,
        public rooms: number,
        public work?: boolean,
        public pet?: boolean) { }
}

export class People {
    constructor(
        public total: number) { }
}

export class Dates {
    constructor(
        public startDate?: moment.Moment,
        public endDate?: moment.Moment,
        public isStartDateSelected = false,
        public isEndDateSelected = false
    ) { }

    public get startFull(): string {
        return this.startDate ? `${this.startDate.format('DD MMM')}` : '';
    }

    public get endFull(): string {
        return this.endDate ? `${this.endDate.format('DD MMM')}` : '';
    }

    public get endFullComplex(): string {
        return this.endDate ? `${this.endDate.format('dd, MMM DD, YYYY')}` : '';
    }
}

export interface SearchState {
    isLoading: boolean;
    minLength: number;
    where: Input<City>;
    when: Input<Dates>;
    guests: Input<Guests>;
    people: Input<People>;
}

const initialState: SearchState = {
    minLength: 3,
    isLoading: false,
    where: {
        value: new City(),
        list: []
    },
    when: {
        value: new Dates(),
        list: []
    },
    guests: {
        value: new Guests(1, 0, 0, 1, false),
        list: []
    },
    people: {
        value: new People(1),
        list: []
    }
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface InitAction { type: 'INIT_ACTION' }
interface RequestWhereAction { type: 'REQUEST_WHERE_ACTION' }
interface ReceiveWhereAction { type: 'RECEIVE_WHERE_ACTION', list: City[]}
interface SelectWhereAction  { type: 'SELECT_WHERE_ACTION', city: City }
interface ResetWhereAction   { type: 'RESET_WHERE_ACTION' }
interface ResetWhenAction { type: 'RESET_WHEN_ACTION' }
interface ResetGuestsAction { type: 'RESET_GUESTS_ACTION' }
interface ResetPeopleAction { type: 'RESET_PEOPLE_ACTION' }
interface SelectWhenAction { type: 'SELECT_WHEN_ACTION', next: Option, start?: moment.Moment, end?: moment.Moment}
interface SelectGuestsAction { type: 'SELECT_GUESTS_ACTION', adults: number, kids: number, baby: number, rooms: number, work: boolean, pet: boolean}
interface SelectPepopleAction { type: 'SELECT_PEOPLE_ACTION', total: number }

type KnownAction = InitAction | RequestWhereAction | ReceiveWhereAction | SelectWhereAction | ResetWhereAction | SelectWhenAction | SelectGuestsAction | SelectPepopleAction | ResetWhenAction | ResetGuestsAction | ResetPeopleAction;

// ---------------
// FUNCTIONS - Our functions to reuse in this code.
export function getFullCity(city: City) {
    return city.name ? `${city.name}, ${city.country}` : '';
}

export function getFullRooms(guests: Guests) {
    return guests.rooms > 1 ? `${guests.rooms} Rooms` : `${guests.rooms} Room`;
}

export function getFullGuests(guests: Guests) {
    return (guests.adults + guests.kids + guests.baby) > 1 ? `${guests.adults + guests.kids + guests.baby} Guests` : `${guests.adults + guests.kids + guests.baby} Guest`;
}

export function getFullRoomsGuests(guests: Guests) {
    return `${getFullRooms(guests)}, ${getFullGuests(guests)}`;
}

export function getFullPeople(people: People) {
    return people.total ? `${people.total} People` : '';
}

export function getShortDate(date?: moment.Moment) {
    date = moment(date);
    return date ? `${date.format('DD MMM')}` : '';
}

export function getShortDates(startDate?: moment.Moment, endDate?: moment.Moment) {
    return `${getShortDate(startDate)} - ${startDate === endDate ? '' : getShortDate(endDate)}`;
}

export function getLongDate(date: moment.Moment) {
    date = moment(date);
    return date ? `${date.format('dd, MMM DD, YYYY')}` : '';
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {

    init: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'INIT_ACTION'});
    },
    searchWhere: (value: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().search;

        if (value.length < state.minLength) {
            dispatch({ type: 'RECEIVE_WHERE_ACTION', list: [] });
            return;
        }

        dispatch({ type: 'RECEIVE_WHERE_ACTION', list: [] });

        let fetchTask = fetch(`${settings.urls.hotels}Cities?name=${value}`)
            .then(response => response.json() as Promise<any>)
            .then(data => {
                data = data.map((item: any) => {
                    return new City(item.id, item.name, item.country);
                });
                dispatch({ type: 'RECEIVE_WHERE_ACTION', list: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_WHERE_ACTION' });
    },

    selectWhere: (city: City): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SELECT_WHERE_ACTION', city: city });
    },

    resetWhere: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'RESET_WHERE_ACTION'});
    },

    resetWhen: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'RESET_WHEN_ACTION' });
    },

    resetGuests: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'RESET_GUESTS_ACTION' });
    },

    resetPeople: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'RESET_PEOPLE_ACTION' });
    },

    selectWhenStart: (date: moment.Moment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const end = getState().search.when.value.endDate;
        dispatch({ type: 'SELECT_WHEN_ACTION', next: Option.When, start: date, end: date});
    },

    selectWhenEnd: (date: moment.Moment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().search;
        const start = state.when.value.startDate;
        dispatch({ type: 'SELECT_WHEN_ACTION', next: Tab.Smart === Tab.Smart ? Option.Guests : Option.People, start: (start || moment()), end: date });
    },

    updateGuestsAdults: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: value, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false , pet: guests.pet || false});
    },

    updateGuestsKids: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: value, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false, pet: guests.pet || false });
    },

    updateGuestsBaby: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: value, rooms: guests.rooms || 0, work: guests.work || false, pet: guests.pet || false});
    },

    updateGuestsRooms: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: value, work: guests.work || false, pet: guests.pet || false });
    },

    updateGuestsWork: (value: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: value, pet: guests.pet || false });
    },

    updateGuestsPet: (value: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false, pet: value});
    },


    updatePeople: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SELECT_PEOPLE_ACTION', total: value || 0 });
    }
};


// ----------------
// rEDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<SearchState> = (state: SearchState, action: KnownAction) => {
    switch (action.type) {
        case 'INIT_ACTION': 
            return { ...state };
        case 'REQUEST_WHERE_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_WHERE_ACTION':
            return { ...state, isLoading: false, where: { ...state.where, list: action.list } };
        case 'SELECT_WHERE_ACTION':
            return { ...state, where: { ...state.where, value: action.city } };
        case 'RESET_WHERE_ACTION':
            return { ...state, where: { ...state.where, value: new City(), list: [] } };
        case 'SELECT_WHEN_ACTION':
            return { ...state, when: { ...state.when, value: new Dates(action.start, action.end) } };
        case 'RESET_WHEN_ACTION':
            return { ...state, when: { ...state.when, value: new Dates()} };
        case 'SELECT_GUESTS_ACTION':
            return { ...state, guests: { ...state.guests, value: new Guests(action.adults, action.kids, action.baby, action.rooms, action.work, action.pet) } };
        case 'RESET_GUESTS_ACTION':
            return { ...state, guests: { ...state.guests, value: new Guests(1, 0, 0, 1, false) } };
        case 'RESET_PEOPLE_ACTION':
            return { ...state, people: { ...state.people, value: new People(1) } };
        case 'SELECT_PEOPLE_ACTION':
            return { ...state, people: { ...state.people, value: new People(action.total) } };
        default:
            // the following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // for unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
