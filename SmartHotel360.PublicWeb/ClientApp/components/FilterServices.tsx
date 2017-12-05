import * as React from 'react';
import Checkbox from './Checkbox';

// TODO: move props and interface to store
interface IService {
    name: string;
    selected: boolean;
}

type FilterServicesState = {
    services: IService[];
}

export default class FilterServices extends React.Component<{}, FilterServicesState> {
    constructor() {
        super();
        this.state = {
            services: []
        }
    }

    public componentDidMount() {
        this.setState({
            services: [
                {
                    name: 'Free Wi-fi',
                    selected: false
                },
                {
                    name: 'Parking',
                    selected: false
                },
                {
                    name: 'TV',
                    selected: false
                },
                {
                    name: 'Air conditioning',
                    selected: false
                },
                {
                    name: 'Dryer',
                    selected: false
                },
                {
                    name: 'Indoor fireplace',
                    selected: false
                },
                {
                    name: 'Laptop workspace',
                    selected: false
                },
                {
                    name: 'Breakfast',
                    selected: false
                },
                {
                    name: 'Kid friendly',
                    selected: false
                },
                {
                    name: 'Airport shuttle',
                    selected: false
                },
                {
                    name: 'Swimming pool',
                    selected: false
                },
                {
                    name: 'Fitness centre',
                    selected: false
                },
                {
                    name: 'Gym',
                    selected: false
                },
                {
                    name: 'Hot tub',
                    selected: false
                },
                {
                    name: 'Restaurant',
                    selected: false
                },
                {
                    name: 'Weelchair accessible',
                    selected: false
                },
                {
                    name: 'Elevator',
                    selected: false
                }
            ]
        });
    }

    public render() {
        let total = this.state.services.length;
        let half = total / 2;
        let list1 = this.state.services.slice(0, half).map((service: IService, key: any) => {
            return <div key={key}> <Checkbox name={service.name} /> </div>;
        });

        let list2 = this.state.services.slice(half, total).map((service: IService, key: any) => {
            return <div key={key}> <Checkbox name={service.name} /> </div>;
        });
        return <div className='sh-filter_services'>
            <div>{list1}</div>
            <div>{list2}</div>
        </div>
    }
}