import React, { Component } from 'react';

export default class Switch extends Component {
    id = Math.random() + '';
    handleOnChange = () => {}

    render() {
        return <div className='sh-switch'>
            <label className='sh-switch-button'>
                <input type='checkbox' onChange={this.handleOnChange} id={this.id}  />
                <span className='sh-switch-slider'></span>
            </label>
            <label className='sh-switch-title' htmlFor={this.id}>{this.props.label}</label>
        </div>
    }
}