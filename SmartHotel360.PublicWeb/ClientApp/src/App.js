import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/SearchRooms' component={SearchRooms} />
    <Route exact path='/Pets' component={Pets} />
    <Route path='/RoomDetail/:hotelId' component={RoomDetail} />
  </Layout>
);
