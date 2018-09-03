import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SearchStore from '../store/Search';


class SearchInfo extends Component {
    componentWillMount() {
        this.setState({
            tab: SearchStore.Tab.Smart
        });
    }

    renderGuestsOrPeople() {
        if (this.state.tab === SearchStore.Tab.Smart) {
            return (<li className='sh-search-group'>
                {SearchStore.getFullRoomsGuests(this.props.guests.value)}
            </li>);
        }

        if (this.state.tab === SearchStore.Tab.Conference) {
            return (<li className='sh-search-group'>
                {SearchStore.getFullPeople(this.props.people.value)}
            </li>);
        }
    }

    render() {
        return <div className='sh-search sh-search--info'>
            <div className='sh-search-wrapper'>
                <ul className='sh-search-inputs'>
                    <li className='sh-search-group'>
                        {SearchStore.getFullCity(this.props.where.value)}
                    </li>

                    <li className='sh-search-group'>
                        {SearchStore.getShortDates(this.props.when.value.startDate, this.props.when.value.endDate)}
                    </li>

                    {this.renderGuestsOrPeople()}

                </ul>
            </div>
        </div>;
    }

}

export default connect(
    state => state.search,
    dispatch => bindActionCreators(SearchStore.actionCreators, dispatch)
)(SearchInfo);