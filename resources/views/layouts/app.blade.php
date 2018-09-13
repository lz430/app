<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#41b1ac" />
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title')</title>

        <link href="{{ mix('css/app.css') }}" rel="stylesheet">

        <script>
            window.Laravel = {!! json_encode([
                'csrfToken' => csrf_token(),
                'apiToken' => auth()->user()->api_token ?? null,
            ]) !!};
        </script>

        @if (App::environment(['staging', 'production']))
            <!-- Facebook Pixel Code -->
            <script>
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                    document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1524314924299567');
                fbq('track', 'PageView');
            </script>
            <noscript><img height="1" width="1" style="display:none"
                           src="https://www.facebook.com/tr?id=1524314924299567&ev=PageView&noscript=1"
                /></noscript>
            <!-- DO NOT MODIFY -->
            <!-- End Facebook Pixel Code -->
        @endif

        @if (App::environment(['production']))
            <!-- Fullstory -->
            <script>
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
            </script>
            <!-- Fullstory -->
        @endif
    @if (config('services.mixpanel.token'))
        <!-- start Mixpanel --><script type="text/javascript">(function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
                    0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
                    for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
                mixpanel.init("{{config('services.mixpanel.token')}}");</script><!-- end Mixpanel -->

        @endif

    </head>
    <body class="{{ $bodyClass ?? '' }}">
        <div class="content {{ $contentClass ?? '' }}">
            @yield('content')
        </div>

        @if (App::environment(['staging', 'production']))
            <script src="https://cdn.ravenjs.com/3.24.2/raven.min.js" crossorigin="anonymous"></script>
            <script>
                Raven.config('https://4e802d8f79514015b7b3c05a9a8487dc@sentry.io/1200027').install()
            </script>
        @endif

        <script src="{{ mix('js/app.js') }}"></script>
        @stack('scripts')
        @if (config('services.googleanalytics.ua'))
            <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/3388780.js"></script>
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                ga('create', '{{config('services.googleanalytics.ua')}}', 'auto');
                ga('send', 'pageview');
            </script>
        @endif

        @if (App::environment(['staging', 'production']))

            <!-- This site is converting visitors into subscribers and customers with OptinMonster - https://optinmonster.com -->
            <script type="text/javascript" src="https://a.optmnstr.com/app/js/api.min.js" data-account="27845" data-user="36449" async></script>
            <!-- / https://optinmonster.com -->

            {{-- OptinMonster --}}
            <script type="text/javascript">
                document.addEventListener('om.Optin.init.submit', function(event) {
                    if (event.detail.Optin && event.detail.Optin.data &&  event.detail.Optin.data.fields.email) {
                        var email = event.detail.Optin.data.fields.email;
                        window.axios.post('/set-email', {email: email}, {headers: {'X-CSRF-TOKEN': "{{csrf_token()}}"}});
                    }
                } );
            </script>
        @endif

        @if (App::environment(['staging']))
            <script type="text/javascript">
                (function() { var s = document.createElement("script"); s.type = "text/javascript"; s.async = true; s.src = '//api.usersnap.com/load/f369972b-e7c1-4ad5-bb10-c83dc9c01240.js';
                    var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); })();
            </script>
        @endif
    </body>
</html>
