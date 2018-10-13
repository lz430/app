import '../styles/app.scss';
import DealList from '../src/pages/deal-list/Container';
import App from '../src/App';
import React from 'react';

export default class Page extends React.Component {
    render() {
        return (
            <App>
                <DealList />
            </App>
        );
    }
}
