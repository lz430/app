@extends('layouts.app')

@section('title', $title)

@section('content')
    <div class="content--grey">
        <ConfirmDetails
                deal="{{$deal}}"
        ></ConfirmDetails>
    </div>
@endsection
