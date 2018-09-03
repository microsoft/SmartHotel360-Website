import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as $ from 'jquery';
import { connect } from 'react-redux';
import * as RoomsStore from '../store/Rooms';

class Filter extends Component {
    $header;
    $dropdown;
    $filter;
    node;

    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        this.state = {
            modalVisible: false
        };
    }

    handleClick() {
        if (!this.state.modalVisible) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            popupVisible: !prevState.modalVisible,
        }));
    }

    handleOutsideClick(e) {
        if (this.node.contains(e.target)) {
            return;
        }

        this.close();
    }

    setStyles = () => {
        return {
            left: this.props.left,
            right: this.props.right
        }
    }

    toggle = () => {
        if (this.props.disabled) {
            return;
        }
        this.handleClick();
        this.$header.toggleClass('active');
        this.$dropdown.toggleClass('active');
        this.$filter.toggleClass('active');
    }

    onClickCancel = () => {
        this.close();
    }

    onClickApply = () => {
        this.props.requestFiltered();
        this.close();
    }

    close = () => {
        this.$header.removeClass('active');
        this.$dropdown.removeClass('active');
        this.$filter.removeClass('active');
    }
    
    render() {
        return <div ref='filter' className='sh-filter'>
            <div ref={node => { this.node = node; }}>
            <label className='sh-filter-header sh-filter-arrow' ref='header' onClick={this.toggle}>
                <span className='sh-filter-title'>{this.props.title}</span>
                <i className='sh-filter-icon icon-sh-chevron'></i>
            </label>
            <section className='sh-filter-dropdown' ref='dropdown' style={this.setStyles()}>
                <div>
                    {this.props.children}
                </div>
                <ul className='sh-filter-actions'>
                    <li className='sh-filter-button sh-filter-button--cancel' onClick={this.onClickCancel}>Cancel</li>
                    <li className='sh-filter-button sh-filter-button--apply' onClick={this.onClickApply}>Apply</li>
                </ul>
            </section>
            </div>
        </div>;
    }

    componentDidMount() {
        this.$header = $(this.refs.header);
        this.$dropdown = $(this.refs.dropdown);
        this.$filter = $(this.refs.filter);
    }
}

export default connect(
    state => state.rooms,
    dispatch => bindActionCreators(RoomsStore.actionCreators, dispatch)
)(Filter);