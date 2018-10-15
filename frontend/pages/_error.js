import '../styles/app.scss';

import React from 'react';
import PageContent from '../src/components/App/PageContent';

export default class Page extends React.Component {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        return { statusCode };
    }

    render() {
        return (
            <PageContent>
                <p className="text-center mb-5 mt-5">
                    {this.props.statusCode
                        ? `An error ${this.props.statusCode} occurred on server`
                        : 'An error occurred on client'}
                </p>
            </PageContent>
        );
    }
}
