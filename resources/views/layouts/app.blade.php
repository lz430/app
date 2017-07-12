<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@section('title', config('app.name'))</title>

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">

        <!-- Scripts -->
        <script>
            window.Laravel = {!! json_encode([
                'csrfToken' => csrf_token(),
                'apiToken' => auth()->user()->api_token ?? null,
                'fuelApiKey' => config('services.fuel.api_key')
            ]) !!};

            window.user = {!! auth()->user() ? json_encode(auth()->user()) : 'null' !!};
        </script>
    </head>
    <body class="{{ $bodyClass ?? '' }}">
        @section('nav')
        <nav class="nav">
            <div class="nav__constrained">
                <a class="nav__logo" href="{{ url('/') }}">
                    <img src="/images/dmr-logo.svg">
                </a>

                <div class="nav__links">
                    <!-- Authentication Links -->
                    @if (! request()->is('login') && auth()->check())
                        <form name="logout" action="/logout" method="post">
                            {{ csrf_field() }}
                            <button class="nav__button nav__button--blue nav__button--small nav__button--no-border">Logout</button>
                        </form>
                    @endif

                    @if (! auth()->check())
                        <a href="{{ route('login') }}">
                            <button class="nav__button nav__button--blue nav__button--small nav__button--no-border">Login</button>
                        </a>
                    @endif
                </div>
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
