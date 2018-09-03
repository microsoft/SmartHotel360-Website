import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import SearchInfo from './SearchInfo';
import * as RoomDetailStore from '../store/RoomDetail';
import * as SearchStore from '../store/Search';
import Loading from './Loading';
import * as moment from 'moment';
import { settings } from '../Settings';
import ModalDialog from './ModalDialog';

class RoomDetail extends Component {
    componentWillMount() {
        this.setState({
            bookingText: 'Login to book',
            canBook: false,
            tab: RoomDetailStore.Tabs.Hotel,
            showModal: false
        });

        if (this.props.user.id) {
            this.setState(prev => ({ ...prev, bookingText: 'Book now', canBook: true }));
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.showConfirmationModal) {
            if (!this.state.showModal) {
                this.openModal();
            }
        }
    }
    
    openModal = () => {
        this.setState({ showModal: true });
    }
    closeModal = () => {
        this.setState({ showModal: false });
    }

    componentDidMount() {
        this.props.init();
        this.props.requestRoom(this.props.match.params.hotelId, this.props.user);
        this.props.requestReviews(this.props.match.params.hotelId);
    }

    onClickTab = (tab) => {
        this.setState(prev => ({ ...prev, tab: tab }));
    }

    formatNumber(value, decimals) {
        let n = parseFloat(value);

        if (isNaN(n) || !isFinite(n)) {
            return value;
        }

        let absNum = Math.abs(n);
        let num = decimals ? absNum.toFixed(decimals).toString().split('.') : absNum.toString().split('.');
        let result = '';

        const regex = new RegExp('(?=(?:\\d{3})+(?:\\.|$))', 'g'),
            thousands_separator = ',',
            decimals_separator = '.';

        if (n < 0) {
            result = '-';
        }

        result += value === 0 ? '0' : num[1] ? `${num[0].split(regex).join(thousands_separator)}${decimals_separator}${num[1]}` : `${num[0].split(regex).join(thousands_separator)}`;
        return result;
    }

    onClickBook = () => {
        if (this.props.user.id) {
            let booking = new RoomDetailStore.Booking(this.props.match.params.hotelId,
                this.props.user.email,
                this.props.search.when.value.endDate,
                this.props.search.when.value.startDate,
                this.props.search.guests.value.adults,
                this.props.search.guests.value.kids,
                this.props.search.guests.value.baby,
                0,
                this.calculateTotal()
            )
            this.props.book(booking, this.props.user);
            return;
        }

        this.setState(prev => ({ ...prev, bookingText: 'Login to book' }));
    }

    calculateTotal = () => {
        let start = moment(SearchStore.getLongDate(this.props.search.when.value.startDate));
        let end = moment(SearchStore.getLongDate(this.props.search.when.value.endDate));
        let nights = Math.abs(start.diff(end, 'days'));
        return this.props.room.rooms[0].localRoomPrice * nights;
    }

    formatHours = (hour) => {
        return moment(hour, ['h:mm A']).format('hh:mm A');
    }

    getServicesIcon = (key) => {
        if (!key) {
            return;
        }
        return RoomDetailStore.ServicesDictionary[key];
    }

    renderDescription() {
        return (<div>
            <article className='sh-room_detail-description'>
                {this.props.room.description}
            </article>
            <h3 className='sh-room_detail-subtitle'>Services</h3>
            <div className='sh-room_detail-extra'>
                <ul className='sh-room_detail-services'>
                    {this.props.room.services.map((service, key) =>
                        <li className='sh-room_detail-service' key={key}>
                            <i className={`sh-room_detail-service_icon icon-${this.getServicesIcon(service.id)}`}></i>
                            <span>{service.name}</span>
                        </li>
                    )}
                </ul>
            </div>
            <div className='sh-room_detail-extra'>
                <h3 className='sh-room_detail-subtitle'>Information</h3>

                <div className='sh-room_detail-extra'>
                    <h4 className='sh-room_detail-smalltitle'>Check-In/Out</h4>
                    <p className='sh-room_detail-text'>{this.formatHours(this.props.room.checkInTime)} / {this.formatHours(this.props.room.checkOutTime)}</p>
                </div>

                <div className='sh-room_detail-extra'>
                    <h4 className='sh-room_detail-smalltitle'>Cancellation policy</h4>
                    <p className='sh-room_detail-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
            </div>
            <div className='sh-room_detail-extra'>
                <h3 className='sh-room_detail-subtitle'>Gallery {`(${this.props.room.pictures.length})`}</h3>
                <ul className='sh-room_detail-gallery'>
                    {this.props.room.pictures.map((picture, key) =>
                        <li className='sh-room_detail-picture' key={key} style={this.setBackgroundImage(picture)}></li>
                    )}
                </ul>
            </div>
        </div>);
    }

    drawStars(rating) {
        const max = 5;
        let stars = [];

        for (let i = 1; i <= max; i++) {
            stars.push(<i className={'sh-room_detail-star active icon-sh-star ' + (i <= rating ? 'is-active' : '')} key={i}></i>);
        }

        return stars;
    }

    formatDate = (date) => {
        date = moment(date);
        return date ? `${date.format('D MMM YYYY')}` : '';
    }

    renderReviews() {
        return (<div>
            <div className='sh-room_detail-extra'>
                <ul className='sh-room_detail-reviews'>
                    {this.props.isLoading ? <Loading /> 
                        : this.props.reviews.map((review, key) =>
                        <li className='sh-room_detail-review' key={key}>
                            <header className='sh-room_detail-review_header'>
                                <div>
                                        <span className='sh-room_detail-subtitle u-pr-2'>{review.userName}</span>
                                        <span className='sh-room_detail-smalltitle u-pr-2'>Double Room</span>
                                        <span className='sh-room_detail-date'>{review.formattedDate}</span>
                                </div>
                                <div>
                                    {this.drawStars(5)}
                                </div>
                            </header>
                            <div className='sh-room_detail-extra'>
                                    <p className='sh-room_detail-text'>{review.description}</p>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>);
    }

    renderCurrentOption() {
        switch (this.state.tab) {
            case RoomDetailStore.Tabs.Hotel:
                return this.renderDescription();
            case RoomDetailStore.Tabs.Reviews:
                return this.renderReviews();
            default:
                return this.renderDescription();
        }
    }

    setBackgroundImage(image) {
        return {
            backgroundImage: `url(${settings().urls.images_Base}${image})`
        };
    }

    renderAsideBooking = () => {

        let originalPriceSpan = '';
        if (this.props.room.rooms[0].discountApplied > 0) {
            originalPriceSpan = <span className='sh-room_detail-smallstrokedtitle'>{`${this.props.room.rooms[0].badgeSymbol}${this.formatNumber(this.props.room.rooms[0].localOriginalRoomPrice)}`}&nbsp;</span>;
        }

        return <aside className='sh-room_detail-filters'>
            <header className='sh-room_detail-filter_header'>
                <span className='sh-room_detail-filter_title'>{`${this.props.room.rooms[0].badgeSymbol}${this.formatNumber(this.calculateTotal())}`}</span>
                <span>Total</span>
            </header>
            <section className='sh-room_detail-info'>
                <div className='sh-room_detail-title'>{this.props.room.name}</div>
                <span className='sh-room_detail-location u-display-block'>{this.props.room.location}</span>
                <span className='sh-room_detail-phone u-display-block'>{this.props.room.phone}</span>

                <div className='sh-room_detail-extra sh-room_detail-extra--double row'>
                    <div className='col-xs-6'>
                        <span className='sh-room_detail-small'>Check-In</span>
                        <span className='sh-room_detail-smalltitle'>{SearchStore.getLongDate(this.props.search.when.value.startDate)}</span>
                    </div>
                    <div className='col-xs-6'>
                        <span className='sh-room_detail-small'>Check-Out</span>
                        <span className='sh-room_detail-smalltitle'>{SearchStore.getLongDate(this.props.search.when.value.endDate)}</span>
                    </div>
                </div>
                <div className='sh-room_detail-extra row'>
                    <div className='col-xs-4'>
                        <span className='sh-room_detail-small'>Room</span>
                        <span className='sh-room_detail-smalltitle'>{SearchStore.getFullRooms(this.props.search.guests.value)}</span>
                    </div>
                    <div className='col-xs-4'>
                        <span className='sh-room_detail-small'>Guests</span>
                        <span className='sh-room_detail-smalltitle'>{SearchStore.getFullGuests(this.props.search.guests.value)}</span>
                    </div>
                    <div className='col-xs-4'>
                        <span className='sh-room_detail-small'>Per night</span>
                        {originalPriceSpan}
                        <span className='sh-room_detail-smalltitle'>{`${this.props.room.rooms[0].badgeSymbol}${this.formatNumber(this.props.room.rooms[0].localRoomPrice)}`}</span>
                    </div>
                </div>
                
                <div className='sh-room_detail-extra'>
                    <span className={'sh-room_detail-book btn ' + (this.props.booked || !this.state.canBook ? 'is-disabled' : '')}    
                        onClick={this.onClickBook}>
                        {this.props.isBooking ? <Loading isBright={true} /> : this.state.bookingText}
                    </span>
                </div>
            </section>
        </aside>
    }
    
    render() {
        return <div className='sh-room_detail'>
            <div className='sh-room_detail-search'>
                <SearchInfo />
            </div>

            <Link className='sh-room_detail-back' to={`/SearchRooms`}><i className='sh-room_detail-arrow icon-sh-chevron'></i>Back to hotels</Link>
            {this.props.isLoading ? <Loading /> : <header className='sh-room_detail-background' style={this.setBackgroundImage(this.props.room.defaultPicture)}>
                <div className='sh-room_detail-show_small'> {this.renderAsideBooking()}</div>
            </header>}
            <section className='sh-room_detail-wrapper'>
                <div className='sh-room_detail-column sh-room_detail-column--left'>
                    <ul className='sh-room_detail-tabs'>
                        <li className={'sh-room_detail-tab ' + (this.state.tab === RoomDetailStore.Tabs.Hotel ? 'is-active' : '')}
                            onClick={() => this.onClickTab(RoomDetailStore.Tabs.Hotel)}>
                            The Hotel
                        </li>
                        <li className={'sh-room_detail-tab ' + (this.state.tab === RoomDetailStore.Tabs.Reviews ? 'is-active' : '')}
                            onClick={() => this.onClickTab(RoomDetailStore.Tabs.Reviews)}>
                            Reviews
                        </li>
                    </ul>
                    <div className='sh-room_detail-content'>
                        <header className='sh-room_detail-header'>
                            <div className='sh-room_detail-group'>
                                <span className='sh-room_detail-title'>{this.props.room.name}</span>
                                <div className='sh-room_detail-stars'>{this.drawStars(this.props.room.rating)}</div>
                            </div>
                            <span className='sh-room_detail-location'>{this.props.room.city}</span>
                        </header>
                        {this.renderCurrentOption()}
                    </div>
                </div>
                <div className='sh-room_detail-column sh-room_detail-column--right'>
                    {this.renderAsideBooking()}
                </div>
            </section>

            <ModalDialog callback={this.props.dismissModal} showModal={this.state.showModal}>
                <div className='sh-modal'>
                    <header className='sh-modal-header'>
                        <div className='sh-modal-title'>
                            <span>Your Reservation Details</span>
                            <span className='sh-modal-close' onClick={this.closeModal}><i className='icon-sh-close'></i></span>
                        </div>
                        <div className='sh-modal-picture' style={this.setBackgroundImage(this.props.room.defaultPicture)}>
                        </div>
                    </header>
                    <section className='sh-modal-body'>
                        <div className='sh-modal-row'>
                            <span className='sh-room_detail-smalltitle'>Thanks {this.props.user.name},</span>
                            <span className='sh-room_detail-small'>Your booking at {this.props.room.name} is confirmed.</span>
                        </div>
                        <div className='sh-modal-row'>
                            <span className='sh-room_detail-smalltitle'>{this.props.room.name}</span>
                            <span className='sh-room_detail-small'>{this.props.room.street}</span>
                            <span className='sh-room_detail-small'>{this.props.room.city}</span>
                        </div>
                        <div className='sh-modal-row row'>
                            <div className='col-xs-6'>
                                <span className='sh-room_detail-small'>Check-in</span>
                                <span className='sh-room_detail-smalltitle'>{SearchStore.getLongDate(this.props.search.when.value.startDate)}</span>
                            </div>
                            <div className='col-xs-6'>
                                <span className='sh-room_detail-small'>Check-out</span>
                                <span className='sh-room_detail-smalltitle'>{SearchStore.getLongDate(this.props.search.when.value.endDate)}</span>
                            </div>
                        </div>
                        <div className='sh-modal-row row'>
                            <div className='col-xs-4'>
                                <span className='sh-room_detail-small'>Room</span>
                                <span className='sh-room_detail-smalltitle'>{SearchStore.getFullRooms(this.props.search.guests.value)}</span>
                            </div>
                            <div className='col-xs-4'>
                                <span className='sh-room_detail-small'>Guests</span>
                                <span className='sh-room_detail-smalltitle'>{SearchStore.getFullGuests(this.props.search.guests.value)}</span>
                            </div>
                            <div className='col-xs-4'>
                                <span className='sh-room_detail-small'>Per night</span>
                                <span className='sh-room_detail-smalltitle'>{`${this.props.room.rooms[0].badgeSymbol}${this.formatNumber(this.props.room.rooms[0].localRoomPrice)}`}</span>
                            </div>
                        </div>
                    </section>
                    <footer className='sh-modal-footer'>
                        <div className='sh-room_detail-grow'>
                            <img className='sh-modal-logo' alt="logo" src='/assets/images/logo.svg' />
                        </div>
                        <div className='sh-modal-total'>
                            <span className='sh-modal-small'>Total</span>
                            <span className='sh-modal-price'>{`${this.props.room.rooms[0].badgeSymbol}${this.formatNumber(this.calculateTotal())}`}</span>
                        </div>
                    </footer>
                    </div>
            </ModalDialog>
        </div>;
    }
}

export default connect(
    state => ({ ...state.roomDetail, search: state.search, user: state.user }),
    dispatch => bindActionCreators(RoomDetailStore.actionCreators, dispatch)
)(RoomDetail);