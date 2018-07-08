@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('precontent')
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">
                <a href="javascript:window.history.back();">&lt; Back</a>
            </div>
            @include('partials.steps', ['current' => 4])
        </div>
    </div>
@endsection

@section('content')
    <ComparePage></ComparePage>
@endsection
