<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@section('title', config('app.name'))</title>

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">

        <!-- Scripts -->
        <script>
            window.Laravel = {!! json_encode([
                'csrfToken' => csrf_token(),
                'apiToken' => auth()->user()->api_token ?? null
            ]) !!};
        </script>
    </head>
    <body>
        <nav class="nav">
            <a class="nav__logo" href="{{ url('/') }}">
                <img src="/images/dmr-logo.svg">
            </a>

            <div class="nav__search">
                <input type="text">
            </div>

            <div class="nav__links">
                <!-- Authentication Links -->
                @if (! request()->is('login') && auth()->check())
                    <a href="{{ route('home') }}">My Garage</a>
                @endif

                @if (! auth()->check())
                    <a href="{{ route('login') }}">Login</a>
                @endif
            </div>
        </nav>

        <div class="content">
            @yield('content')
        </div>

        <footer class="footer">
            <p>
                Copyright © 2017 Deliver My Ride. All rights reserved.
            </p>
        </footer>
        <!-- Scripts -->
        <script src="{{ asset('js/app.js') }}"></script>
        @if ( App::environment('staging') )
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
        @endif
    </body>
</html>
