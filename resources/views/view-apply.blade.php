@extends('layouts.app')

@section('content')
    <Financing
            id="react-app"
            featuredPhoto="{{json_encode($featuredPhoto)}}"
            purchase="{{json_encode($purchase)}}"
            user="{{json_encode($user)}}"></Financing>
@endsection
