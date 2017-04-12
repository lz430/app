@extends('layouts.app')

@section('title', 'Garage')

@section('content')
    @foreach ($savedVehicles as $savedVehicle)
        <strong>{{ $savedVehicle->version->description }}</strong>

        <pre>
            {{ json_encode($savedVehicle->version, JSON_PRETTY_PRINT) }}
        </pre>
        <pre>
            {!! json_encode($savedVehicle->options, JSON_PRETTY_PRINT) !!}
        </pre>

        <hr>
    @endforeach
@endsection

