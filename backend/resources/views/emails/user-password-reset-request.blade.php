@component('mail::message')
Hello {{$user->first_name}},

Please click the link below to reset your password.

@component('mail::button', ['url' => $url])
    Reset My Password
@endcomponent

Thanks,
Deliver My Ride
@endcomponent

