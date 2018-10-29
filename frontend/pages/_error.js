import '../styles/app.scss';

import React from 'react';
import PropTypes from 'prop-types';

export default class Page extends React.Component {
    static propTypes = {
        statusCode: PropTypes.string,
    };

    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        return { statusCode };
    }

    render() {
        return (
            <h3 className="text-center mb-5 mt-5">
                {this.props.statusCode
                    ? `An error ${this.props.statusCode} occurred on server`
                    : '404: Page Not Found'}
            </h3>
        );
    }
}
