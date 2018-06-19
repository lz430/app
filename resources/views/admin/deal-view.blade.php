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
    <h1>
        Deal
    </h1>
    <div class="row">
        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Source Prices</div>
                </div>
                <div class="box-body">
                    <ul class="list-group no-padding no-margin">
                        @foreach ($deal->source_price as $key => $price)
                            <li class="list-group-item">
                                {{$key}} : {{$price}}
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Prices</div>
                </div>
                <div class="box-body">
                    <ul class="list-group no-padding no-margin">
                        @foreach ($deal->prices() as $key => $price)
                            <li class="list-group-item">
                                {{$key}} : {{$price}}
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Vauto Features</div>
                </div>
                <div class="box-body">
                    {{implode(', ', explode("|",$deal->vauto_features))}}
                </div>
            </div>
        </div>
    </div>

    <h3>
        Features
    </h3>
    <div class="row">

        @foreach ($features as $group)
            <div class="col-md-4">
                @foreach($group as $title => $category)
                    <div class="box box-default">
                        <div class="box-header">
                            <div class="box-title">{{$title}}</div>
                        </div>
                        <div class="box-body">
                            <ul class="list-item no-padding no-margin">
                                @foreach($category as $feature)
                                    <li class="list-group-item">
                                        {{$feature->title}}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>

    <h1>
        Jato Data
    </h1>
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-header">
                    <div class="box-title">
                        Standard Equipment
                    </div>
                </div>
                <div class="box-body">
                    <div class="row">
                        @foreach($standardEquipment as $key => $equipment)
                            <div class="col-md-3">
                                <div class="panel box box-primary">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            <a data-toggle="collapse" data-parent="#accordion" href="#se-{{$key}}"
                                               aria-expanded="false" class="collapsed">
                                                {{$equipment->name}}
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="se-{{$key}}" class="panel-collapse collapse" aria-expanded="false"
                                         style="height: 0px;">
                                        <div class="box-body">
                                            <pre>{{ json_encode($equipment, JSON_PRETTY_PRINT) }}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-header with-border">
                    <div class="box-title">Packages</div>
                </div>

                <div class="box-body">
                    <div class="box-group" id="accordion-package">
                        @foreach ($packages as $key => $package)
                            <div class="panel box box-primary">
                                <div class="box-header with-border">
                                    <h4 class="box-title">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#package-{{$key}}"
                                           aria-expanded="false" class="collapsed">
                                            {{$package['isOnDeal'] ? "YES" : "NO"}} [{{$package['option']->optionCode}}]
                                            - {{$package['option']->optionName}}
                                        </a>
                                    </h4>
                                </div>
                                <div id="package-{{$key}}" class="panel-collapse collapse" aria-expanded="false"
                                     style="height: 0px;">
                                    <div class="box-body">
                                        <pre>{{ json_encode($package['option'], JSON_PRETTY_PRINT) }}</pre>
                                        <div class="row">
                                            @foreach($package['equipment'] as $key => $equipment)
                                                <div class="col-md-3">
                                                    <div class="panel box box-primary">
                                                        <div class="box-header with-border">
                                                            <h4 class="box-title">
                                                                <a data-toggle="collapse" data-parent="#accordion" href="#pe-{{$key}}"
                                                                   aria-expanded="false" class="collapsed">
                                                                    {{$equipment->name}}
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div id="pe-{{$key}}" class="panel-collapse collapse" aria-expanded="false"
                                                             style="height: 0px;">
                                                            <div class="box-body">
                                                                <pre>{{ json_encode($equipment, JSON_PRETTY_PRINT) }}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">

                <div class="box-header with-border">
                    <div class="box-title">Options</div>
                </div>

                <div class="box-body">
                    <div class="box-group" id="accordion-option">
                        @foreach ($options as $key => $option)
                            <div class="panel box box-primary">
                                <div class="box-header with-border">
                                    <h4 class="box-title">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#option-{{$key}}"
                                           aria-expanded="false" class="collapsed">
                                            {{$option['isOnDeal'] ? "YES" : "NO"}} [{{$option['option']->optionCode}}]
                                            - {{$option['option']->optionName}}
                                        </a>
                                    </h4>
                                </div>
                                <div id="option-{{$key}}" class="panel-collapse collapse" aria-expanded="false"
                                     style="height: 0px;">
                                    <div class="box-body">
                                        <pre>{{ json_encode($option['option'], JSON_PRETTY_PRINT) }}</pre>
                                        <div class="row">
                                            @foreach($option['equipment'] as $key => $equipment)
                                                <div class="col-md-3">
                                                    <div class="panel box box-primary">
                                                        <div class="box-header with-border">
                                                            <h4 class="box-title">
                                                                <a data-toggle="collapse" data-parent="#accordion" href="#oe-{{$key}}"
                                                                   aria-expanded="false" class="collapsed">
                                                                    {{$equipment->name}}
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div id="oe-{{$key}}" class="panel-collapse collapse" aria-expanded="false"
                                                             style="height: 0px;">
                                                            <div class="box-body">
                                                                <pre>{{ json_encode($equipment, JSON_PRETTY_PRINT) }}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h1>
        Models
    </h1>
    <div class="row">
        <div class="col-md-12">
            <div class="panel box box-primary">
                <div class="box-header with-border">
                    <h4 class="box-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#deal-debug"
                           aria-expanded="false" class="collapsed">
                            Deal Model
                        </a>
                    </h4>
                </div>
                <div id="deal-debug" class="panel-collapse collapse" aria-expanded="false"
                     style="height: 0px;">
                    <div class="box-body">
                        <pre>{{ json_encode($deal->toArray(), JSON_PRETTY_PRINT) }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection