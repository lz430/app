import '../../styles/app.scss';
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import TypeFormIframe from '../../modules/concierge/components/TypeFormIframe';

import withTracker from '../../components/withTracker';

class Page extends Component {
    render() {
        return (
            <Container>
                <div className="embed-responsive embed-responsive-1by1">
                    <TypeFormIframe />
                </div>
            </Container>
        );
    }
}

export default withTracker(Page);
