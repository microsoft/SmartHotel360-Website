import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserStore from '../store/User';
import Loading from './Loading';

class Auth extends Component {
    renderLogin() {
        if (!this.props.name && !this.props.isLoading) {
            return (<li>
                <span className='sh-auth-link' onClick={() => { this.props.login() }}>Login</span>
            </li>);
        }
    }

    renderLoading() {
        if (this.props.isLoading) {
            return (<li>
                <Loading isBright={true} />
            </li>);
        }
    }

    renderLogout() {
        if (this.props.name && !this.props.isLoading) {
            return (<li className='sh-auth-group'>
                <section className='sh-auth-profile'>
                    <div className='sh-auth-name'>
                        {this.props.name}
                    </div>
                    <span className='sh-auth-link' onClick={() => { this.props.logout() }}>Logout</span>
                </section>
                <img alt="auth-picture" className='sh-auth-picture' src={this.props.gravatar} title={this.props.name} />
            </li>);
        }
    }

    render() {
        return <div className='sh-auth'>

            {this.renderLogin()}
            {this.renderLoading()}
            {this.renderLogout()}

        </div>;
    }

    componentDidMount() {
        this.props.init();
    }
};

export default connect(
    state => state.user,
    dispatch => bindActionCreators(UserStore.actionCreators, dispatch)
)(Auth);