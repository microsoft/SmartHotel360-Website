import * as React from 'react';

export 

type IncrementDecrementProps =
    {
        value: number,
        increment: Function,
        decrement: Function,
        change: Function
    };

export default class IncrementDecrement extends React.Component<IncrementDecrementProps, {}> {
    public render() {
        return <div className='sh-increment_decrement '>
            <button className='sh-increment_decrement-button btn' onClick={() => this.props.decrement()}>
                <i className='icon-sh-less'></i>
            </button>
            <input className='sh-increment_decrement-input' type='text' value={this.props.value} onChange={() => this.props.change} />
            <button className='sh-increment_decrement-button btn' onClick={() => this.props.increment()}>
                <i className='icon-sh-plus'></i>
            </button>
        </div>;
    }
}