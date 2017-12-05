import * as React from 'react';
import * as moment from 'moment';
import * as $ from 'jquery';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as SearchStore from '../store/Search';
import Loading from './Loading';
import IncrementDecrement from './IncrementDecrement';
import Checkbox from './Checkbox';

type SearchProps =
    SearchStore.SearchState
    & typeof SearchStore.actionCreators;

interface LocalState {
    tab: SearchStore.Tab;
    selected: SearchStore.Option;
    started: boolean;
    whereFilled: boolean;
    whenFilled: boolean;
    guestsFilled: boolean;
    peopleFilled: boolean;
    shouldRender: boolean;
}

class Search extends React.Component<SearchProps, LocalState> {

    public componentWillMount() {
        this.state = {
            tab: SearchStore.Tab.Smart,
            selected: SearchStore.Option.Where,
            started: false,
            whereFilled: false,
            whenFilled: false,
            guestsFilled: false,
            peopleFilled: false,
            shouldRender: true
        };
    }

    public componentWillUpdate(nextProps: SearchProps): void {
        if (nextProps.guests.value.rooms !== this.props.guests.value.rooms) {
            const $oneRoomBox = $(this.refs.oneRoomBox);
            const $twoRoomBox = $(this.refs.twoRoomBox);
            const $moreRoomBox = $(this.refs.moreRoomBox);

            $oneRoomBox.removeClass('is-active');
            $twoRoomBox.removeClass('is-active');
            $moreRoomBox.removeClass('is-active');

            if (nextProps.guests.value.rooms === 1) {
                $oneRoomBox.addClass('is-active');
                return;
            }

            if (nextProps.guests.value.rooms === 2) {
                $twoRoomBox.addClass('is-active');
                return;
            }

            $moreRoomBox.addClass('is-active');
        }
    }

    private onClickTab = (tab: SearchStore.Tab) => {
        this.setState(prev => ({ ...prev, tab: tab }));
    }

    private onChangeWhere = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.searchWhere(e.currentTarget.value);
        this.setState(prev => ({ ...prev, started: true }));
    }

    private onClickWhere = () => {
        this.props.resetPeople();
        this.props.resetGuests();
        this.props.resetWhen();
        this.props.resetWhere();
        let input: any = this.refs.whereinput;
        input.value = '';
        setTimeout(() => input.focus(), 10);
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.Where, whereFilled: false, started: false }));
    }

    private onSelectWhere = (city: SearchStore.City) => {
        this.props.selectWhere(city);
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whereFilled: true }));
    }

    private renderOptionWhere(): JSX.Element {
        return (<ul>
            {this.props.where.list.map((city: SearchStore.City, key: number) =>
                <div className='sh-search-option' key={key} onClick={() => this.onSelectWhere(city)}>
                    {SearchStore.getFullCity(city)}
                </div>
            )}
        </ul>);
    }

    private renderGuestsOrPeople() {
        if (this.state.tab === SearchStore.Tab.Smart) {
            return (<li className={'sh-search-group ' + (this.state.selected === SearchStore.Option.Guests ? 'is-active' : '')}>
                <div className={'sh-search-value ' + (this.state.guestsFilled ? 'is-filled' : '')}
                    onClick={this.onClickGuests}>
                    {SearchStore.getFullRoomsGuests(this.props.guests.value)}
                </div>
                <span className={'sh-search-input ' + (!this.state.guestsFilled ? '' : 'is-hidden ') + (this.state.selected === SearchStore.Option.Guests ? 'is-active' : '')}
                    onClick={this.onClickGuests}>
                    Guests
                </span>
                <section className={'sh-search-options sh-search-options--s ' + (this.state.started && this.state.selected === SearchStore.Option.Guests ? '' : 'is-hidden')}>
                    {this.props.isLoading ? <Loading /> : this.renderCurrentOption()}
                </section>
            </li>);
        }

        if (this.state.tab === SearchStore.Tab.Conference) {
            return (<li className={'sh-search-group ' + (this.state.selected === SearchStore.Option.People ? 'is-active' : '')}>
                <div className={'sh-search-value ' + (this.state.peopleFilled ? 'is-filled' : '')}
                    onClick={this.onClickGuests}>
                    {SearchStore.getFullPeople(this.props.people.value)}
                </div>
                <span className={'sh-search-input ' + (!this.state.peopleFilled ? '' : 'is-hidden ') + (this.state.selected === SearchStore.Option.Guests ? 'is-active' : '')}
                    onClick={this.onClickGuests}>
                    People
                </span>
            </li>);
        }
    }

    private onClickWhen = () => {
        if (this.state.selected === SearchStore.Option.Where) {
            let input: any = this.refs.whereinput;
            setTimeout(() => input.focus(), 10);
            return;
        }

        this.props.resetPeople();
        this.props.resetGuests();
        this.props.resetWhen();

        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whenFilled: false }));
    }

    private onChangeWhenStart = (date: moment.Moment) => {
        this.props.selectWhenStart(date);
        this.setState(prev => ({ ...prev, whenFilled: true }));
    }

    private onChangeWhenEnd = (date: moment.Moment) => {
        this.props.selectWhenEnd(date);
        this.props.updateGuestsAdults(this.props.guests.value.adults);
    }

    private applyDatesFilter = () => {
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.Guests, whenFilled: true }));
    }

    private cancelFilterOpeartion = () => {
        this.setState(prev => ({ ...prev, selected: '' }));
    }

    private resetDatesFilter = () => {
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whenFilled: false }));
        this.props.resetWhen();
    }

    private renderOptionWhen(): JSX.Element {
        // SSR not supported
        const DatePicker: any = (require('react-datepicker') as any).default;

        if (!this.props.when.value.startDate) {
            return (<div className='sh-search-when'>
                <DatePicker
                    selected={this.props.when.value.startDate}
                    selectsStart
                    inline
                    startDate={this.props.when.value.startDate}
                    endDate={this.props.when.value.endDate}
                    onChange={this.onChangeWhenStart}
                    minDate={moment()}
                    monthsShown={2}
                />
                <div className='sh-search-buttons'>
                    <button className='sh-search-calendar_button btn' onClick={this.cancelFilterOpeartion}>Cancel</button>
                    <button disabled className='sh-search-calendar_button btn'>Apply</button>
                </div>
            </div>)
        } else {
            return (<div className={`sh-search-when ${this.props.when.value.endDate === this.props.when.value.startDate ? '' : ' disabled_hover'}`}>
                <DatePicker
                    selected={this.props.when.value.endDate}
                    selectsEnd
                    inline
                    startDate={this.props.when.value.startDate}
                    endDate={this.props.when.value.endDate}
                    minDate={this.props.when.value.startDate}
                    onChange={this.onChangeWhenEnd}
                    monthsShown={2}
                />
                <div className='sh-search-buttons'>
                    <button className='sh-search-calendar_button btn' onClick={this.resetDatesFilter}>Reset</button>
                    <button className={`sh-search-calendar_button sh-search-calendar_button--highlight btn ${this.props.when.value.endDate === this.props.when.value.startDate ? 'isDisabled' : ''}`} onClick={this.applyDatesFilter}>Apply</button>
                </div>
            </div>)
        }
    }

    private onClickGuests = () => {
        if (this.state.selected === SearchStore.Option.Where) {
            let input: any = this.refs.whereinput;
            setTimeout(() => input.focus(), 10);
            return;
        }

        if (this.state.selected === SearchStore.Option.When) {
            return;
        }

        this.props.resetGuests();
        this.props.updateGuestsAdults(1);
        this.props.updateGuestsBaby(0);
        this.props.updateGuestsKids(0);
        this.props.updateGuestsRooms(1);

        this.setState(prev => ({ ...prev, selected: SearchStore.Option.Guests, guestsFilled: true, peopleFilled: true }));
    }

    private checkNumber(n: string): boolean {
        return !n || parseFloat(n) === Number(n);
    }

    private onChangeGuestsAdults = (e: any) => {
        const value = e.currentTarget.value;
        if (!this.checkNumber(value)) {
            return;
        }
        this.props.updateGuestsAdults(e.currentTarget.value);
    }

    private onChangeGuestsKids = (e: any) => {
        this.props.updateGuestsKids(e.currentTarget.value);
    }

    private onChangeGuestsBaby = (e: any) => {
        this.props.updateGuestsBaby(e.currentTarget.value);
    }

    private onChangeGuestsRooms = (e: any) => {
        this.props.updateGuestsRooms(e.currentTarget.value);
    }

    private onChangeGuestsWork = (isForWork: boolean) => {
        this.props.updateGuestsWork(isForWork);
    }


    private onChangeGuestsPet = (bringPet: boolean) => {
        this.props.updateGuestsPet(bringPet);
    }

    private onChangePeople = (e: any) => {
        this.props.updatePeople(e.currentTarget.value);
    }

    private removeGuest = (type: SearchStore.Guest) => {
        switch (type) {
            case SearchStore.Guest.Adults:
                let adults = this.props.guests.value.adults - 1;
                if (adults) {
                    this.props.updateGuestsAdults(adults);
                }
                break;
            case SearchStore.Guest.Kids:
                let kids = this.props.guests.value.kids - 1;
                if (kids >= 0) {
                    this.props.updateGuestsKids(kids);
                }
                break;
            case SearchStore.Guest.Babies:
                let babies = this.props.guests.value.baby - 1;
                if (babies >= 0) {
                    this.props.updateGuestsBaby(babies);
                }
                break;
        }
    }

    private addGuest = (type: SearchStore.Guest) => {
        switch (type) {
            case SearchStore.Guest.Adults:
                let adults = this.props.guests.value.adults + 1;
                this.props.updateGuestsAdults(adults);
                break;
            case SearchStore.Guest.Kids:
                let kids = this.props.guests.value.kids + 1;
                this.props.updateGuestsKids(kids);
                break;
            case SearchStore.Guest.Babies:
                let babies = this.props.guests.value.baby + 1;
                this.props.updateGuestsBaby(babies);
                break;
        }
    }

    private addRoom = () => {
        let rooms = this.props.guests.value.rooms + 1;
        this.props.updateGuestsRooms(rooms);
    }

    private removeRoom = () => {
        if (!this.props.guests.value.rooms || this.props.guests.value.rooms < 2) {
            return;
        }
        let rooms = this.props.guests.value.rooms - 1;
        this.props.updateGuestsRooms(rooms);
    }

    private selectOneRoom = () => {
        this.props.updateGuestsRooms(1);
    }

    private renderOptionGuests(): JSX.Element {
        return (<div className='sh-guests'>
            <section className='sh-guests-config'>
                <div className='sh-guests-people'>
                    <div className='sh-guests-people_row'>
                        <div className='sh-guests-description'>
                            <span className='sh-guests-title'>Adults</span>
                            <span className='sh-guests-text'>14 years and up</span>
                        </div>
                        <IncrementDecrement
                            value={this.props.guests.value.adults}
                            increment={() => this.addGuest(SearchStore.Guest.Adults)}
                            decrement={() => this.removeGuest(SearchStore.Guest.Adults)}
                            change={this.onChangeGuestsAdults} />
                    </div>
                    <div className='sh-guests-people_row'>
                        <div className='sh-guests-description'>
                            <span className='sh-guests-title'>Kids</span>
                            <span className='sh-guests-text'>From 2 to 13 years</span>
                        </div>
                        <IncrementDecrement
                            value={this.props.guests.value.kids}
                            increment={() => this.addGuest(SearchStore.Guest.Kids)}
                            decrement={() => this.removeGuest(SearchStore.Guest.Kids)}
                            change={this.onChangeGuestsKids} />
                    </div>
                    <div className='sh-guests-people_row'>
                        <div className='sh-guests-description'>
                            <span className='sh-guests-title'>Baby</span>
                            <span className='sh-guests-text'>Under 2 years</span>
                        </div>
                        <IncrementDecrement
                            value={this.props.guests.value.baby}
                            increment={() => this.addGuest(SearchStore.Guest.Babies)}
                            decrement={() => this.removeGuest(SearchStore.Guest.Babies)}
                            change={this.onChangeGuestsBaby} />

                    </div>
                </div>
                <div className='sh-guests-rooms'>
                    <div ref='oneRoomBox' className='sh-guests-room sh-guests-room--default is-active' onClick={() => this.props.updateGuestsRooms(1)}>
                        <i className='sh-guests-room_icon sh-guests-room_icon--one icon-sh-key'></i>
                        <span>One Room</span>
                    </div>
                    <div ref='twoRoomBox' className='sh-guests-room sh-guests-room--default' onClick={() => this.props.updateGuestsRooms(2)}>
                        <i className='sh-guests-room_icon icon-sh-keys'></i>
                        <span>Two Rooms</span>
                    </div>
                    <div ref='moreRoomBox' className='sh-guests-room sh-guests-room--counter'>
                        <div className='sh-guests-custom'>
                            <button onClick={() => this.removeRoom()} className='sh-guests-room_button'><i className='icon-sh-less'></i></button>
                            <input className='sh-guests-room_input' type='text' value={this.props.guests.value.rooms} onChange={this.onChangeGuestsRooms} />
                            <button onClick={() => this.addRoom()} className='sh-guests-room_button'><i className='icon-sh-plus'></i></button>
                        </div>
                        <span>Rooms</span>
                    </div>
                </div>
            </section>
            <section className='sh-guests-extra'>
                Are you bringing a pet?
                <button className={'sh-guests-extra_button btn ' + (!this.props.guests.value.pet ? 'is-active' : '')} onClick={() => this.onChangeGuestsPet(false)}>No</button>
                <button className={'sh-guests-extra_button btn ' + (this.props.guests.value.pet ? 'is-active' : '')} onClick={() => this.onChangeGuestsPet(true)}>Yes</button>
                <Link className={'sh-guests-pets_link' + (!this.props.guests.value.pet ? '-hidden' : '')} to={`/Pets`}>Check it</Link>
            </section>

        </div>);
    }

    private addPeople = () => {
        let people = this.props.people.value.total + 1;
        this.props.updatePeople(people);
    }

    private removePeople = () => {
        let people = this.props.people.value.total - 1;
        if (!people) {
            return;
        }
        this.props.updatePeople(people);
    }

    private selectService = (e: any) => {
        $(e.currentTarget).toggleClass('is-active');
    }

    private renderOptionPeople(): JSX.Element {
        let services = [
            {
                icon: 'sh-wifi',
                description: 'Free Wi-Fi'
            },
            {
                icon: 'sh-air-conditioning',
                description: 'Air conditioning'
            },
            {
                icon: 'sh-breakfast',
                description: 'Breakfast'
            },
            {
                icon: 'sh-elevator',
                description: 'Elevator'
            }
        ]

        return (<div className='sh-guests sh-guests--people'>
            <section className='sh-guests-config'>
                <div className='sh-guests-people'>
                    <div className='sh-guests-people_row'>
                        <div className='sh-guests-description'>
                            <span className='sh-guests-title'>People (1-40)</span>
                            <span className='sh-guests-text'>(1-40 people)</span>
                            <a className='sh-guests-link'>Request Quotes (41+ people)</a>
                        </div>
                        <IncrementDecrement
                            value={this.props.people.value.total}
                            increment={() => this.addPeople()}
                            decrement={() => this.removePeople()}
                            change={() => this.onChangePeople} />
                    </div>
                </div>
                <div className='sh-guests-people_services'>
                    <ul className='sh-guests-services'>
                        {services.map((service: any, key: any) =>
                            <li className='sh-guests-service' onClick={this.selectService} key={key}><i className={`sh-guests-service_icon icon-${service.icon}`}></i>{service.description}</li>
                        )}
                    </ul>
                    <div className='sh-guests-form'>
                        <Checkbox name='Need more options?' />
                        <textarea className='sh-guests-textarea' />
                    </div>
                </div>
            </section>
        </div>);
    }

    private renderCurrentOption(): JSX.Element {
        switch (this.state.selected) {
            case SearchStore.Option.Where:
                return this.renderOptionWhere();
            case SearchStore.Option.When:
                if (this.state.shouldRender) {
                    return this.renderOptionWhen();
                }
            case SearchStore.Option.Guests:
                return this.renderOptionGuests();
            case SearchStore.Option.People:
                return this.renderOptionPeople();
            default:
                return (<div></div>);
        }
    }

    public render(): JSX.Element {
        return <div className='sh-search'>
            <div className='sh-search-wrapper'>
                <ul className='sh-search-tabs'>
                    <li className={'sh-search-tab ' + (this.state.tab === SearchStore.Tab.Smart ? 'is-active' : '')}
                        onClick={() => this.onClickTab(SearchStore.Tab.Smart)}>
                        Smart Room
                    </li>
                    <li className={'sh-search-tab ' + (this.state.tab === SearchStore.Tab.Conference ? 'is-active' : '')}>
                        Conference Room
                   </li>
                </ul>
                <ul className='sh-search-inputs'>
                    <li className={`sh-search-group ${this.state.selected === SearchStore.Option.Where ? 'is-active' : ''}`}>
                        <div className={'sh-search-value ' + (this.state.whereFilled ? 'is-filled' : '')}
                            onClick={this.onClickWhere}>
                            {SearchStore.getFullCity(this.props.where.value)}
                        </div>
                        <input className={'sh-search-input ' + (!this.state.whereFilled ? '' : 'is-hidden')}
                            type='text'
                            ref='whereinput'
                            placeholder='Where'
                            onKeyUp={this.onChangeWhere}
                            onClick={this.onClickWhere} />
                        <section className={'sh-search-options sh-search-options--s ' + (this.state.started && this.state.selected === SearchStore.Option.Where ? '' : 'is-hidden')}>
                            {this.props.isLoading ? <Loading /> : this.renderCurrentOption()}
                        </section>
                    </li>

                    <li className={'sh-search-group ' + (this.state.selected === SearchStore.Option.When ? 'is-active' : '')}>
                        <div className={'sh-search-value ' + (this.state.whenFilled ? 'is-filled' : '')}
                            onClick={this.onClickWhen}>
                            {SearchStore.getShortDates(this.props.when.value.startDate, this.props.when.value.endDate)}
                        </div>
                        <span className={'sh-search-input ' + (!this.state.whenFilled ? '' : 'is-hidden ') + (this.state.selected === SearchStore.Option.When ? 'is-active' : '')}
                            onClick={this.onClickWhen}>
                            When
                        </span>
                        <section className={'sh-search-options sh-search-options--s ' + (this.state.started && this.state.selected === SearchStore.Option.When ? '' : 'is-hidden')}>
                            {this.props.isLoading ? <Loading /> : this.renderCurrentOption()}
                        </section>
                    </li>

                    {this.renderGuestsOrPeople()}

                    <li className='sh-search-group--button'>
                        <Link to={'/SearchRooms'} className={'sh-search-button btn ' + (SearchStore.getFullCity(this.props.where.value) && this.state.whenFilled ? '' : 'is-disabled')}>
                            {this.state.tab === SearchStore.Tab.Smart ? 'Find a Room' : 'Find a Conference Room'}
                        </Link>
                    </li>

                </ul>
                <section className={'sh-search-options sh-search-options--m ' + (this.state.started ? '' : 'is-hidden')}>
                    {this.props.isLoading ? <Loading /> : this.renderCurrentOption()}
                </section>
            </div>
        </div>;
    }

}

// wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.search, // selects which state properties are merged into the component's props
    SearchStore.actionCreators                 // selects which action creators are merged into the component's props
)(Search) as any;