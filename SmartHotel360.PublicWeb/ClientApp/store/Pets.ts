import { Reducer } from 'redux';
import { AppThunkAction } from 'ClientApp/store';
import { addTask } from 'domain-task';

const api = `/api/Pets`;

export enum Status {
    None,
    Ok,
    Bad
}

export class PetInfo {
    public base64: string;
}

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface PetsState {
    isUploading: boolean;
    isThinking: boolean;
    id: string | null;
    image: string | null;
    status: PetAcceptedResponse;
}
const initialState: PetsState = {
    isUploading: false,
    isThinking: false,
    id: null,
    image: null,
    status: {approved: false, message: ''}
};

class PetAcceptedResponse {
    public approved: boolean | null
    public message: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface InitAction { type: 'INIT_ACTION' }
interface RequestPetUploadAction { type: 'REQUEST_PET_UPLOAD_ACTION', image: string }
interface ReceivePetUploadAction { type: 'RECEIVE_PET_UPLOAD_ACTION', id: string }
interface StartPoolingAction { type: 'START_POOLING_ACTION' }
interface EndPoolingAction { type: 'END_POOLING_ACTION', status: PetAcceptedResponse }


type KnownAction = InitAction | RequestPetUploadAction | ReceivePetUploadAction | StartPoolingAction | EndPoolingAction;

// ---------------
// FUNCTIONS - Our functions to reuse in this code.
function postImage(pet: PetInfo): Promise<string> {
    let fetchTask = fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pet)
    })
        .then(response => response.json() as Promise<string>)

    addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    return fetchTask;
}

const maximumAttempts = 100;
const differenceTime = 400;

let startTime: number;
let isGettingInfo: boolean;
let attempts: number;
let frame: any;

function recursiveGet(id: string, resolve: any) {
    let now = Date.now();
    if (!isGettingInfo && (now - startTime > differenceTime)) {
        isGettingInfo = true;
        let fetchTask = fetch(api + `?identifier=${id}`)
            .then(response => response.json() as Promise<PetAcceptedResponse>)
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
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    }

    frame = requestAnimationFrame(() => recursiveGet(id, resolve));
}

function getStatus(id: string): Promise<PetAcceptedResponse> {
    startTime = Date.now();
    isGettingInfo = false;
    attempts = 0;

    return new Promise(resolve => {
        frame = requestAnimationFrame(() => recursiveGet(id, resolve));
    });
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    init: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'INIT_ACTION'});
    },

    uploadPet: (pet: PetInfo): AppThunkAction<KnownAction> => (dispatch, getState) => {
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

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<PetsState> = (state: PetsState, action: KnownAction) => {
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
            // the following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
