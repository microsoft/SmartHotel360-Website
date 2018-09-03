import React, { Component } from 'react';
import SearchInfo from './SearchInfo';
import Filters from './Filters';
import Rooms from './Rooms';
import Room from './Room';

export default class SearchRooms extends Component {
    render() {
        return <div className='sh-search_rooms'>
            <SearchInfo />
            <Filters />
            <Rooms component={Room} isLinked={true} title='Smart Rooms' modifier='full'/>
        </div>;
    }
}