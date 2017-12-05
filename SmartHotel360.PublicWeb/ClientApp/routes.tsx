import * as React from 'react';
import { Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import NavMenu from './components/NavMenu';
import SearchRooms from './components/SearchRooms';
import RoomDetail from './components/RoomDetail';
import Pets from './components/Pets';

export const routes = <Layout>
    <Route component={NavMenu} />
    <Route exact path='/' component={Home} />
    <Route exact path='/home2' component={Home} />
    <Route exact path='/SearchRooms' component={SearchRooms} />
    <Route exact path='/Pets' component={Pets} />
    <Route path='/RoomDetail/:hotelId' component={RoomDetail} />
</Layout>;
