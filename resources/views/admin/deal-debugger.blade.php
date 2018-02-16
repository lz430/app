@extends('layouts.app')

@section('content')
<style>.hide{display:none;}.show{display:block;}</style>

<script>function expand(target, hideLink = true) { document.getElementById("expand-" + target).className = "show"; if (hideLink) {document.getElementById("expand-button-" + target).className = "hide"; } }</script>

    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            @if ($deal->version)
            <a href="/deals/{{ $deal->id }}">See in the app</a>
            @else
            (doesn't exist in the app, because it wasn't correctly synced with a JATO version)
            @endif

            <h2>Deal:</h2>
            <a href="#" id="expand-button-deal" onClick="expand('deal'); return false;">expand</a>
            <pre id="expand-deal" class="hide">
{{ json_encode($deal->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Dealer:</h2>
            <a href="#" id="expand-button-dealer" onClick="expand('dealer'); return false;">expand</a>
            <pre id="expand-dealer" class="hide">
{{ json_encode($deal->dealer, JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Version:</h2>
            <a href="#" id="expand-button-version" onClick="expand('version'); return false;">expand</a>
            <pre id="expand-version" class="hide">
@if ($deal->version)
{{ json_encode($deal->version->toArray(), JSON_PRETTY_PRINT) }}
@else
No deal associated. Probably an error importing.
@endif
            </pre>

            <h2>Photos:</h2>
            <a href="#" id="expand-button-photos" onClick="expand('photos'); return false;">expand</a>
            <ul id="expand-photos" class="hide">
            @foreach ($deal->photos as $photo)
                <li><a href="{{ $photo->url }}">Photo {{ $photo->id }}</a></li>
            @endforeach
            </ul>

            <h2>Features (DMR):</h2>
            <a href="#" id="expand-button-dmr-features" onClick="expand('dmr-features'); return false;">expand</a>
            <pre id="expand-dmr-features" class="hide">
{{ json_encode($deal->features->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Features (JATO):</h2>
            <a href="#" id="expand-button-jato-features" onClick="expand('jato-features'); return false;">expand</a>
            <pre id="expand-jato-features" class="hide">
{{ json_encode($deal->jatoFeatures->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <br><br><br><br>
        </div>
    </div>
@endsection
