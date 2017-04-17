import React from 'react';

class Configured extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div>{this.props.version.name}</div>
        );
    }
}

export default Configured;
