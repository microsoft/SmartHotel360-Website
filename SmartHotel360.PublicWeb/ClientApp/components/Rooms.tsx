import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import Loading from './Loading';
import * as RoomsStore from '../store/Rooms';
import { RoomHighlighted } from './RoomHighlighted';
import { Link } from 'react-router-dom';

type RoomsProps =
    {
        component: any,
        isLinked: boolean | false,
        source?: any,
        title?: string,
        modifier?: string
    }
    & RoomsStore.RoomsState
    & typeof RoomsStore.actionCreators;

class Rooms extends React.Component<RoomsProps, {}> {
   
    public componentDidMount() {
        if (this.props.source === RoomsStore.Sources.Featured) {
            this.props.requestFeatured();
            return;
        }

        this.props.requestFiltered()
    }

    public renderItem = (key: number, room: RoomsStore.Room) => {
        if (this.props.isLinked) {
            return (<Link className='sh-rooms-item' key={key} to={`/RoomDetail/${room.id}`}>
                {React.createElement(this.props.component, Object.assign({}, this.props, { ...room }))}
            </Link>)
        } else {
            return (<div className='sh-rooms-item' key={key}>
                {React.createElement(this.props.component, Object.assign({}, this.props, { ...room }))}
            </div>)
        }
    }

    public render() {        
        return <div className={'sh-rooms ' + (this.props.modifier ? `sh-rooms--${this.props.modifier}` : '')}>
            <span className='sh-rooms-title'>{this.props.title}</span>
            {this.props.isLoading
                ? <Loading />
                :
                this.props.list.map((room: RoomsStore.Room, key: number) =>
                    this.renderItem(key, room)
                )
            }
        </div>;
    }
}

// wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.rooms, // Selects which state properties are merged into the component's props
    RoomsStore.actionCreators                 // selects which action creators are merged into the component's props
)(Rooms) as any;