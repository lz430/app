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

@section('content')
    <ThankYouPage  id="react-app" purchase="{{$purchase}}"  deal="{{$deal}}" features="{{$features}}"></ThankYouPage>
@endsection
