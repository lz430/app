@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="section">
        <div class="title-bar">
            <div class="title-bar__title">
                Vehicle Comparison
            </div>
            <div class="title-bar__buttons">
                <button class="title-bar__button title-bar__button--small">Cash</button>
                <button class="title-bar__button title-bar__button--small">Finance</button>
                <button class="title-bar__button title-bar__button--small">Lease</button>
            </div>
        </div>
    </div>
    <div class="compare-deals">
    @foreach ($deals as $deal)
        @include('partials.compare-deal', $deal)
    @endforeach
    </div>
@endsection
