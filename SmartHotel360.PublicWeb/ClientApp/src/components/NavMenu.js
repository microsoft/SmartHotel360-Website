import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Auth from './Auth';
import * as NavMenuStore from '../store/NavMenu';

class NavMenu extends Component {
    render() {
        return <div className={`sh-nav_menu ${this.props.isHome ? 'is-home' : ''}`}>
            <Link to={'/'} className='sh-nav_menu-container'>
                <img alt="logo" className={`sh-nav_menu-logo ${this.props.isHome ? 'is-home' : ''}`} src='/assets/images/logo.svg' />
            </Link>

            <ul className='sh-nav_menu-links'>
                <Auth />
            </ul>
        </div>;
    }

    componentDidMount() {
        this.props.listen(this.props.history);
    }
}

export default connect(
    state => state.nav,
    dispatch => bindActionCreators(NavMenuStore.actionCreators, dispatch)
)(NavMenu);