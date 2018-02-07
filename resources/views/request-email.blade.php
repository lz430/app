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

                    <div class="request-dl__group {{ $errors->has('drivers_license') ? 'login__group-has-error' : '' }}">
                        <div class="request-dl__labels">
                            <label for="drivers_license" class="request-dl__number-label">Driver's License Number</label>
                            <label for="drivers_license_state" class="request-dl__state-label">State</label>
                        </div>

                        <div class="request-dl__inline-input-and-error">
                            <input id="drivers_license" type="tel" class="request-dl__number" name="drivers_license_number" placeholder="Enter Driver's License Number" value="{{ old('drivers_license') }}" required>

                            <select class="request-dl__state" id="drivers_license_state" name="drivers_license_state">
                                <option value="AL">AL</option>
                                <option value="AK">AK</option>
                                <option value="AS">AS</option>
                                <option value="AZ">AZ</option>
                                <option value="AR">AR</option>
                                <option value="CA">CA</option>
                                <option value="CO">CO</option>
                                <option value="CT">CT</option>
                                <option value="DE">DE</option>
                                <option value="DC">DC</option>
                                <option value="FM">FM</option>
                                <option value="FL">FL</option>
                                <option value="GA">GA</option>
                                <option value="GU">GU</option>
                                <option value="HI">HI</option>
                                <option value="ID">ID</option>
                                <option value="IL">IL</option>
                                <option value="IN">IN</option>
                                <option value="IA">IA</option>
                                <option value="KS">KS</option>
                                <option value="KY">KY</option>
                                <option value="LA">LA</option>
                                <option value="ME">ME</option>
                                <option value="MH">MH</option>
                                <option value="MD">MD</option>
                                <option value="MA">MA</option>
                                <option value="MI">MI</option>
                                <option value="MN">MN</option>
                                <option value="MS">MS</option>
                                <option value="MO">MO</option>
                                <option value="MT">MT</option>
                                <option value="NE">NE</option>
                                <option value="NV">NV</option>
                                <option value="NH">NH</option>
                                <option value="NJ">NJ</option>
                                <option value="NM">NM</option>
                                <option value="NY">NY</option>
                                <option value="NC">NC</option>
                                <option value="ND">ND</option>
                                <option value="MP">MP</option>
                                <option value="OH">OH</option>
                                <option value="OK">OK</option>
                                <option value="OR">OR</option>
                                <option value="PW">PW</option>
                                <option value="PA">PA</option>
                                <option value="PR">PR</option>
                                <option value="RI">RI</option>
                                <option value="SC">SC</option>
                                <option value="SD">SD</option>
                                <option value="TN">TN</option>
                                <option value="TX">TX</option>
                                <option value="UT">UT</option>
                                <option value="VT">VT</option>
                                <option value="VI">VI</option>
                                <option value="VA">VA</option>
                                <option value="WA">WA</option>
                                <option value="WV">WV</option>
                                <option value="WI">WI</option>
                                <option value="WY">WY</option>
                            </select>

                            @if ($errors->has('drivers_license_number'))
                                <span class="request-email__error">
                                    <strong>{{ $errors->first('drivers_license_number') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="request-email__captcha">
                        {!! Recaptcha::render() !!}

                        @if ($errors->has('recaptcha'))
                            <span class="request-email__error">
                                <strong>{{ $errors->first('recaptcha') }}</strong>
                            </span>
                        @endif
                    </div>

                    <input type="hidden" name="method" value="{{ request('payment') }}" />
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
