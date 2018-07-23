@extends('layouts.app')

@section('title', $title)

@section('content')
    <ConfirmDetails id="react-app" deal="{{$deal}}"></ConfirmDetails>
@endsection
