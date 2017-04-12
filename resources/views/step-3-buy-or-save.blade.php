<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Deliver My Ride</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

    <!-- Styles -->
    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Raleway', sans-serif;
            font-weight: 100;
            height: 100vh;
            margin: 0;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }

        .content {
            margin: 30px;
        }

        .title {
            font-size: 84px;
        }

        .links > a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }
    </style>
    <script>
        window.Laravel = {!! json_encode(['csrfToken' => csrf_token()]) !!};
    </script>
</head>
<body>
<div class="flex-center position-ref">
    @if (Route::has('login'))
        <div class="top-right links">
            @if (Auth::check())
                <a href="{{ url('/home') }}">Home</a>
            @else
                <a href="{{ url('/login') }}">Login</a>
                <a href="{{ url('/register') }}">Register</a>
            @endif
        </div>
    @endif

    <div class="content">
        <div class="title m-b-md">
            Buy or Save
        </div>

        <pre>
            {{ json_encode($version, JSON_PRETTY_PRINT) }}
        </pre>

        <form method="post" action="/buy">
            {{ csrf_field() }}

            @foreach($options as $option)
                <div style="border: 1px solid black;padding: 15px;">
                    <label><strong>{{ $option->name }}</strong>
                        <input disabled {{ in_array($option->id, $selectedOptionIds) ? 'checked' : '' }} type="checkbox" name="option_ids[]" value="{{ $option->id }}">
                    </label>
                </div>

                <br>
            @endforeach

            @foreach($options as $option)
                @if(in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <label>Make this my ride
                <button type="submit">Buy</button>
            </label>
        </form>

        <br>
        <br>

        <form method="post" action="/save">
            {{ csrf_field() }}

            <label>Share your car with yourself, or come back later to view it
                <br>
                <input type="email" name="email" required>
            </label>

            @foreach($options as $option)
                @if(in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <button type="submit" formaction="/save">Save</button>
        </form>
    </div>
</div>
</body>
</html>
