@extends('layouts.app')

@section('title', 'Buy or Save')

@section('content')
    <div id="configured" data-version='{!! json_encode($version) !!}' data-options='{!! json_encode($selectedOptions) !!}'></div>

    <div class="step-3">
        <br>

        <form>
            {{ csrf_field() }}

            @foreach ($options as $option)
                @if (in_array($option->id, $selectedOptionIds))
                    <input type="hidden" name="option_ids[]" value="{{ $option->id }}">
                @endif
            @endforeach

            <input type="hidden" name="version_id" value="{{ $version->id }}">

            <div class="form-group">
                <div class="row">
                    <div class="col-lg-6">
                        @if (!auth()->check())
                            <label for="email">Email</label>
                            <input id="email" class="form-control" type="email" name="email" required>
                        @else
                            <input id="email" type="hidden" name="email" value="{{ auth()->user()->email }}" required>
                        @endif

                        <br>

                        {{-- Store savedVehicle using ajax. Then redirect to create page w/ id of savedVehicle in query string --}}
                        <a class="btn btn-primary" onclick="(function saveVehicle() {
                            fetch('{{ route('savedVehicle.store') }}', {
                                    credentials: 'same-origin',
                                    method: 'POST',
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-CSRF-TOKEN': window.Laravel.csrfToken,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email: document.getElementById('email').value,
                                        version_id: {{ $version->id }},
                                    }),
                                })
                                .then(function (response) {
                                    if (response.status >= 200 && response.status < 300) {
                                        return response;
                                    } else {
                                        return response.json().then(function (json) {
                                            var error = new Error(Object.values(json).toString());
                                            error.response = response;
                                            throw error;
                                        });
                                    }
                                })
                                .then(function(response) {
                                    return response.json();
                                }).then(function(savedVehicleId) {
                                    window.location = '{{ route('buyRequest.create') }}?savedVehicleId=' + savedVehicleId;
                                }).catch(function (error) {
                                    alert(error);
                                });
                        })()">Make this my ride</a>

                        {{-- Directly store the savedVehicle --}}
                        <button class="btn btn-primary" type="submit" formmethod="post" formaction="{{ route('savedVehicle.store') }}">Save to garage</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection
