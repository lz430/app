@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Deals that Violate Price Rules Grouped by Dealer
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
            @php
                $counter = 0;
            @endphp

            @foreach($deals as $item)
                @component('components.box', ['collapsible'=>false, 'key' => $counter++ ])
                @slot('title')
                    {{$item['dealer']['dealer_name']}}
                @endslot
                    <div>
                        <div>
                            <label>
                                Number of Invalid Deals:
                            </label>
                            {{count($item['deals'])}}
                        </div>

                    </div>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>VIN</th>
                            <th>TITLE</th>
                            <th>MSRP</th>
                            <th>DEFAULT PRICE</th>
                            <th>REASON FOR FAILURE</th>
                            <th>ACTIONS</th>
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
                            {{$content['deal']->title()}}
                        </td>
                        <td>
                            ${{number_format($content['prices']->msrp, 2)}}
                        </td>
                        <td>
                            ${{number_format($content['prices']->default, 2)}}
                        </td>
                        <td>
                            {{$content['reason']}}
                        </td>
                        <td>
                            <a href="/admin/deal/{{$content['deal']->id}}" target="_blank">View</a>
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