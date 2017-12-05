import * as React from 'react';
import * as Modal from 'react-modal';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ModalDialogStore from '../store/ModalDialog';

type ModalDialogProps = ModalDialogStore.ModalDialogState
    & { callback: Function }
    & typeof ModalDialogStore.actionCreators

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

class ModalDialog extends React.Component<ModalDialogProps, {}> {

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    public close = () => {
        this.props.close();
        this.props.callback();
    }

    public open = () => {
        this.props.open();
    }

    public render(): JSX.Element {
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

// wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) =>  state.modalDialog, // selects which state properties are merged into the component's props
    ModalDialogStore.actionCreators // selects which action creators are merged into the component's props
)(ModalDialog) as any;