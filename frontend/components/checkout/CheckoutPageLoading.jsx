import React from 'react';
import Loading from '../../icons/miscicons/Loading';

export default class CheckoutPageLoading extends React.PureComponent {
    render() {
        return (
            <h2 className="text-center mb-4 mt-4">
                <Loading />
            </h2>
        );
    }
}
