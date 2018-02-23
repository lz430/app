@extends('layouts.app')

@section('content')
    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            <a href="/admin/deal-debugger/{{ $deal->id }}">(deal debugger for this deal)</a>

            <h2>Deal (from VAuto)</h2>
            {{ $deal->year }} {{ $deal->make }} {{ $deal->model }} {{ $deal->series }}<br>
            VAuto features:<br>
            <ul>
            @foreach (explode('|', $deal->vauto_features) as $vauto_feature)
                <li>{{ $vauto_feature }}</li>
            @endforeach
            </ul>

            <br><br>
            <h2>DMR Features pulled fresh (mapped from JATO equipment)</h2>
            <p>Note: This is *NOT* what our database shows; this is what a fresh lookup to JATO is showing. So this page is for testing our importer. If you see data here that isn't reflected in the app, check this page against the deal debugger page. If they're out of sync, that means our importer is working but we may need to wipe the database... or something.</p>
            <ul>
            @foreach ($features as $feature)
                <li>{{ $feature->title }}</li>
            @endforeach
            </ul>

            <br><br>
            <h2>JATO Equipment raw</h2>
            @php
            dump($equipment)
            @endphp

            (same data, but JSON:)

            <pre>
{{ json_encode($equipment) }}
            </pre>
        </div>
    </div>
@endsection
