import React from 'react';
import PageContent from 'components/App/PageContent';
import withTracker from 'components/withTracker';

class Container extends React.Component {
    render() {
        return (
            <PageContent>
                <h1 className="text-center mb-5 mt-5">Page Not Found</h1>
            </PageContent>
        );
    }
}

export default withTracker(Container);
