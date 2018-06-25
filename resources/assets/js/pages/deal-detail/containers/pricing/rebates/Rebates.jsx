import React from 'react';
import Targets from '../../../../../components/Targets';

class Rebates extends React.PureComponent {
    render() {
        return <div />;

        // First pass might be to pass-thru to <Targets /> but we may
        // end up just completely rewriting Rebates entirely now
        // that we need to account for new UI and new data
        // via Cox vs what we had for Jato.

        return (
            <Targets
                deal={this.props.dealPricing.deal()}
                targetsChanged={this.props.onChange}
            />
        );
    }
}

Rebates.defaultProps = {
    onChange: () => {},
};

export default Rebates;
