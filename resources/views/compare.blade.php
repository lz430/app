@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('precontent')
    <div class="back-bar">
        <a href="javascript:window.history.back();">&lt; Back to previous</a>
    </div>
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">Selected Vehicles to Compare…</div>
            @include('partials.steps', ['current' => 4])
        </div>
    </div>
@endsection

@section('content')
    <ComparePage></ComparePage>
@endsection
