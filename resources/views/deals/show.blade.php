@extends('layouts.app')

@section('title', $title)

@section('content')
    <DealDetails
        deal="{{$deal}}"
    ></DealDetails>
@endsection
