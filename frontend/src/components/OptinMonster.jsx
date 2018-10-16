import React from 'react';
import ApiClient from '../store/api';
export default class OptinMonster extends React.Component {
    componentDidMount() {
        document.addEventListener(
            'om.Optin.success',
            this.handleOptinMonsterSubmit
        );
    }

    handleOptinMonsterSubmit = event => {
        const email = event.detail.Optin.data.fields.email;
        ApiClient.user.setEmail(email);
    };

    render() {
        return (
            <script
                type="text/javascript"
                src="https://a.optmnstr.com/app/js/api.min.js"
                data-account="27845"
                data-user="36449"
                async
            />
        );
    }
}
