@extends('layouts.app')

@section('content')
    <Financing
            id="react-app"
            featuredPhoto="{{json_encode($featuredPhoto)}}"
            purchase="{{json_encode($purchase)}}"
            user="{{json_encode($user)}}"
            url={{json_encode($url)}}>
    </Financing>
@endsection
