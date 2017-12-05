
import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import Slider, { Range } from 'rc-slider';
import * as RoomsStore from '../store/Rooms';

type FilterProps =
    RoomsStore.RoomsState
    & typeof RoomsStore.actionCreators;

class FilterPrice extends React.Component<FilterProps, {}> {

    private onSliderChange = (value: Array<number>) => {
        this.props.updatePrice(value[0], value[1]);
    }

    public render() {
        return <div className='sh-filter_price'>
            <div className='sh-filter_price-range'>
                <span className='sh-filter_price-value'>$ {this.props.filters.minPrice}</span>
                <span className='sh-filter_price-value'>$ {this.props.filters.maxPrice}</span>
            </div>
            <Range min={0} max={1000} defaultValue={[this.props.filters.minPrice, this.props.filters.maxPrice]} tipFormatter={value => `$${value}`} onChange={this.onSliderChange} />
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.rooms, // Selects which state properties are merged into the component's props
    RoomsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(FilterPrice) as any;