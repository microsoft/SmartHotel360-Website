import React from 'react';
import Room from './Room';

export class RoomHighlighted extends Room {
    getButtonText(type) {
        return type === 'hotel' ? 'Book a room' : 'Book a conference Room';
    }

    navigationButtons() {
        return (
            <div className='sh-room-button'>
                <div className='sh-room-button'>
                    {this.getButtonText(this.props.itemType)}
                </div>
            </div>
        )
    }
}