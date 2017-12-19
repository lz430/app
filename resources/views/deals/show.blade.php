@extends('layouts.app')

@section('title', $title)

@section('precontent')
    <div class="back-bar">
        <a href="javascript:window.history.back();">&lt; Back to previous</a>
    </div>
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">Details for Selected Vehicle...</div>
            @include('partials.steps', ['current' => 3])
        </div>
    </div>
@endsection

@section('content')
    <div class="content--grey">
        <DealDetails
                deal="{{$deal}}"
        ></DealDetails>
    </div>
@endsection
