import { settings } from '../Settings';

export class Booking {
    constructor(hotelId, userId, from, to, adults, kids, babies, roomType, price) {
        this.hotelId = hotelId;
        this.userId = userId;
        this.from = from;
        this.to = to;
        this.adults = adults;
        this.kids = kids;
        this.babies = babies;
        this.roomType = roomType;
        this.price = price;
    }
}

export const ServicesDictionary = {
    1: 'sh-wifi',
    2: 'sh-parking',
    3: 'sh-tv',
    4: 'sh-air-conditioning',
    5: 'sh-dryer',
    6: 'sh-indoor-fireplace',
    7: 'sh-table',
    8: 'sh-breakfast',
    9: 'sh-kid-friendly',
    10: 'sh-airport-shutle',
    11: 'sh-pool',
    12: 'sh-fitness-centre',
    13: 'sh-gym',
    14: 'sh-hot-tub',
    15: 'sh-lunch',
    16: 'sh-wheelchair-accessible',
    17: 'sh-elevator'
};

export const Tabs = {
    Hotel: 1,
    Reviews: 2
}

export const Option = {
    Hotel: 1,
    Reviews: 2
}

const initialState = {
    room: {
        defaultPicture: '',
        pictures: [''],
        description: '',
        name: '',
        rating: 1,
        city: '',
        street: '',
        latitude: 0,
        longitude: 0,
        checkInTime: '',
        checkOutTime: '',
        pricePerNight: 0,
        phone: '',
        services: [],
        rooms: [{
            badgeSymbol: '',
            discountApplied: 0,
            localOrginalRoomPrice: 0,
            localRoomPrice: 0,
            originalRoomPrice: 0,
            roomId: 0,
            roomName: '',
            roomPrice: 0
        }]
    },
    reviews: [],
    isLoading: false,
    isBooking: false,
    booked: false,
    showConfirmationModal: false
};

export const actionCreators = {
    init: () => (dispatch, getState) => {
        dispatch({ type: 'INIT_ROOM_DETAIL_ACTION' });
    },

    requestRoom: (id, user) => (dispatch, getState) => {
        let url = `${settings().urls.hotels}Hotels/${id}`;
        if (user.id !== '' && user.id !== null) {
            url = `${settings().urls.hotels}Hotels/${id}?user=${user.id}`
        }   
        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_ROOM_ACTION', room: data });
            });

        dispatch({ type: 'REQUEST_ROOM_ACTION' });
    },

    requestReviews: (id) => (dispatch, getState) => {
        fetch(`${settings().urls.reviews}/reviews/hotel/${id}`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: 'RECEIVE_REVIEWS_ACTION', reviews: data });
            });

        dispatch({ type: 'REQUEST_REVIEWS_ACTION' });
    },

    book: (booking, user) => (dispatch, getState) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const auth = user.isFake ? `Email ${user.token}` : `Bearer ${user.token}`

        fetch(`${settings().urls.bookings}Bookings`, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
            .then(response => {
                dispatch({ type: 'BOOK_ROOM_ACTION', booked: true, showConfirmationModal: true });
            }, (e) => {
                dispatch({ type: 'BOOK_ROOM_ACTION', booked: false, showConfirmationModal: false });
            });

        dispatch({ type: 'BOOKING_ROOM_ACTION' });
    },

    dismissModal: () => (dispatch, getState) => {
        dispatch({ type: 'DISMISS_MODAL_ACTION' });
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT_ROOM_DETAIL_ACTION':
            return { ...state, isBooking: false, booked: false, showConfirmationModal: false };
        case 'REQUEST_ROOM_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_ROOM_ACTION':
            return { ...state, isLoading: false, room: action.room };
        case 'BOOKING_ROOM_ACTION':
            return { ...state, isBooking: true, booked: false };
        case 'BOOK_ROOM_ACTION':
            return { ...state, isBooking: false, booked: action.booked, showConfirmationModal: action.showConfirmationModal };
        case 'REQUEST_REVIEWS_ACTION':
            return { ...state, isLoading: true };
        case 'RECEIVE_REVIEWS_ACTION':
            return { ...state, isLoading: false, reviews: action.reviews };
        case 'DISMISS_MODAL_ACTION':
            return { ...state, showConfirmationModal: false };
        default:
            return state || { ...initialState };
    }
}