import React, { Component } from 'react';

class TypeFormIframe extends Component {
    state = {
        results: null,
    };

    componentDidMount() {
        window.addEventListener('message', this.handleFrameTasks);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleFrameTasks);
    }

    handleFrameTasks = e => {
        console.log(e);
    };

    render() {
        return (
            <iframe
                title="Trade-In Application"
                ref={f => (this.ifr = f)}
                frameBorder="0"
                className="embed-responsive-item"
                src="https://delivermyride1.typeform.com/to/gORPBv"
            />
        );
    }
}

export default TypeFormIframe;
