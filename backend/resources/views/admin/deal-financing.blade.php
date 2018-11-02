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
            <li role="presentation" class="active">
                <a href="/admin/deal/{{$deal->id}}/financing">Financing</a>
            </li>
            <li role="presentation">
                <a target="_blank" href="/deals/{{$deal->id}}">View In App</a>
            </li>
        </ul>
    @endcomponent

    @foreach($quotes as $type => $roles)
        @component('components.box')
            @slot('title')
                {{$type}}
            @endslot
            @foreach($roles as $role => $data)
                @component('components.box')
                    @slot('title')
                        {{$role}}
                    @endslot
                    @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-rates"])
                        @slot('title')
                            Rates & Rebates
                        @endslot
                            <table class="table table-condensed">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Scenario Type</th>
                                        <th>Id</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                @foreach($data['rates']->rebates['everyone']['programs'] as $program)
                                    <tr>
                                        <td>{{$program->program->ProgramName}}</td>
                                        <td>{{$program->scenario->DealScenarioType}}</td>
                                        <td>{{$program->program->ProgramID}}</td>
                                        <td>${{$program->value}}</td>
                                    </tr>
                                @endforeach
                                    <tr class="well">
                                        <td><b>Total</b></td>
                                        <td></td>
                                        <td></td>
                                        <td>${{$data['rates']->rebates['everyone']['total']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    @endcomponent
                    @if($type == 'lease')
                    @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-quote"])
                        @slot('title')
                            Quote (Excluding Lease Payments)
                        @endslot
                        <table class="table table-condensed">
                            <thead>
                                <tr>
                                    <th>Term Length</th>
                                    <th>Rate/Money Factor</th>
                                    <th>Residuals</th>
                                </tr>
                            </thead>
                            <tbody>
                            @foreach($data['quote']['rates'] as $rate)
                                <tr>
                                    <td>{{isset($rate['termLength']) ? $rate['termLength'] : '--'}}</td>
                                    <td>{{isset($rate['rate']) ? $rate['rate'] . '%' : (isset($rate['moneyFactor']) ? $rate['moneyFactor'] : '--')}}</td>
                                    @foreach($rate['residuals'] as $residual)
                                        <td>{{isset($residual['annualMileage']) ? $residual['annualMileage'] . ' miles' : '--'}}</td>
                                        <td>{{isset($residual['residualPercent']) ? $residual['residualPercent'] . '%' : '--'}}</td>
                                    @endforeach
                                </tr>
                            @endforeach

                            </tbody>
                        </table>
                    @endcomponent
                    @endif
                    @if (isset($data['payments']))
                        @component('components.box', ['collapsible' => true, 'key' => "{$type}-{$role}-payments"])
                            @slot('title')
                                Lease Payments
                            @endslot
                            <table class="table table-condensed">
                                <thead>
                                <tr>
                                    <th>Term</th>
                                    <th>Cash Due</th>
                                    <th>Annual Mileage</th>
                                    <th>Monthly Payment</th>
                                    <th>Total Amt. @ Drive Off</th>
                                    <th>Use Tax</th>
                                    <th>Pre Tax Amt.</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($data['payments'] as $payment)
                                    <tr>
                                        <td>{{$payment['term']}}</td>
                                        <td>{{isset($payment['cash_due']) ? $payment['cash_due'] : '--'}}</td>
                                        <td>{{isset($payment['annual_mileage']) ? $payment['annual_mileage'] : '--'}}</td>
                                        <td>{{isset($payment['monthly_payment']) ? '$' . $payment['monthly_payment'] : '--'}}</td>
                                        <td>{{isset($payment['total_amount_at_drive_off']) ? '$' . $payment['total_amount_at_drive_off'] : '--'}}</td>
                                        <td>{{isset($payment['monthly_use_tax']) ? '$' . $payment['monthly_use_tax'] : '--'}}</td>
                                        <td>{{isset($payment['monthly_pre_tax_payment']) ? '$' . $payment['monthly_pre_tax_payment'] : '--'}}</td>
                                        <td></td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        @endcomponent
                    @endif
                @endcomponent
            @endforeach
        @endcomponent
    @endforeach
@endsection