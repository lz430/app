<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

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
    </body>
</html>
