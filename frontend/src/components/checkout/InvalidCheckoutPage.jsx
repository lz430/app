import React from 'react';
import PageContent from '../App/PageContent';

export default class InvalidCheckoutPage extends React.PureComponent {
    render() {
        return (
            <PageContent>
                <h2 className="text-center mb-4 mt-4">
                    We&#39;re sorry, this page is invalid.
                </h2>
            </PageContent>
        );
    }
}
