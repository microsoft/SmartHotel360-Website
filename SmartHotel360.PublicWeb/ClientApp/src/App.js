import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import NavMenu from './components/NavMenu';
import Home from './components/Home';
import SearchRooms from './components/SearchRooms';
import Pets from './components/Pets';
import RoomDetail from './components/RoomDetail';

export default () => (
  <Layout>
      <Route component={NavMenu} />
    <Route exact path='/' component={Home} />
    <Route exact path='/SearchRooms' component={SearchRooms} />
    <Route exact path='/Pets' component={Pets} />
    <Route path='/RoomDetail/:hotelId' component={RoomDetail} />
  </Layout>
);
