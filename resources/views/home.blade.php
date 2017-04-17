@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-lg-12">
            @foreach ($savedVehicles as $savedVehicle)
                <div class="saved-vehicle">
                    <div class="saved-vehicle__title">{{ $savedVehicle->version->description }}</div>

                    <form style="display: inline;" onclick="this.submit()" method="POST" action="{{ route('savedVehicle.destroy', [$savedVehicle->id])  }}">
                        {{ csrf_field() }}
                        {{ method_field('DELETE') }}
                        <span class="pull-right" style="cursor: pointer">Remove</span>
                    </form>

                    <details>
                    <pre>
                        {{ json_encode($savedVehicle->version, JSON_PRETTY_PRINT) }}
                    </pre>
                        <pre>
                        {!! json_encode($savedVehicle->options, JSON_PRETTY_PRINT) !!}
                    </pre>
                    </details>
                </div>
            @endforeach
        </div>
    </div>
</div>
@endsection
