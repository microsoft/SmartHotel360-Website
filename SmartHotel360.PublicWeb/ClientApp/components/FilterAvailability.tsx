import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Switch from './Switch';

export default class FilterAvailability extends React.Component<{}, {}> {
    public render() {
        return <div className='sh-filter'>
            <Switch label='Only available' checked={true} />
        </div>;
    }
}