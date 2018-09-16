import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../icons/miscicons/Loading';

class RouteOneIframe extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    componentDidMount() {
        this.ifr.onload = this.handleIframeOnLoad.bind(this);
        window.addEventListener('message', this.handleFrameTasks);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleFrameTasks);
    }

    shouldComponentUpdate() {
        return false;
    }

    handleFrameTasks = e => {};

    render() {
        return (
            <div>
                {this.state.isLoading && <Loading />}
                <iframe
                    ref={f => (this.ifr = f)}
                    frameBorder="0"
                    className="embed-responsive-item"
                    id="routeOne"
                    src={this.props.url}
                />
            </div>
        );
    }
}

export default RouteOneIframe;
