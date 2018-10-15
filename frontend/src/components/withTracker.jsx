/**
 * From ReactGA Community Wiki Page https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
 */
import React, { Component } from 'react'
import ReactGA from 'react-ga'
import config from 'config'

export default function withTracker(WrappedComponent, options = {}) {
    const trackPage = page => {
        if (!config['GOOGLE_ANALYTICS_UA']) {
            return false
        }

        if (typeof window !== 'undefined') {
            if (!window.ga) {
                ReactGA.initialize(config['GOOGLE_ANALYTICS_UA'])
            }

            ReactGA.set({
                page,
                ...options,
            })
            ReactGA.pageview(page)
        }
    }

    return class extends Component {
        componentDidMount() {
            const page = this.props.location.pathname
            trackPage(page)
        }

        componentDidUpdate(nextProps) {
            const currentPage = this.props.location.pathname
            const nextPage = nextProps.location.pathname

            if (currentPage !== nextPage) {
                trackPage(nextPage)
            }
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
}
