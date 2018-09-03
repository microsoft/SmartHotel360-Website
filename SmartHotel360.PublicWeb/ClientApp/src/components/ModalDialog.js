import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: 0
    }
};

export default class ModalDialog extends Component {
    close = () => {
        this.props.callback();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.showModal}
                contentLabel='Modal'
                style={customStyles}
                onRequestClose={this.close}>
                {this.props.children}
            </Modal>
        )
    }
}