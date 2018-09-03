import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as ConferenceRoomReatures from './Counter';
import * as Home from './WeatherForecasts';
import * as ModalDialog from './WeatherForecasts';
import * as NavMenu from './WeatherForecasts';
import * as Pets from './WeatherForecasts';
import * as RoomDetail from './WeatherForecasts';
import * as Rooms from './WeatherForecasts';
import * as Search from './WeatherForecasts';
import * as User from './WeatherForecasts';

export default function configureStore(history, initialState) {
  const reducers = {
    conferenceRoomReatures: ConferenceRoomReatures.reducer,
    home: Home.reducer,
    modalDialog: ModalDialog.reducer,
    navMenu: NavMenu.reducer,
    pets: Pets.reducer,
    roomDetail: RoomDetail.reducer,
    rooms: Rooms.reducer,
    search: Search.reducer,
    user: User.reducer
  };

  const middleware = [
    thunk,
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
