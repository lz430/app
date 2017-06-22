@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="section">
        <CompareTitleBar class="compare-title-bar"/>

    </div>
    <div class="compare-deals">
    @foreach ($deals as $deal)
        @include('partials.compare-deal', ['deal' => $deal, 'withoutDeal' => $withoutDeal])
    @endforeach
    </div>
@endsection
