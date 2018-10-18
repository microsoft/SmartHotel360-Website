import React, { Component } from 'react';
import Filter from './Filter';
import FilterPrice from './FilterPrice';
import FilterAvailability from './FilterAvailability';
import FilterRating from './FilterRating';
import FilterReviews from './FilterReviews';
import FilterServices from './FilterServices';
import FilterCancelation from './FilterCancelation';
import FilterNeighborhood from './FilterNeighborhood';
import FilterRelevance from './FilterRelevance';

export default class Filters extends Component {

    render() {
        return <div className='sh-filters'>
            <div className='sh-filters-container'>
                <FilterAvailability />
                <FilterRating rating={4} />
                <Filter title='Price range'>
                    <FilterPrice />
                </Filter>
                <Filter title='Reviews' disabled={true}>
                    <FilterReviews />
                </Filter>
                <Filter title='Services'>
                    <FilterServices />
                </Filter>
                <Filter title='Cancelation' disabled={true}>
                    <FilterCancelation />
                </Filter>
                <Filter title='Neighborhood' right={0} disabled={true}>
                    <FilterNeighborhood />
                </Filter>
                <Filter title='Order by relevance' right={0} disabled={true}>
                    <FilterRelevance />
                </Filter>
            </div>

            <div className='sh-filters-float'>
                <i className='sh-filters-icon icon-sh-map'></i>
            </div>
        </div>;
    }
}