import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from './Loading';
import * as RoomsStore from '../store/Rooms';
import { Link } from 'react-router-dom';

class Rooms extends Component {
    componentDidMount() {
        if (this.props.source === RoomsStore.Sources.Featured) {
            this.props.requestFeatured();
            return;
        }

        this.props.requestFiltered()
    }

    renderItem = (key, room) => {
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

    render() {
        return <div className={'sh-rooms ' + (this.props.modifier ? `sh-rooms--${this.props.modifier}` : '')}>
            <span className='sh-rooms-title'>{this.props.title}</span>
            {this.props.isLoading
                ? <Loading />
                :
                this.props.list.map((room, key) =>
                    this.renderItem(key, room)
                )
            }
        </div>;
    }
}

export default connect(
    state => state.rooms,
    dispatch => bindActionCreators(RoomsStore.actionCreators, dispatch)
)(Rooms);