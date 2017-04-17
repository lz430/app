@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="step-0">
        <form method="post" action="/step-0">
            {{ csrf_field() }}
            <div id="configurator" data-makes='{!! json_encode($makes) !!}'></div>
        </form>
    </div>
@endsection
