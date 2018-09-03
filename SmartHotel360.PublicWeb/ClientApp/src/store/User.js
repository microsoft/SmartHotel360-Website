import { Md5 } from 'ts-md5/dist/md5';
import { settings } from '../Settings';


const scopes = ['openid'];

let userManager;

const initialState = {
    id: null,
    name: null,
    email: '',
    gravatar: '',
    token: '',
    error: false,
    isLoading: false
};

let getUserData = (accessToken) => {
    const user = userManager.getUser();
    
    // get email
    const jwt = window.Msal.Utils.decodeJwt(accessToken);
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

export const actionCreators = {
    init: () => (dispatch, getState) => {
        const tenant = settings().b2c.tenant;
        const policy = settings().b2c.policy;
        const client = settings().b2c.client;

        const authority = `https://login.microsoftonline.com/tfp/${tenant}/${policy}`;
        userManager = new window.Msal.UserAgentApplication(client, authority,
            (errorDesc, token, error, tokenType) => {
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

    login: () => (dispatch, getState) => {
        const fakeAuth = settings().fakeAuth;
        const useFakeAuth = fakeAuth.userId !== '' && fakeAuth.userId !== null;

        if (useFakeAuth) {
            dispatch({
                type: 'SET_USER_ACTION', id: fakeAuth.userId, name: fakeAuth.name, email: fakeAuth.userId, gravatar: fakeAuth.picUrl, token: fakeAuth.userId, isFake: true
            });
        }
        else {
            userManager.acquireTokenSilent(scopes)
                .then((accessToken) => {
                    dispatch({ type: 'LOGIN_ACTION', error: false });
                }, (error) => {
                    userManager.loginRedirect(scopes);
                    dispatch({ type: 'LOGIN_ACTION', error: true });
                });
        }
    },
    logout: () => (dispatch, getState) => {
        dispatch({ type: 'LOGOUT_ACTION' });
        localStorage.clear();
        userManager.logout();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer = (state, action) => {
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
            return state || { ...initialState };
    }
};
