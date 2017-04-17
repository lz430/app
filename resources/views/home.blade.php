@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Garage</div>

                <div class="panel-body">
                    @foreach ($savedVehicles as $savedVehicle)
                        <strong>{{ $savedVehicle->version->description }}</strong>

                        <form style="display: inline;" action="/garage/{{ $savedVehicle->id }}">
                            {{ method_field('DELETE') }}
                            <button class="btn btn-danger" type="submit">Remove</button>
                        </form>

                        <details>
                            <pre>
                                {{ json_encode($savedVehicle->version, JSON_PRETTY_PRINT) }}
                            </pre>
                            <pre>
                                {!! json_encode($savedVehicle->options, JSON_PRETTY_PRINT) !!}
                            </pre>
                        </details>

                        <hr>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
