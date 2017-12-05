import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Swipeable from 'react-swipeable';
import * as ConferenceRoomsFeaturesStore from '../store/ConferenceRoomsFeatures';

type ConferenceRoomsFeaturesProps =
    ConferenceRoomsFeaturesStore.FeaturesState
    & Swipeable.SwipeableProps
    & typeof ConferenceRoomsFeaturesStore.actionCreators;

class ConferenceRoomsFeatures extends React.Component<ConferenceRoomsFeaturesProps, {}> {

    public componentDidMount() {
        this.props.request();
    }

    private setBackgroundImage(image: string): any {
        return {
            backgroundImage: `url(${image})`,
        }
    }

    private onLoad = () => {
        console.log(this.props);
    }

    private onSwipedLeft = () => {
        this.props.translateLeft();
    }

    private onSwipedRight = () => {
        this.props.translateRight();
    }

    private renderRoomInCarousel(feature: any, key: any) {
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

    public render() {
        return <div className='sh-rooms_feature'>

            <span className='sh-rooms_feature-arrow icon-sh-chevron' onClick={this.onSwipedRight}></span>
            <span className='sh-rooms_feature-arrow sh-rooms_feature-arrow--right icon-sh-chevron' onClick={this.onSwipedLeft}></span>

            <Swipeable
                trackMouse
                onSwipedLeft={this.onSwipedLeft}
                onSwipedRight={this.onSwipedRight}>
                <div className='sh-rooms_feature-carousel'>
                    <ul className='sh-rooms_feature-slider' style={this.props.translation.styles}>
                        {this.props.list.map((feature: any, key: any) =>
                            this.renderRoomInCarousel(feature, key)
                        )}
                    </ul>
                </div>
            </Swipeable>

            <button className='sh-rooms_feature-button btn'>Find a conference room</button>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.conferenceRoomsFeatures, // Selects which state properties are merged into the component's props
    ConferenceRoomsFeaturesStore.actionCreators                 // Selects which action creators are merged into the component's props
)(ConferenceRoomsFeatures) as any;