/// <reference path='../../node_modules/msal/out/msal.d.ts' />

import { Reducer } from 'redux';
import { Md5 } from 'ts-md5/dist/md5';
import { AppThunkAction } from 'ClientApp/store';
import { settings } from '../Settings';

// TODO: Env variables
const tenant = settings.b2c.tenant;
const policy = settings.b2c.policy;
const client = settings.b2c.client;

const fakeAuth = settings.fakeAuth;
const useFakeAuth = fakeAuth.userId != '' && fakeAuth.userId != null;

const scopes = ['openid'];
const authority = `https://login.microsoftonline.com/tfp/${tenant}/${policy}`;

let userManager: Msal.UserAgentApplication;


interface User {
    user: Msal.User,
    email: string
}

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface UserState {
    id: string | null;
    name: string | null;
    email: string;
    gravatar: string;
    token: string;
    error: boolean;
    isLoading: boolean;
}

const initialState: UserState = {
    id: null,
    name: null,
    email: '',
    gravatar: '',
    token: '',
    error: false,
    isLoading: false
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface InitAction { type: 'INIT_ACTION' }
interface SetUserAction { type: 'SET_USER_ACTION', id: string | null, name: string | null, email: string, gravatar: string, token: string, isFake: boolean }
interface LoginAction { type: 'LOGIN_ACTION', error: boolean }
interface LogoutAction { type: 'LOGOUT_ACTION' }

type KnownAction = InitAction | LoginAction | LogoutAction | SetUserAction;

let getUserData = (accessToken: string): User => {
    const user = userManager.getUser();
    // get email
    const jwt = Msal.Utils.decodeJwt(accessToken);
    let email = user.name;
    if (jwt && jwt.JWSPayload) {
        const decoded = JSON.parse(atob(jwt.JWSPayload));
        if (decoded && decoded.emails && decoded.emails[0]) {
            email = decoded.emails[0];
        }
    }
    return {
        user: user,
        email: email
    };
};

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    init: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        userManager = new Msal.UserAgentApplication(client, authority,
            (errorDesc: any, token: any, error: any, tokenType: any) => {
                if (token) {
                    userManager.acquireTokenSilent(scopes).then(accessToken => {
                        const userData = getUserData(accessToken);
                        dispatch({
                            type: 'SET_USER_ACTION', id: userData.user.userIdentifier, name: userData.user.name, email: userData.email, gravatar: 'https://www.gravatar.com/avatar/' + Md5.hashStr(userData.email.toLowerCase()).toString(), token: accessToken, isFake: false
                        });
                    }, error => {

                        userManager.acquireTokenPopup(scopes).then(function (accessToken) {
                            const userData = getUserData(accessToken);
                            dispatch({
                                type: 'SET_USER_ACTION', id: userData.user.userIdentifier, name: userData.user.name, email: userData.email, gravatar: 'https://www.gravatar.com/avatar/' + Md5.hashStr(userData.email.toLowerCase()).toString(), token: accessToken, isFake: false
                            });
                        }, function (error) {
                            dispatch({ type: 'SET_USER_ACTION', id: null, name: null, email: '', gravatar: '', token: '', isFake: false });
                        });
                    });

                } else {
                    dispatch({ type: 'INIT_ACTION', id: null, name: null, email: '', gravatar: '', token: '' });
                }

            });
        dispatch({ type: 'INIT_ACTION' });
    },

    login: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        if (useFakeAuth) {
            dispatch({
                type: 'SET_USER_ACTION', id: fakeAuth.userId, name: fakeAuth.name, email: fakeAuth.userId, gravatar: fakeAuth.picUrl, token: fakeAuth.userId, isFake: true
            });
        }
        else {
            userManager.acquireTokenSilent(scopes)
                .then((accessToken: any) => {
                    dispatch({ type: 'LOGIN_ACTION', error: false });
                }, (error: any) => {
                    userManager.loginRedirect(scopes);
                    dispatch({ type: 'LOGIN_ACTION', error: true });
                });
        }
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'LOGOUT_ACTION' });
        localStorage.clear();
        userManager.logout();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<UserState> = (state: UserState, action: KnownAction) => {
    switch (action.type) {
        case 'INIT_ACTION':
            return { ...state, isLoading: false };
        case 'SET_USER_ACTION':
            return { ...state, error: false, id: action.id, name: action.name, email: action.email, gravatar: action.gravatar, token: action.token, isLoading: false };
        case 'LOGIN_ACTION':
            return { ...state, error: action.error, isLoading: true };
        case 'LOGOUT_ACTION':
            return { ...state, error: false };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { ...initialState };
};
