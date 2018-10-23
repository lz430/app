import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import Header from './Header/Header';
import BrochureHeader from '../brochure/brochure-header.jsx';

import { LargeAndUp } from '../Responsive';
import Footer from './Footer';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        desktopOnlyFooter: PropTypes.bool.isRequired,
        isBrochureSite: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        desktopOnlyFooter: false,
        isBrochureSite: false,
    };

    renderHeader() {
        if (this.props.isBrochureSite) {
            return <BrochureHeader />;
        }

        return <Header />;
    }

    /**
     *
     * @returns {*}
     */
    renderFooter() {
        if (this.props.desktopOnlyFooter) {
            return (
                <LargeAndUp>
                    <Footer />
                </LargeAndUp>
            );
        }

        return <Footer />;
    }

    render() {
        return (
            <div className="app">
                {this.renderHeader()}

                <div className="app-content-wrapper">
                    <div className="app-content">{this.props.children}</div>
                    {this.renderFooter()}
                </div>
            </div>
        );
    }
}

export default withRouter(App);
