import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ModalDialogStore from '../store/ModalDialog';

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

class ModalDialog extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    close = () => {
        this.props.close();
        this.props.callback();
    }

    open = () => {
        this.props.open();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isModalOpen}
                contentLabel='Modal'
                style={customStyles}
                onRequestClose={this.close}>
                {this.props.children}
            </Modal>
        )
    }
}

export default connect(
    state => state.modalDialog,
    dispatch => bindActionCreators(ModalDialogStore.actionCreators, dispatch)
)(ModalDialog);