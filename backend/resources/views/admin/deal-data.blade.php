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
            <li role="presentation" class="active">
                <a href="/admin/deal/{{$deal->id}}">Features</a>
            </li>
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation">
                <a href="/admin/deal/{{$deal->id}}/jato">JATO Data</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

    <div class="row">
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    General
                @endslot
                <strong>ID: </strong> {{$deal->id}}<br/>
                <strong>Stock #: </strong> {{$deal->stock_number}}<br/>
                <strong>VIN: </strong> {{$deal->vin}}<br/>
                <strong>Packages: </strong> {{$deal->package_codes ? implode(", ", $deal->package_codes) : "None"}}
                <br/>
                <strong>Options: </strong> {{$deal->option_codes ? implode(", ", $deal->option_codes) : "None"}}<br/>
                <strong>Status: </strong> {{$deal->status}}
                @slot('footer')
                    <a href="/admin/deal/{{$deal->id}}/edit">Edit Deal Status</a>
                @endslot
            @endcomponent
            @component('components.box')
                @slot('title')
                    Dealer
                @endslot
                @if ($deal->dealer)
                    <strong>{{$deal->dealer->name}}</strong> <br/>
                    {{$deal->dealer->dealer_id}} <br/>
                    @slot('footer')
                        <a href="/admin/dealer/{{$deal->dealer->id}}/edit">Edit Dealer</a>
                    @endslot
                @else
                    No Dealer!
                @endif
            @endcomponent
        </div>
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    Colors
                @endslot
                <strong>Exterior Color: </strong> {{$deal->color}}<br/>
                <strong>Exterior Color Simplified: </strong> {{$deal->simpleExteriorColor()}}<br/>
                <strong>Interior Color: </strong> {{$deal->interior_color}}<br/>
            @endcomponent
        </div>
        <div class="col-md-4">
            @component('components.box')
                @slot('title')
                    Prices
                @endslot
                <ul class="list-group no-padding no-margin">
                    @foreach ($deal->prices() as $key => $price)
                        <li class="list-group-item">
                            {{$key}}: ${{number_format($price, 2)}}
                        </li>
                    @endforeach
                </ul>
            @endcomponent
            @component('components.box')
                @slot('title')
                    Source Prices
                @endslot
                <ul class="list-group no-padding no-margin">
                    @foreach ($deal->source_price as $key => $price)
                        <li class="list-group-item">
                            {{$key}}: ${{number_format($price, 2)}}
                        </li>
                    @endforeach
                </ul>
            @endcomponent
        </div>
    </div>
    <h3>
        Media
    </h3>

    <div class="row">
        <div class="col-md-3">
            @component('components.box')
                @slot('title')
                    Thumbnail
                @endslot
                @if ($deal->featuredPhoto())
                    <div class="text-center">
                        <img src="{{$deal->featuredPhoto()->thumbnail}}" alt="">
                    </div>
                @endif
            @endcomponent
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-header">
                    <div class="box-title">
                        Marketing Photos
                    </div>
                </div>
                <div class="box-body">
                    <div class="row">
                        @foreach ($deal->marketingPhotos() as $photo)
                            <div class="col-md-2">
                                <img style="max-width:100%; margin-bottom:20px;" src="{{$photo->url}}"/>
                            </div>
                        @endforeach
                    </div>

                </div>
            </div>
        </div>
    </div>
    <h3>
        Filters
    </h3>
    <div class="row">
        @foreach ($filters as $group)
            <div class="col-md-4">
                @foreach($group as $title => $category)
                    @component('components.box')
                        @slot('title')
                            {{$title}}
                        @endslot
                        <ul class="list-item no-padding no-margin text-sm">
                            @foreach($category as $feature)
                                <li class="list-group-item">
                                    {{$feature->title}}
                                </li>
                            @endforeach
                        </ul>
                    @endcomponent
                @endforeach
            </div>
        @endforeach
    </div>
    <div class="row">
        <div class="col-md-12">
            @component('components.box')
                @slot('title')
                    Vauto Features
                @endslot
                {{implode(', ', explode("|",$deal->vauto_features))}}
            @endcomponent
        </div>
    </div>
    @component('components.box')
        @slot('title')
            Equipment
        @endslot
        @foreach($equipment as $categoryTitle => $items)
            @component('components.box', ['collapsible' => true, 'key' => 'cat-' . str_slug($categoryTitle)])
                @slot('title')
                    {{$categoryTitle}}
                @endslot
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>Label</th>
                        <th>Value</th>
                        <th>Created From</th>
                        <th>Equipment</th>
                    </tr>
                    </thead>
                    <tbody>
                        @foreach($items as $item)
                            <tr>
                                <td>
                                    {{$item['label']}}
                                </td>
                                <td>
                                    {{$item['value']}}
                                </td>
                                <td>
                                    {{$item['meta']['from']}}
                                </td>
                                <td>
                                    @include('admin.shared.equipment', ['equipment' => $item['meta']['equipment'], 'prefix' => 'se'.$key])
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endcomponent
        @endforeach

    @endcomponent

    <h1>
        Models
    </h1>
    <div class="row">
        <div class="col-md-12">
            @foreach ($models as $key => $model)
                @component('components.box', ['collapsible' => true, 'key' => 'model-' . $key])
                    @slot('title')
                        {{$model['title']}}
                    @endslot
                    <pre>{{ json_encode($model['model'], JSON_PRETTY_PRINT) }}</pre>
                @endcomponent
            @endforeach
        </div>
    </div>
@endsection