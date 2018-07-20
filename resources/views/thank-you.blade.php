@extends('layouts.app')

@section('title', 'Congratulations!')

@push('scripts')
    @if (App::environment(['staging', 'production']))
        <script>
            fbq('track', 'Purchase', {
                value: {{ json_decode($purchase)->data->attributes->dmr_price || 0 }},
                currency: 'USD'
            });
        </script>
    @endif
@endpush

@section('precontent')
    <div class="steps-bar">
        <div class="inner">
            <div class="steps-bar__page-title">
                <a href="javascript:window.history.back();">&lt; Back</a>
            </div>
            @include('partials.steps', ['current' => 6])
        </div>
    </div>
@endsection

@section('content')
    <div class="content--grey">
        <ThankYouPage purchase="{{$purchase}}"  deal="{{$deal}}" features="{{$features}}"></ThankYouPage>
    </div>
    @section('footer')
    @endsection
@endsection
