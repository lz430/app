@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Report :: Deals missing price fields
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
            @foreach($data as $item)
                @component('components.box')
                    @slot('title')
                        <a href="/admin/dealer/{{$item['dealer']->id}}/edit">{{$item['dealer']->id}}
                            - {{$item['dealer']->name}}</a>
                    @endslot
                    <div>
                        <div>
                            <label>
                                Base Fields:
                            </label>
                            {{implode(", ", $item['fields'])}}
                        </div>

                    </div>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>VIN</th>
                            <th>Title</th>
                            <th>Source Price Fields</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($item['deals']->forPage(1, 10) as $deal)
                            <tr>
                                <td>
                                    {{$deal->id}}
                                </td>
                                <td>
                                    {{$deal->vin}}
                                </td>
                                <td>
                                    {{$deal->title()}}
                                </td>
                                <td>
                                    {{implode(", ", array_keys((array) get_object_vars($deal->source_price)))}}
                                </td>
                            </tr>
                        @endforeach
                        </tbody>

                    </table>

                    @slot('footer')
                        Total: {{$item['deals']->count()}}
                    @endslot
                @endcomponent
            @endforeach
        </div>

    </div>
@endsection