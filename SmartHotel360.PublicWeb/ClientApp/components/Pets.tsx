import * as React from 'react';
import * as $ from 'jquery';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import { connect } from 'react-redux';
import Rooms from './Rooms';
import * as RoomsState from '../store/Rooms';
import * as PetsStore from '../store/Pets';
import { Status } from '../store/Pets';
import Search from './Search';
import { RoomHighlighted } from './RoomHighlighted';
import Loading from './Loading';

type PetsProps =
    PetsStore.PetsState
    & typeof PetsStore.actionCreators
    & RouteComponentProps<{}>;

class Pets extends React.Component<PetsProps, {}> {

    public componentDidMount() {
        this.props.init();
    }

    private onFileChange = (evt: any) => {
        let input = evt.target;
        let reader = new FileReader();
        reader.onload = (evt: any) => {
            let pet = new PetsStore.PetInfo();
            pet.base64 = reader.result;
            this.props.uploadPet(pet);
        }
        reader.readAsDataURL(input.files[0]);
    }

    private onClickUploader = () => {
        if (this.props.image) {
            return;
        }

        $(this.refs.nativeUpload).click();
    }

    public render() {
        return <div className='sh-pets'>
            <div className='sh-pets-hero'>
                <div className='sh-pets-wrapper'>
                    <img className='sh-pets-logo' src='/assets/images/logo.svg' />
                    <h1 className='sh-pets-title'>The future of intelligent hospitality and connected workplace</h1>
                </div>
            </div>
            <div className='sh-pets-margin'></div>
            <h2 className='sh-pets-subtitle'>Do you want to know if your pet can accompany you?</h2>

            <section className={'sh-uploader ' + (this.props.isThinking || this.props.isUploading ? 'is-loading' : 'is-empty') + ' ' + (this.props.status.approved === true ? 'is-ok' : '') + ' ' + (this.props.status.approved === false ? 'is-bad' : '')}
                     onClick={this.onClickUploader}>

                {this.props.image ? <div className='sh-uploader-image' style={{ backgroundImage: `url(${this.props.image})` }}></div> : <div className='sh-uploader-avatar'></div>}

                <div className='sh-uploader-loading'>
                    {this.props.isThinking || this.props.isUploading ? <div><Loading isBright={true} /></div> : <div></div>}
                </div>
            </section>

            {!this.props.isThinking && !this.props.isUploading && this.props.status.approved === null ? <span className='sh-pets-smalltitle'>Click on the avatar to upload your picture</span> : <span></span>}
            {this.props.isUploading ? <span className='sh-pets-smalltitle'>Uploading the image...</span> : <span></span>}
            {this.props.isThinking ? <span className='sh-pets-smalltitle'>Processing the image...</span> : <span></span>}

            {this.props.status.approved === true ? <span className='sh-pets-smalltitle is-ok'>Your pet looks like a {this.props.status.message} and is accepted :)</span> : <span></span>}
            {this.props.status.approved === false ? <span className='sh-pets-smalltitle is-bad'>Sorry your pet seems to be a {this.props.status.message} and we can't afford it :(</span> : <span></span>}

            <input className='is-hidden' ref='nativeUpload' type='file' onChange={this.onFileChange} />

        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.pets, // Selects which state properties are merged into the component's props
    PetsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Pets) as any;