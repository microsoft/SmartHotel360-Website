const api = `/api/Pets`;

export const Status = {
    None: 1,
    Ok: 2,
    Bad: 3
}

export class PetInfo {
    base64;
}

const initialState = {
    isUploading: false,
    isThinking: false,
    id: null,
    image: null,
    status: {approved: false, message: ''}
};

function postImage(pet) {
    let fetchTask = fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pet)
    })
        .then(response => response.json())

    return fetchTask;
}

const maximumAttempts = 100;
const differenceTime = 400;

let startTime;
let isGettingInfo;
let attempts;
let frame;

function recursiveGet(id, resolve) {
    let now = Date.now();
    if (!isGettingInfo && (now - startTime > differenceTime)) {
        isGettingInfo = true;
        fetch(api + `?identifier=${id}`)
            .then(response => response.json())
            .then(status => {
                isGettingInfo = false;

                if (status.message !== '') {
                    cancelAnimationFrame(frame);
                    resolve(status);
                } else {
                    attempts++;
                    if (attempts >= maximumAttempts) {
                        cancelAnimationFrame(frame);
                        resolve(status);
                    }
                }

                startTime = now;
            })
    }

    frame = requestAnimationFrame(() => recursiveGet(id, resolve));
}

function getStatus(id) {
    startTime = Date.now();
    isGettingInfo = false;
    attempts = 0;

    return new Promise(resolve => {
        frame = requestAnimationFrame(() => recursiveGet(id, resolve));
    });
}

export const actionCreators = {
    init: () => (dispatch, getState) => {
        dispatch({ type: 'INIT_ACTION'});
    },

    uploadPet: (pet) => (dispatch, getState) => {
        postImage(pet)
            .then(id => {
                dispatch({ type: 'RECEIVE_PET_UPLOAD_ACTION', id: id });

                // Now start to get status
                dispatch({ type: 'START_POOLING_ACTION' });
                getStatus(id).then(status => {
                    dispatch({ type: 'END_POOLING_ACTION', status: status });
                });
            });
        dispatch({ type: 'REQUEST_PET_UPLOAD_ACTION', image: pet.base64 });
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT_ACTION':
            return {
                ...state, isUploading: false, isThinking: false, image: null, status: {approved: null, message: ''}};
        case 'REQUEST_PET_UPLOAD_ACTION':
            return { ...state, isUploading: true, isThinking: false, image: action.image, status: { approved: null, message: '' } };
        case 'RECEIVE_PET_UPLOAD_ACTION':
            return { ...state, isUploading: false, isThinking: false, id: action.id };
        case 'START_POOLING_ACTION':
            return { ...state, isUploading: false, isThinking: true };
        case 'END_POOLING_ACTION':
            return { ...state, isUploading: false, isThinking: false, image: null, status: action.status };
        default:
            return { ...initialState };
    }
};
