import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';
import HeaderToolbar from './HeaderToolbar';

export default class App extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    render() {
        return (
            <div className="app">
                <Header />
                <HeaderToolbar />
                <div className="app-content">{this.props.children}</div>
                <Footer />
            </div>
        );
    }
}
