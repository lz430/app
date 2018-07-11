@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            {{  $deal->title() }}
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li><a href="/admin/deal">Deals</a></li>
            <li class="active">View</li>
        </ol>
    </section>
@endsection

@section('content')
    @component('components.box', ['bodyclasses' => 'no-padding'])
        <ul class="nav nav-pills">
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}">Features</a>
            </li>
            <li role="presentation"  class="active">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

@endsection