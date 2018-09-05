
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Range } from 'rc-slider';
import * as RoomsStore from '../store/Rooms';

class FilterPrice extends Component {
    onSliderChange = (value) => {
        this.props.updatePrice(value[0], value[1]);
    }

    render() {
        return <div className='sh-filter_price'>
            <div className='sh-filter_price-range'>
                <span className='sh-filter_price-value'>$ {this.props.filters.minPrice}</span>
                <span className='sh-filter_price-value'>$ {this.props.filters.maxPrice}</span>
            </div>
            <Range min={0} max={1000} defaultValue={[this.props.filters.minPrice, this.props.filters.maxPrice]} tipFormatter={value => `$${value}`} onChange={this.onSliderChange} />
        </div>;
    }
}

export default connect(
    state => state.rooms,
    dispatch => bindActionCreators(RoomsStore.actionCreators, dispatch)
)(FilterPrice);