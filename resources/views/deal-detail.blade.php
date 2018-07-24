@extends('layouts.app')

@section('title', $title)

@section('content')
    <DealDetails id="react-app" deal="{{$deal}}"></DealDetails>
@endsection
