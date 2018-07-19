@extends('layouts.app')

@section('title', $title)

@section('content')
    <div class="content--grey">
        <DealDetails
                deal="{{$deal}}"
        ></DealDetails>
    </div>
@endsection
