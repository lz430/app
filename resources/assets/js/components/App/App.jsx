import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header/Header';
import HeaderToolbar from './Header/HeaderToolbar';

export default class App extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    render() {
        return (
            <div className="app">
                <div className="app-header-wrapper">
                    <Header />
                    <HeaderToolbar />
                </div>
                <div className="app-content">{this.props.children}</div>
                <Footer />
            </div>
        );
    }
}
