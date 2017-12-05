import * as React from 'react';

type CheckboxProps = {
    name: string
}

export default class Checkbox extends React.Component<CheckboxProps, {}> {
    public render() {
        return <div >
            <label className='sh-checkbox'>
                <input className='sh-checkbox-input is-hidden' type='checkbox' />
                <span className='sh-checkbox-name'>{this.props.name}</span>
                <span className='sh-checkbox-label icon-sh-tick'></span>
            </label>
        </div>
    }
}