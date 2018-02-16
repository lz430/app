@extends('layouts.app')

@section('content')
    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            <h2>Deal:</h2>
            <a href="/deals/{{ $deal->id }}">See in the app</a>
            <pre>
{{ json_encode($deal->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Dealer:</h2>
            <pre>
{{ json_encode($deal->dealer, JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Version:</h2>
            <pre>
{{ json_encode($deal->version->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Photos:</h2>
            <ul>
            @foreach ($deal->photos as $photo)
                <li><a href="{{ $photo->url }}">Photo {{ $photo->id }}</a></li>
            @endforeach
            </ul>

            <h2>Features (DMR):</h2>
            <pre>
{{ json_encode($deal->features->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Features (JATO):</h2>
            <pre>
{{ json_encode($deal->jatoFeatures->toArray(), JSON_PRETTY_PRINT) }}
            </pre>
        </div>
    </div>
@endsection
