import * as React from 'react';
import Room from './Room';

export class RoomHighlighted extends Room {
    private getButtonText(type: string): string {
        return type === 'hotel' ? 'Book a room' : 'Book a conference Room';
    }
    public navigationButtons(): JSX.Element {
        return (
            <div className='sh-room-button'>
                <div className='sh-room-button'>
                    {this.getButtonText(this.props.itemType)}
                </div>
            </div>
        )
    }
}