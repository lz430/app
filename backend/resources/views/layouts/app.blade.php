<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="theme-color" content="#41b1ac"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title')</title>

</head>
<body class="{{ $bodyClass ?? '' }}">
<div class="content {{ $contentClass ?? '' }}">
    @yield('content')
</div>
</body>
</html>