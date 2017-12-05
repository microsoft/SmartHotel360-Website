import * as NavMenu from './NavMenu';
import * as Rooms from './Rooms';
import * as User from './User';
import * as Search from './Search';
import * as ConferenceRoomsFeatures from './ConferenceRoomsFeatures';
import * as RoomDetail from './RoomDetail';
import * as ModalDialog from './ModalDialog';
import * as Home from './Home';
import * as Pets from './Pets';

// the top-level state object
export interface ApplicationState {
    nav: NavMenu.NavMenuState;
    rooms: Rooms.RoomsState;
    user: User.UserState;
    conferenceRoomsFeatures: ConferenceRoomsFeatures.FeaturesState;
    search: Search.SearchState;
    roomDetail: RoomDetail.RoomDetailState;
    modalDialog: ModalDialog.ModalDialogState;
    home: Home.HomeState;
    pets: Pets.PetsState;
}

// whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    nav: NavMenu.reducer,
    rooms: Rooms.reducer,
    user: User.reducer,
    conferenceRoomsFeatures: ConferenceRoomsFeatures.reducer,
    search: Search.reducer,
    roomDetail: RoomDetail.reducer,
    modalDialog: ModalDialog.reducer,
    home: Home.reducer,
    pets: Pets.reducer
};

// this type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
