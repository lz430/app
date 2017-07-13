@extends('layouts.app')

@section('content')
    <div class="section section--stretch section--darker">
        <div class="view-apply">
            <form class="view-apply__form" role="form" method="POST" action="{{ route('apply') }}">
                {{ csrf_field() }}
                <input type="hidden" name="purchase_id" value="{{ $purchase->id }}">

                <div class="view-apply__title">
                    Apply for financing
                </div>

                <div class="view-apply__sexy-line"></div>

                <div class="view-apply__group {{ $errors->has('name') ? 'view-apply__group-has-error' : '' }}">
                    <label for="name" class="view-apply__label">Name</label>

                    <div class="view-apply__input-and-error">
                        <input id="name" type="text" class="view-apply__input" name="name" value="{{ old('name') }}" required autofocus>

                        @if ($errors->has('name'))
                            <span class="view-apply__error">
                                <strong>{{ $errors->first('name') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="view-apply__group {{ $errors->has('email') ? 'view-apply__group-has-error' : '' }}">
                    <label for="email" class="view-apply__label">Email</label>

                    <div class="view-apply__input-and-error">
                        <input id="email" type="email" class="view-apply__input" name="email" value="{{ old('email') }}" required autofocus>

                        @if ($errors->has('email'))
                            <span class="view-apply__error">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="view-apply__buttons">
                    <button type="submit" class="view-apply__button view-apply__button--blue view-apply__button--small">
                        Apply
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
