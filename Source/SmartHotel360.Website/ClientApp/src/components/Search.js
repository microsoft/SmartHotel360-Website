import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import * as $ from 'jquery';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as SearchStore from '../store/Search';
import Loading from './Loading';
import IncrementDecrement from './IncrementDecrement';
import Checkbox from './Checkbox';

class Search extends Component {
    componentWillMount() {
        this.setState({
            tab: SearchStore.Tab.Smart,
            selected: SearchStore.Option.Where,
            started: false,
            whereFilled: false,
            whenFilled: false,
            guestsFilled: false,
            peopleFilled: false,
            shouldRender: true
        });
    }

    componentWillUpdate(nextProps) {
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

    onClickTab = (tab) => {
        this.setState(prev => ({ ...prev, tab: tab }));
    }

    onChangeWhere = (e) => {
        this.props.searchWhere(e.currentTarget.value);
        this.setState(prev => ({ ...prev, started: true }));
    }

    onClickWhere = () => {
        this.props.resetPeople();
        this.props.resetGuests();
        this.props.resetWhen();
        this.props.resetWhere();
        let input = this.refs.whereinput;
        input.value = '';
        setTimeout(() => input.focus(), 10);
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.Where, whereFilled: false, started: false }));
    }

    onSelectWhere = (city) => {
        this.props.selectWhere(city);
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whereFilled: true }));
    }

    renderOptionWhere() {
        return (<ul>
            {this.props.where.list.map((city, key) =>
                <div className='sh-search-option' key={key} onClick={() => this.onSelectWhere(city)}>
                    {SearchStore.getFullCity(city)}
                </div>
            )}
        </ul>);
    }

    renderGuestsOrPeople() {
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

    onClickWhen = () => {
        if (this.state.selected === SearchStore.Option.Where) {
            let input = this.refs.whereinput;
            setTimeout(() => input.focus(), 10);
            return;
        }

        this.props.resetPeople();
        this.props.resetGuests();
        this.props.resetWhen();

        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whenFilled: false }));
    }

    onChangeWhenStart = (date) => {
        this.props.selectWhenStart(date);
        this.setState(prev => ({ ...prev, whenFilled: true }));
    }

    onChangeWhenEnd = (date) => {
        this.props.selectWhenEnd(date);
        this.props.updateGuestsAdults(this.props.guests.value.adults);
    }

    applyDatesFilter = () => {
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.Guests, whenFilled: true }));
    }

    cancelFilterOpeartion = () => {
        this.setState(prev => ({ ...prev, selected: '' }));
    }

    resetDatesFilter = () => {
        this.setState(prev => ({ ...prev, selected: SearchStore.Option.When, whenFilled: false }));
        this.props.resetWhen();
    }

    renderOptionWhen() {
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

    onClickGuests = () => {
        if (this.state.selected === SearchStore.Option.Where) {
            let input = this.refs.whereinput;
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

    checkNumber(n) {
        return !n || parseFloat(n) === Number(n);
    }

    onChangeGuestsAdults = (e) => {
        const value = e.currentTarget.value;
        if (!this.checkNumber(value)) {
            return;
        }
        this.props.updateGuestsAdults(e.currentTarget.value);
    }

    onChangeGuestsKids = (e) => {
        this.props.updateGuestsKids(e.currentTarget.value);
    }

    onChangeGuestsBaby = (e) => {
        this.props.updateGuestsBaby(e.currentTarget.value);
    }

    onChangeGuestsRooms = (e) => {
        this.props.updateGuestsRooms(e.currentTarget.value);
    }

    onChangeGuestsWork = (isForWork) => {
        this.props.updateGuestsWork(isForWork);
    }


    onChangeGuestsPet = (bringPet) => {
        this.props.updateGuestsPet(bringPet);
    }

    onChangePeople = (e) => {
        this.props.updatePeople(e.currentTarget.value);
    }

    removeGuest = (type) => {
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
            default:
                return {};
        }
    }

    addGuest = (type) => {
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
            default:
                return {};
        }
    }

    addRoom = () => {
        let rooms = this.props.guests.value.rooms + 1;
        this.props.updateGuestsRooms(rooms);
    }

    removeRoom = () => {
        if (!this.props.guests.value.rooms || this.props.guests.value.rooms < 2) {
            return;
        }
        let rooms = this.props.guests.value.rooms - 1;
        this.props.updateGuestsRooms(rooms);
    }

    selectOneRoom = () => {
        this.props.updateGuestsRooms(1);
    }

    renderOptionGuests() {
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

    addPeople = () => {
        let people = this.props.people.value.total + 1;
        this.props.updatePeople(people);
    }

    removePeople = () => {
        let people = this.props.people.value.total - 1;
        if (!people) {
            return;
        }
        this.props.updatePeople(people);
    }

    selectService = (e) => {
        $(e.currentTarget).toggleClass('is-active');
    }

    renderOptionPeople() {
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
                        {services.map((service, key) =>
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

    renderCurrentOption() {
        switch (this.state.selected) {
            case SearchStore.Option.Where:
                return this.renderOptionWhere();
            case SearchStore.Option.When:
                if (this.state.shouldRender) {
                    return this.renderOptionWhen();
                }
                return;
            case SearchStore.Option.Guests:
                return this.renderOptionGuests();
            case SearchStore.Option.People:
                return this.renderOptionPeople();
            default:
                return (<div></div>);
        }
    }

    render() {
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

export default connect(
    state => state.search,
    dispatch => bindActionCreators(SearchStore.actionCreators, dispatch)
)(Search);