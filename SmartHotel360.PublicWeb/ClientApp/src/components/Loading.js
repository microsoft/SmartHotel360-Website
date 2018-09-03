import React, { Component } from 'react';

export default class Loading extends Component {
    render() {
        return <div className={'sh-loading ' + (this.props.isBright ? 'sh-loading--bright' : '')}>
            Loading...
        </div>;
    }
}
