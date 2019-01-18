import '../../styles/app.scss';
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import TypeFormIframe from '../../modules/concierge/components/TypeFormIframe';

import { withRouter } from 'next/router';
import Head from 'next/head';

class Page extends Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Concierge</title>
                </Head>
                <Container>
                    <div className="embed-responsive embed-responsive-1by1">
                        <TypeFormIframe />
                    </div>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(Page);
