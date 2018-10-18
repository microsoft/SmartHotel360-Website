import React, { Component } from 'react';
import Switch from './Switch';

export default class FilterAvailability extends Component {
    render() {
        return <div className='sh-filter'>
            <Switch label='Only available' checked={true} />
        </div>;
    }
}