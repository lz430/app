@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <div class="section">
        <ComparePage
                class="compare-page"
                deals="{{$deals}}"
        ></ComparePage>
    </div>
@endsection
