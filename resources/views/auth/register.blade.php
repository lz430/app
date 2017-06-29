@extends('layouts.app')

@section('content')
    @section('nav')
    @endsection

    <div class="section section--no-header-or-footer section--darker">
        <div class="register">
            <div class="register__logo">
                <img src="/images/dmr-logo.svg"/>
            </div>
            <form class="register__form" role="form" method="POST" action="{{ route('register') }}">
                {{ csrf_field() }}

                <div class="register__title">
                    Register
                </div>

                <div class="register__sexy-line"></div>

                <div class="register__group {{ $errors->has('name') ? 'login__group-has-error' : '' }}">
                    <label for="email" class="register__label">Name</label>

                    <div class="register__input-and-error">
                        <input id="name" class="register__input" name="name" value="{{ old('name') }}" required autofocus>

                        @if ($errors->has('name'))
                            <span class="register__error">
                                <strong>{{ $errors->first('name') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="register__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                    <label for="email" class="register__label">Email</label>

                    <div class="register__input-and-error">
                        <input id="email" type="email" class="register__input" name="email" value="{{ old('email') }}" required>

                        @if ($errors->has('email'))
                            <span class="register__error">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="register__group {{ $errors->has('phone_number') ? 'login__group-has-error' : '' }}">
                    <label for="phone_number" class="register__label">Phone Number</label>

                    <div class="register__input-and-error">
                        <input id="phone_number" class="register__input" name="phone_number" value="{{ old('phone_number') }}" required>

                        @if ($errors->has('phone_number'))
                            <span class="register__error">
                                <strong>{{ $errors->first('phone_number') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="register__group {{ $errors->has('password') ? ' login__group-has-error' : '' }}">
                    <label for="password" class="register__label">Password</label>

                    <div class="register__input-and-error">
                        <input id="password" type="password" class="register__input" name="password" required>

                        @if ($errors->has('password'))
                            <span class="register__error">
                                <strong>{{ $errors->first('password') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="register__group">
                    <label for="password_confirmation" class="register__label">Confirm Password</label>

                    <div class="register__input-and-error">
                        <input id="password_confirmation" type="password" class="register__input" name="password_confirmation" required>
                    </div>
                </div>

                <div class="register__buttons">
                    <button type="submit" class="register__button register__button--blue register__button--small">
                        Create your account
                    </button>
                </div>
            </form>
        </div>
    </div>

    @section('footer')
    @endsection
@endsection
