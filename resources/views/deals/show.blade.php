@extends('layouts.app')

@section('title', $title)

@section('content')
    <div class="content--gray">
        <DealDetails
                deal="{{$deal}}"
        ></DealDetails>
    </div>
@endsection
