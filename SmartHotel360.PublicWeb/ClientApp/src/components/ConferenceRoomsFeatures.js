import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swipeable from 'react-swipeable';
import * as ConferenceRoomsFeaturesStore from '../store/ConferenceRoomsFeatures';


class ConferenceRoomsFeatures extends Component {
    componentDidMount() {
        this.props.request();
    }

    setBackgroundImage(image) {
        return {
            backgroundImage: `url(${image})`,
        }
    }

    onSwipedLeft = () => {
        this.props.translateLeft();
    }

    onSwipedRight = () => {
        this.props.translateRight();
    }

    renderRoomInCarousel(feature, key) {
        return (<li key={key} className={'sh-rooms_feature-wrapper ' + (feature.title ? '' : 'is-invisible')}>
            <div className='sh-rooms_feature-image' style={this.setBackgroundImage(feature.imageUrl)}></div>
            <div className='sh-rooms_feature-box'>
                <span className='sh-rooms_feature-title'>
                    {feature.title}
                </span>
                <span className='sh-rooms_feature-text'>
                    {feature.description}
                </span>
            </div>
        </li>);
    }

    render() {
        return <div className='sh-rooms_feature'>

            <span className='sh-rooms_feature-arrow icon-sh-chevron' onClick={this.onSwipedRight}></span>
            <span className='sh-rooms_feature-arrow sh-rooms_feature-arrow--right icon-sh-chevron' onClick={this.onSwipedLeft}></span>

            <Swipeable
                trackMouse
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}>
                <div className='sh-rooms_feature-carousel'>
                    <ul className='sh-rooms_feature-slider' style={this.props.translation.styles}>
                        {this.props.list.map((feature, key) =>
                            this.renderRoomInCarousel(feature, key)
                        )}
                    </ul>
                </div>
            </Swipeable>

            <button className='sh-rooms_feature-button btn'>Find a conference room</button>
        </div>;
    }
}

export default connect(
    state => state.conferenceRoomsFeatures,
    dispatch => bindActionCreators(ConferenceRoomsFeaturesStore.actionCreators, dispatch)
)(ConferenceRoomsFeatures);