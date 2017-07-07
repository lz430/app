@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <ComparePage
        deals="{{$deals}}"
    ></ComparePage>
@endsection
