import React from 'react';
import config from 'config';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <footer className="page-footer">
                <div className="footer-meta">
                    <a href={config.MARKETING_URL + '/contact'}>Contact</a>&nbsp;|&nbsp;
                    <a href={config.MARKETING_URL + '/terms-of-service'}>
                        Terms
                    </a>&nbsp;|&nbsp;
                    <a href={config.MARKETING_URL + '/privacy-policy'}>
                        Privacy
                    </a>&nbsp;|&nbsp; &copy; 2018 Deliver My Ride.{' '}
                    <span className="footer-meta--desktop">
                        All Rights Reserved.&nbsp;|&nbsp; Headquarters: 35 W
                        Huron Street, Suite 1000, Pontiac, MI 48342&nbsp;|&nbsp;
                        Phone: 248.590.0360
                    </span>
                </div>
            </footer>
        );
    }
}
