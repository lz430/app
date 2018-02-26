@extends('layouts.app')

@section('content')
<style>.hide{display:none;}.show{display:block;}</style>
<style>h2 {margin-bottom: 0;} pre {font-size: 0.85em; line-height: 1.3;}</style>

<script>function expand(target, hideLink = true) { document.getElementById("expand-" + target).className = "show"; if (hideLink) {document.getElementById("expand-button-" + target).className = "hide"; } }</script>

    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            @if ($deal->version)
            <a href="/deals/{{ $deal->id }}">See in the app</a>
            @else
            (doesn't exist in the app, because it wasn't correctly synced with a JATO version)
            @endif
            | <a href="/admin/deal-feature-debugger/{{ $deal->id }}">(deal feature debugger for this deal)</a>

            <h2>Deal:</h2>
            {{ $deal->year}} {{ $deal->make }} {{ $deal->model }} {{ $deal->series }} (VIN: {{ $deal->vin }})<br>
            <a href="#" id="expand-button-deal" onClick="expand('deal'); return false;">expand</a>
            <pre id="expand-deal" class="hide">
{{ json_encode($deal->toArray(), JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Dealer:</h2>
            {{ $deal->dealer->name }} in {{ $deal->dealer->city }}, {{ $deal->dealer->state }}<br>
            <a href="#" id="expand-button-dealer" onClick="expand('dealer'); return false;">expand</a>
            <pre id="expand-dealer" class="hide">
{{ json_encode($deal->dealer, JSON_PRETTY_PRINT) }}
            </pre>

            <h2>Version:</h2>
            {{ optional($deal->version)->description }}<br>
            <a href="#" id="expand-button-version" onClick="expand('version'); return false;">expand</a>
            <pre id="expand-version" class="hide">
@if ($deal->version)
{{ json_encode($deal->version->toArray(), JSON_PRETTY_PRINT) }}
@else
No version associated. Probably an error importing.
@endif
            </pre>

            <h2>Model:</h2>
            {{ optional($deal->version->model)->name }}<br>
            <a href="#" id="expand-button-model" onClick="expand('model'); return false;">expand</a>
            <pre id="expand-model" class="hide">
@if ($deal->version)
{{ json_encode($deal->version->model->toArray(), JSON_PRETTY_PRINT) }}
@else
No version associated. Probably an error importing.
@endif
            </pre>


            <h2>Make:</h2>
            {{ optional($deal->version->model->make)->name }}<br>
            <a href="#" id="expand-button-make" onClick="expand('make'); return false;">expand</a>
            <pre id="expand-make" class="hide">
@if ($deal->version)
{{ json_encode($deal->version->model->make->toArray(), JSON_PRETTY_PRINT) }}
@else
No version associated. Probably an error importing.
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

            <h2>Lease information</h2>
            @php
            $client = app(\DeliverMyRide\JATO\Client::class);
            $rates = $client->incentivesByVehicleIdAndZipcode(
                $deal->version ? $deal->version->jato_vehicle_id : 0,
                48103,
                ['category' => 8]
            )[0]['leaseRates'] ?? [];
            @endphp

            <a href="#" id="expand-button-lease-rates" onClick="expand('lease-rates'); return false;">expand</a>
            <pre id="expand-lease-rates" class="hide">
{{ json_encode($rates, JSON_PRETTY_PRINT) }}
            </pre>

            <br><br><br><br>

        </div>
    </div>
@endsection
