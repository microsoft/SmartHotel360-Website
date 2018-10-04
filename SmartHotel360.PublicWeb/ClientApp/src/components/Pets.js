import React, { Component } from 'react';
import * as $ from 'jquery';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PetsStore from '../store/Pets';
import Loading from './Loading';

class Pets extends Component {
    componentDidMount() {
        this.props.init();
    }

    onFileChange = (evt) => {
        let input = evt.target;
        let reader = new FileReader();
        reader.onload = (evt) => {
            let pet = new PetsStore.PetInfo();
            pet.base64 = reader.result;
            this.props.uploadPet(pet);
        }
        reader.readAsDataURL(input.files[0]);
    }

    onClickUploader = () => {
        if (this.props.image) {
            return;
        }

        $(this.refs.nativeUpload).click();
    }

    render() {
        return <div className='sh-pets'>
            <div className='sh-pets-hero'>
                <div className='sh-pets-wrapper'>
                    <img className='sh-pets-logo' alt="pet" src='/assets/images/logo.svg' />
                    <h1 className='sh-pets-title'>The future of intelligent hospitality and connected workplace</h1>
                </div>
            </div>
            <div className='sh-pets-margin'></div>
            <h2 className='sh-pets-subtitle'>Do you want to know if your pet can accompany you?</h2>

            <section className={'sh-uploader ' + (this.props.isThinking || this.props.isUploading ? 'is-loading' : 'is-empty') + ' ' + (this.props.approved === true ? 'is-ok' : '') + ' ' + (this.props.approved === false ? 'is-bad' : '')}
                     onClick={this.onClickUploader}>

                {this.props.image ? <div className='sh-uploader-image' style={{ backgroundImage: `url(${this.props.image})` }}></div> : <div className='sh-uploader-avatar'></div>}

                <div className='sh-uploader-loading'>
                    {this.props.isThinking || this.props.isUploading ? <div><Loading isBright={true} /></div> : <div></div>}
                </div>
            </section>

            {!this.props.isThinking && !this.props.isUploading && this.props.approved === null ? <span className='sh-pets-smalltitle'>Click on the avatar to upload your picture</span> : <span></span>}
            {this.props.isUploading ? <span className='sh-pets-smalltitle'>Uploading the image...</span> : <span></span>}
            {this.props.isThinking ? <span className='sh-pets-smalltitle'>Processing the image...</span> : <span></span>}

            {this.props.approved === true ? <span className='sh-pets-smalltitle is-ok'>Your pet looks like a {this.props.message} and is accepted.</span> : <span></span>}
            {this.props.approved === false ? <span className='sh-pets-smalltitle is-bad'>Sorry your pet seems to be a {this.props.message} and we can't allow it.</span> : <span></span>}

            <input className='is-hidden' ref='nativeUpload' type='file' onChange={this.onFileChange} />

        </div>;
    }
}

export default connect(
    state => state.pets,
    dispatch => bindActionCreators(PetsStore.actionCreators, dispatch)
)(Pets);