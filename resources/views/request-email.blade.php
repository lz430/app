@extends('layouts.app')

@section('content')
    <div class="content--gray">
        @section('nav')
        @endsection

        <div class="section section--no-header-or-footer section--darker">
            <div class="request-email">
                <div class="request-email__logo">
                    <a href="/">
                        <img src="/images/dmr-logo.svg"/>
                    </a>
                </div>
                <form class="request-email__form" method="POST" action="{{ route('receive-email') }}">
                    {{ csrf_field() }}

                    <div class="request-email__title">
                        Please Provide Your Contact Information
                    </div>

                    <div class="request-email__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                        <label for="email"class="request-email__label">Email</label>

                        <div class="request-email__input-and-error">
                            <input id="email" type="email" placeholder="Enter Your Email" class="request-email__input" name="email" value="{{ old('email', $email) }}" required autofocus>

                            @if ($errors->has('email'))
                                <span class="request-email__error">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="request-email__group {{ $errors->has('first_name') ? 'login__group-has-error' : '' }}">
                        <label for="first_name" class="request-email__label">First Name</label>

                        <div class="request-email__input-and-error">
                            <input id="first_name" type="text" class="request-email__input" placeholder="Enter Your First Name" name="first_name" value="{{ old('first_name') }}" required>

                            @if ($errors->has('first_name'))
                                <span class="request-email__error">
                                    <strong>{{ $errors->first('first_name') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="request-email__group {{ $errors->has('email') ? 'login__group-has-error' : '' }}">
                        <label for="last_name" class="request-email__label">Last Name</label>

                        <div class="request-email__input-and-error">
                            <input id="last_name" type="text" class="request-email__input" name="last_name" placeholder="Enter Your Last Name"  value="{{ old('last_name') }}" required>

                            @if ($errors->has('last_name'))
                                <span class="request-email__error">
                                    <strong>{{ $errors->first('last_name') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="request-email__group {{ $errors->has('phone_number') ? 'login__group-has-error' : '' }}">
                        <label for="phone_number" class="request-email__label">Phone Number</label>

                        <div class="request-email__input-and-error">
                            <input id="phone_number" type="tel" class="request-email__input" name="phone_number" placeholder="Enter Your Phone Number" value="{{ old('phone_number') }}" required>

                            @if ($errors->has('phone_number'))
                                <span class="request-email__error">
                                    <strong>{{ $errors->first('phone_number') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="request-email__captcha">
                        {!! Recaptcha::render() !!}
                    </div>

                    <div class="request-email__buttons">
                        <button class="request-email__button request-email__button--purple request-email__button--small">
                            Submit Your Contact Information
                        </button>
                    </div>

                    <div class = "request-email__footer">
                        <a href="/privacy-policy"> Privacy Policy</a> We will not share your information
                    </div>
                </form>
            </div>
        </div>

        @section('footer')
        @endsection
</div>
@endsection
