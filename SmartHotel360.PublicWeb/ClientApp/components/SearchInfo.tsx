import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as SearchStore from '../store/Search';

type SearchInfoProps =
    SearchStore.SearchState
    & typeof SearchStore.actionCreators;

interface LocalState {
    tab: SearchStore.Tab
}

class SearchInfo extends React.Component<SearchInfoProps, LocalState> {

    public componentWillMount() {
        this.state = {
            tab: SearchStore.Tab.Smart
        };
    }

    private renderGuestsOrPeople() {
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

    public render(): JSX.Element {
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

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.search, // selects which state properties are merged into the component's props
    SearchStore.actionCreators                 // selects which action creators are merged into the component's props
)(SearchInfo) as any;