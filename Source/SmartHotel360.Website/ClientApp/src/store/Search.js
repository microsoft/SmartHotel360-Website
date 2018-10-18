import * as moment from 'moment';
import { settings } from '../Settings';

export const Option = {
    Where: 1,
    When: 2,
    Guests: 3,
    People: 4
}

export const Tab = {
    Smart: 1,
    Conference: 2
}

export const Guest = {
    Adults: 1,
    Kids: 2,
    Babies: 3
}

export class City {
    constructor (id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
    }
}

export class Guests {
    constructor(adults, kids, baby, rooms, work, pet) {
        this.adults = adults;
        this.kids = kids;
        this.baby = baby;
        this.rooms = rooms;
        this.work = work;
        this.pet = pet;
    }
}

export class People {
    constructor(total) {
        this.total = total;
    }
}

export class Dates {
    constructor(startDate, endDate, isStartDateSelected, isEndDateSelected) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.isStartDateSelected = isStartDateSelected;
        this.isEndDateSelected = isEndDateSelected;
    }

    get startFull() {
        return this.startDate ? `${this.startDate.format('DD MMM')}` : '';
    }

    get endFull() {
        return this.endDate ? `${this.endDate.format('DD MMM')}` : '';
    }

    get endFullComplex() {
        return this.endDate ? `${this.endDate.format('dd, MMM DD, YYYY')}` : '';
    }
}

const initialState = {
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

export function getFullCity(city) {
    return city.name ? `${city.name}, ${city.country}` : '';
}

export function getFullRooms(guests) {
    return guests.rooms > 1 ? `${guests.rooms} Rooms` : `${guests.rooms} Room`;
}

export function getFullGuests(guests) {
    return (guests.adults + guests.kids + guests.baby) > 1 ? `${guests.adults + guests.kids + guests.baby} Guests` : `${guests.adults + guests.kids + guests.baby} Guest`;
}

export function getFullRoomsGuests(guests) {
    return `${getFullRooms(guests)}, ${getFullGuests(guests)}`;
}

export function getFullPeople(people) {
    return people.total ? `${people.total} People` : '';
}

export function getShortDate(date) {
    date = moment(date);
    return date ? `${date.format('DD MMM')}` : '';
}

export function getShortDates(startDate, endDate) {
    return `${getShortDate(startDate)} - ${startDate === endDate ? '' : getShortDate(endDate)}`;
}

export function getLongDate(date) {
    date = moment(date);
    return date ? `${date.format('dd, MMM DD, YYYY')}` : '';
}

export const actionCreators = {

    init: () => (dispatch, getState) => {
        dispatch({ type: 'INIT_ACTION'});
    },
    searchWhere: (value) => (dispatch, getState) => {
        const state = getState().search;

        if (value.length < state.minLength) {
            dispatch({ type: 'RECEIVE_WHERE_ACTION', list: [] });
            return;
        }

        dispatch({ type: 'RECEIVE_WHERE_ACTION', list: [] });

        fetch(`${settings().urls.hotels}Cities?name=${value}`)
            .then(response => response.json())
            .then(data => {
                data = data.map((item) => {
                    return new City(item.id, item.name, item.country);
                });
                dispatch({ type: 'RECEIVE_WHERE_ACTION', list: data });
            });

        dispatch({ type: 'REQUEST_WHERE_ACTION' });
    },

    selectWhere: (city) => (dispatch, getState) => {
        dispatch({ type: 'SELECT_WHERE_ACTION', city: city });
    },

    resetWhere: () => (dispatch, getState) => {
        dispatch({ type: 'RESET_WHERE_ACTION'});
    },

    resetWhen: () => (dispatch, getState) => {
        dispatch({ type: 'RESET_WHEN_ACTION' });
    },

    resetGuests: () => (dispatch, getState) => {
        dispatch({ type: 'RESET_GUESTS_ACTION' });
    },

    resetPeople: () => (dispatch, getState) => {
        dispatch({ type: 'RESET_PEOPLE_ACTION' });
    },

    selectWhenStart: (date) => (dispatch, getState) => {
        dispatch({ type: 'SELECT_WHEN_ACTION', next: Option.When, start: date, end: date});
    },

    selectWhenEnd: (date) => (dispatch, getState) => {
        const state = getState().search;
        const start = state.when.value.startDate;
        dispatch({ type: 'SELECT_WHEN_ACTION', next: Tab.Smart ? Option.Guests : Option.People, start: (start || moment()), end: date });
    },

    updateGuestsAdults: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: value, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false , pet: guests.pet || false});
    },

    updateGuestsKids: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: value, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false, pet: guests.pet || false });
    },

    updateGuestsBaby: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: value, rooms: guests.rooms || 0, work: guests.work || false, pet: guests.pet || false});
    },

    updateGuestsRooms: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: value, work: guests.work || false, pet: guests.pet || false });
    },

    updateGuestsWork: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: value, pet: guests.pet || false });
    },

    updateGuestsPet: (value) => (dispatch, getState) => {
        const guests = getState().search.guests.value;
        dispatch({ type: 'SELECT_GUESTS_ACTION', adults: guests.adults || 0, kids: guests.kids || 0, baby: guests.baby || 0, rooms: guests.rooms || 0, work: guests.work || false, pet: value});
    },

    updatePeople: (value) => (dispatch, getState) => {
        dispatch({ type: 'SELECT_PEOPLE_ACTION', total: value || 0 });
    }
};

export const reducer = (state, action) => {
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
            return state || { ...initialState };
    }
};
