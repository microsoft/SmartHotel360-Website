import React, { Component } from 'react';

export default class Checkbox extends Component {
    render() {
        return <div >
            <label className='sh-checkbox'>
                <input className='sh-checkbox-input is-hidden' type='checkbox' />
                <span className='sh-checkbox-name'>{this.props.name}</span>
                <span className='sh-checkbox-label icon-sh-tick'></span>
            </label>
        </div>
    }
}