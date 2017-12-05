import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as RoomsStore from '../store/Rooms';

type FilterProps =
    RoomsStore.RoomsState
    & typeof RoomsStore.actionCreators;

class FilterRating extends React.Component<FilterProps, {}> {

    private onClickStar = (value: RoomsStore.StarValues) => {
        this.props.updateRating(value);
        this.props.requestFiltered();
    }

    private drawStars(rating = 5): JSX.Element[] {
        const max = 5;
        let stars = [];

        for (let i = max; i > 0; i--) {
            stars.push(<i className={'sh-filter_rating-star icon-sh-star ' + (i === rating ? 'is-active' : '')} key={i} onClick={() => this.onClickStar(i as RoomsStore.StarValues)}></i>);
        }

        return stars;
    }

    public render() {
        return <div className='sh-filter_rating'>
            {this.drawStars(this.props.filters.rating)}
        </div>
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.rooms, // Selects which state properties are merged into the component's props
    RoomsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(FilterRating) as any;