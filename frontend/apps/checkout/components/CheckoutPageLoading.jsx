import React from 'react';
import Loading from '../../../components/Loading';

export default class CheckoutPageLoading extends React.PureComponent {
    render() {
        return (
            <h2 className="text-center mb-4 mt-4">
                <Loading />
            </h2>
        );
    }
}
