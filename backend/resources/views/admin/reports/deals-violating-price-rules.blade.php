@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Vehicles Violating Price Rules
        </h1>
        <ol class="breadcrumb">
            <li><a href="{{ backpack_url() }}">{{ config('backpack.base.project_name') }}</a></li>
            <li class="active">{{ trans('backpack::base.dashboard') }}</li>
        </ol>

    </section>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">

            @foreach($deals as $item)
                @component('components.box')
                @slot('title')
                    <a href="/admin/deal/{{$item['dealer']['id']}}/edit">{{$item['dealer']['id']}}
                        - {{$item['dealer']['dealer_name']}}</a>
                @endslot
                    <table class="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>VIN</th>
                            <th>Invalid Reason</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                {{--render each dealers deal --}}
                @foreach($item['deals'] as $content)
                    <tr>
                        <td>
                            {{$content['deal']->id}}
                        </td>
                        <td>
                            {{$content['deal']->vin}}
                        </td>
                        <td>
                            {{$content['reason']}}
                        </td>
                        <td>-----</td>
                    </tr>
                @endforeach
                    </tbody>

                </table>
                @endcomponent
            @endforeach
        </div>
    </div>
@endsection