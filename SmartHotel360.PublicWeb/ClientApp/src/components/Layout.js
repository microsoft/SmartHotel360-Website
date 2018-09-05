import React, { Component } from 'react';
import { Footer } from './Footer';

export default class Layout extends Component {
    render() {
        return <div className='sh-site'>
            <section className='sh-content'>
                { this.props.children }
            </section>
            <Footer />
        </div>;
    }
}
