import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as RoomsStore from '../store/Rooms';

class FilterRating extends Component {
    onClickStar = (value) => {
        this.props.updateRating(value);
        this.props.requestFiltered();
    }

    drawStars(rating = 5) {
        const max = 5;
        let stars = [];

        for (let i = max; i > 0; i--) {
            stars.push(<i className={'sh-filter_rating-star icon-sh-star ' + (i === rating ? 'is-active' : '')} key={i} onClick={() => this.onClickStar(i)}></i>);
        }

        return stars;
    }

    render() {
        return <div className='sh-filter_rating'>
            {this.drawStars(this.props.filters.rating)}
        </div>
    }
}

export default connect(
    state => state.rooms,
    dispatch => bindActionCreators(RoomsStore.actionCreators, dispatch)
)(FilterRating);