import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SearchInfo from './SearchInfo';
import Filters from './Filters';
import Rooms from './Rooms';
import Room from './Room';

type SearchRoomsProps =
    RouteComponentProps<{}>;

export default class SearchRooms extends React.Component<SearchRoomsProps, {}> {
    public render() {
        return <div className='sh-search_rooms'>
            <SearchInfo />
            <Filters />
            <Rooms component={Room} isLinked={true} title='Smart Rooms' modifier='full'/>
        </div>;
    }
}