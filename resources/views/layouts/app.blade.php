<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title')</title>

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">

        <!-- Scripts -->
        <script>
            window.Laravel = {!! json_encode([
                'csrfToken' => csrf_token(),
                'apiToken' => auth()->user()->api_token ?? null,
                'fuelApiKey' => config('services.fuel.api_key'),
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
                fbq('init', '1524314924299567'); // Insert your pixel ID here.
                fbq('track', 'PageView');
            </script>
            <noscript><img height="1" width="1" style="display:none"
                           src="https://www.facebook.com/tr?id=1524314924299567&ev=PageView&noscript=1"
                /></noscript>
            <!-- DO NOT MODIFY -->
            <!-- End Facebook Pixel Code -->
        @endif

    </head>
    <body class="{{ $bodyClass ?? '' }}">
        @section('nav')
        <nav class="nav">
            <div class="nav__constrained">
                <a class="nav__logo" href="{{ url('/') }}">
                    <img src="/images/dmr-logo.svg">
                </a>
            </div>
        </nav>
        @show

        <div class="content {{ $contentClass ?? '' }}">
            @yield('content')
        </div>

        @section('footer')
        <footer class="footer">
            <div class="footer__icon">
                {!! file_get_contents(resource_path("assets/svg/social/twitter.svg")) !!}
            </div>
            <div class="footer__icon">
                {!! file_get_contents(resource_path("assets/svg/social/facebook.svg")) !!}
            </div>
            <div class="footer__icon">
                {!! file_get_contents(resource_path("assets/svg/social/google-plus.svg")) !!}
            </div>
        </footer>

        @include('footer')
        @show
        <!-- Scripts -->
        <script src="{{ asset('js/app.js') }}"></script>
        @stack('scripts')
        @if (App::environment(['staging', 'production']))

            <!-- Start of HubSpot Embed Code -->
            <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/3388780.js"></script>
            <!-- End of HubSpot Embed Code -->

            <!-- Google Analytics -->
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                ga('create', 'UA-76262472-1', 'auto');
                ga('send', 'pageview');
            </script>
            <!-- End Google Analytics -->

            <!-- This site is converting visitors into subscribers and customers with OptinMonster - https://optinmonster.com -->
            <script>
                var om59caa4e21fc14,om59caa4e21fc14_poll=function(){var r=0;return function(n,l){clearInterval(r),r=setInterval(n,l)}}();!function(e,t,n){if(e.getElementById(n)){om59caa4e21fc14_poll(function(){if(window['om_loaded']){if(!om59caa4e21fc14){om59caa4e21fc14=new OptinMonsterApp();return om59caa4e21fc14.init({"s":"36449.59caa4e21fc14","staging":0,"dev":0,"beta":0});}}},25);return;}var d=false,o=e.createElement(t);o.id=n,o.src="https://a.optnmstr.com/app/js/api.min.js",o.async=true,o.onload=o.onreadystatechange=function(){if(!d){if(!this.readyState||this.readyState==="loaded"||this.readyState==="complete"){try{d=om_loaded=true;om59caa4e21fc14=new OptinMonsterApp();om59caa4e21fc14.init({"s":"36449.59caa4e21fc14","staging":0,"dev":0,"beta":0});o.onload=o.onreadystatechange=null;}catch(t){}}}};(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(o)}(document,"script","omapi-script");
            </script>
            <!-- / OptinMonster -->
        @endif
    </body>
</html>
