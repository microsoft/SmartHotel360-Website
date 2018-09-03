import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import ConferenceRoomsFeatures from './ConferenceRoomsFeatures';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import * as RoomsState from '../store/Rooms';
import * as HomeStore from '../store/Home';
import Search from './Search';
import { RoomHighlighted } from './RoomHighlighted';
import Loading from './Loading';

class Home extends Component {
    componentDidMount() {
        this.props.requestTestimonial();
    }

    render() {
        return <div className='sh-home'>
            <div className='sh-hero'>
                <div className='sh-hero-wrapper'>
                    <div className='sh-hero-title'>The future of intelligent hospitality and connected workplace</div>
                    <ul className='sh-hero-buttons'>
                        <li className='sh-hero-button'>
                            <div className='sh-hero-download_app sh-hero-download_app--win'></div>
                        </li>
                        <li className='sh-hero-button'>
                            <div className='sh-hero-download_app sh-hero-download_app--apple'></div>
                        </li>
                        <li className='sh-hero-button'>
                            <div className='sh-hero-download_app sh-hero-download_app--google'></div>
                        </li>
                    </ul>
                </div>
            </div>
            <Search />
            <section className='sh-infogrid'>
                <p className='sh-home-title'>The smart experience</p>
                <article className='sh-infogrid-row'>
                    <div className='sh-infogrid-column'>
                        <i className='sh-infogrid-icon icon-sh-smart-check'></i>
                        <div className='sh-infogrid-description'>
                            <p className='sh-infogrid-subtitle'>Check in from your phone</p>
                            <span className='sh-infogrid-text'>
                                Use your personal device and the SmartHotel360 app to accelerate your check-in experience. We can skip that reception desk and use your phone as your room key.
                            </span>
                        </div>
                    </div>
                </article>

                <article className='sh-infogrid-row'>
                    <div className='sh-infogrid-column'>
                        <i className='sh-infogrid-icon icon-sh-smart-finde'></i>
                        <div className='sh-infogrid-description'>
                            <p className='sh-infogrid-subtitle'>Find and access your room</p>
                            <span className='sh-infogrid-text'>
                                Use the SmartHotel360 app, to quickly find your room location.
                            </span>
                        </div>
                    </div>
                </article>

                <article className='sh-infogrid-row'>
                    <div className='sh-infogrid-column'>
                        <i className='sh-infogrid-icon icon-sh-smart-perso'></i>
                        <div className='sh-infogrid-description'>
                            <p className='sh-infogrid-subtitle'>Personalize your experience</p>
                            <span className='sh-infogrid-text'>
                                Use the SmartHotel360 app to configure your home away from home. Set room temperatures, or reserve accommodations, all just a tap away.
                            </span>
                        </div>
                    </div>
                </article>


                <article className='sh-infogrid-row'>
                    <div className='sh-infogrid-column'>
                        <i className='sh-infogrid-icon icon-sh-smart-green'></i>
                        <div className='sh-infogrid-description'>
                            <p className='sh-infogrid-subtitle'>Go green</p>
                            <span className='sh-infogrid-text'>
                                From sensors managing our Hotels energy usage to Apps that reduce required work hours, SmartHotel360 goals is to minimization our carbon footprint.
                            </span>
                        </div>
                    </div>
                </article>
            </section>

            <span className='sh-home-label'>For Business travelers</span>
            <span className='sh-home-title'>Smart Conference Room</span>
            <ConferenceRoomsFeatures />
            
            <section className='sh-smartphone'>
                <div className='sh-smartphone-wrapper'>
                    <h2 className='sh-smartphone-title'>Discover the full smart experience with your smartphone</h2>
                    <p className='sh-smartphone-description'>Explore our digital presence. Take a tour of our hotels, explore and plan your next get away. Get tips and recommendation on how to expand your experience with SmartHotel360.</p>
                    <img className='sh-smartphone-image' alt="phone" src=' /assets/images/smartphone.png' />
                </div>
                <div className='sh-smartphone-quote'>
                    {this.props.isLoading ? <div className='sh-smartphone-quote_loading'><Loading isBright={true} /></div> : <div className='sh-smartphone-quote_container'>
                        <p className='sh-smartphone-quote_text'>"{this.props.testimonial.text}"</p>
                        <span className='sh-smartphone-quote_name'>
                            <i className='sh-smartphone-quote_icon icon-sh-tweet'></i>
                            @{this.props.testimonial.customerName}</span>
                    </div>}
                </div>
            </section>

            <span className='sh-home-title'>Rooms and Conference Rooms</span>
            <Rooms component={RoomHighlighted} source={RoomsState.Sources.Featured} />
        </div>;
    }
}

export default connect(
    state => state.home,
    dispatch => bindActionCreators(HomeStore.actionCreators, dispatch)
)(Home);