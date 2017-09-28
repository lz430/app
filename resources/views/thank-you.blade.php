@extends('layouts.app')

@push('scripts')
    @if (App::environment(['staging', 'production']))
        <script>
            fbq('track', 'Purchase', {
                value: {{ $purchase->dmr_price || 0 }},
                currency: 'USD'
            });
        </script>
    @endif
@endpush

@section('content')
    <ThankYouPage></ThankYouPage>

    @section('footer')
    @endsection
@endsection
