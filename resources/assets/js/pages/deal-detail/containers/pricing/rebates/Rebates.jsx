import React from 'react';

class Rebates extends React.PureComponent {
    static defaultProps = {
        onChange: () => {},
    };

    render() {
        return <div />;

        // First pass might be to pass-thru to <Targets /> but we may
        // end up just completely rewriting Rebates entirely now
        // that we need to account for new UI and new data
        // via Cox vs what we had for Jato.
    }
}

export default Rebates;
