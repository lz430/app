@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Deals that Violate Price Rules
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
                    {{$item['dealer']['dealer_name']}}
                @endslot
                    <table class="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>VIN</th>
                            <th>STOCK NUMBER</th>
                            <th>MSRP</th>
                            <th>PRICE</th>
                            <th>INVALID REASON</th>
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
                            {{$content['deal']->stock_number}}
                        </td>
                        <td>
                            ${{number_format($content['deal']->msrp, 2)}}
                        </td>
                        <td>
                            ${{number_format($content['deal']->price, 2)}}
                        </td>
                        <td>
                            {{$content['reason']}}
                        </td>
                    </tr>
                @endforeach
                    </tbody>

                </table>
                @endcomponent
            @endforeach
        </div>
    </div>
@endsection