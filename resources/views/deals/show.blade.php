@extends('layouts.app')

@section('title', 'Deliver My Ride')

@section('content')
    <DealDetails
        deal="{{$deal}}"
    ></DealDetails>
@endsection
