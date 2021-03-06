import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import config from '../core/config';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        const session = ctx.req.session;

        const sessionData = { ...session };
        delete sessionData['cookie'];
        delete sessionData['csrfSecret'];

        return { ...initialProps, sessionData };
    }

    render() {
        let csrfToken = null;

        if (this.props.__NEXT_DATA__.query.csrfToken) {
            csrfToken = this.props.__NEXT_DATA__.query.csrfToken;
        }

        let userId = null;
        if (this.props.sessionData.user) {
            userId = this.props.sessionData.user.id;
        } else if (this.props.sessionData.guestUser) {
            userId = this.props.sessionData.guestUser.id;
        }

        let userData = {};

        if (this.props.sessionData.purchase) {
            userData['purchaseId'] = this.props.sessionData.purchase.id;
            userData['purchaseStatus'] = this.props.sessionData.purchase.status;
        }

        if (this.props.sessionData.user) {
            userData['displayName'] = `${
                this.props.sessionData.user.first_name
            } ${this.props.sessionData.user.last_name}`;
            userData['email'] = this.props.sessionData.user.email;
        } else if (this.props.sessionData.guestUser) {
            userData['displayName'] = `${
                this.props.sessionData.guestUser.first_name
            } ${this.props.sessionData.guestUser.last_name}`;
            userData['email'] = this.props.sessionData.guestUser.email;
        }

        return (
            <html>
                <Head>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                    <meta name="theme-color" content="#1ABDDD" />
                    {config['REACT_APP_ENVIRONMENT'] !== 'production' && (
                        <meta name="robots" content="noindex,nofollow" />
                    )}

                    <link rel=" shortcut icon" href="/favicon.ico" />
                    <link
                        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700"
                        rel="stylesheet"
                    />

                    <script
                        id="session"
                        type="application/json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                                this.props.sessionData,
                                null,
                                2
                            ),
                        }}
                    />

                    <script
                        id="csrf"
                        type="application/json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                                { token: csrfToken },
                                null,
                                2
                            ),
                        }}
                    />

                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                          !function(f, b, e, v, n, t, s) {
                            if (f.fbq) return;
                            n = f.fbq = function() {
                              n.callMethod ?
                                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                            };
                            if (!f._fbq) f._fbq = n;
                            n.push = n;
                            n.loaded = !0;
                            n.version = '2.0';
                            n.queue = [];
                            t = b.createElement(e);
                            t.async = !0;
                            t.src = v;
                            s = b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t, s)
                          }(window,
                            document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                          fbq('init', '1524314924299567');
                          fbq('track', 'PageView');
                        `,
                            }}
                        />
                    )}

                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <noscript>
                            <img
                                height="1"
                                width="1"
                                style={{ display: 'none' }}
                                src="https://www.facebook.com/tr?id=1524314924299567&ev=PageView&noscript=1"
                            />
                        </noscript>
                    )}

                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                            window['_fs_debug'] = false;
                            window['_fs_host'] = 'fullstory.com';
                            window['_fs_org'] = 'BDWF3';
                            window['_fs_namespace'] = 'FS';
                            (function(m,n,e,t,l,o,g,y){
                              if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                              g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
                              o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
                              y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                              g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
                              g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                              g.consent=function(a){g("consent",!arguments.length||a)};
                              g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                              g.clearUserCookie=function(){};
                            })(window,document,window['_fs_namespace'],'script','user');
                        `,
                            }}
                        />
                    )}
                    {config['REACT_APP_ENVIRONMENT'] === 'production' &&
                        userId && (
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                FS.identify('${userId}');
                        `,
                                }}
                            />
                        )}

                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                FS.setUserVars(${JSON.stringify(userData)});
                        `,
                            }}
                        />
                    )}
                </Head>
                <body>
                    <Main />
                    <NextScript />

                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <script
                            type="text/javascript"
                            id="hs-script-loader"
                            async
                            defer
                            src="https://js.hs-scripts.com/3388780.js"
                        />
                    )}

                    {config['REACT_APP_ENVIRONMENT'] === 'staging' && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                        (function() {
                            var s = document.createElement("script");
                            s.type = "text/javascript";
                            s.async = true;
                            s.src = '//api.usersnap.com/load/f369972b-e7c1-4ad5-bb10-c83dc9c01240.js';
                            var x = document.getElementsByTagName('script')[0];
                            x.parentNode.insertBefore(s, x);
                        })();`,
                            }}
                        />
                    )}
                </body>
            </html>
        );
    }
}
