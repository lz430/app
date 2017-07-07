<a href="{{ route('filter', ['style' => $style['style']]) }}" class="welcome-style-selector__style">
    {!! file_get_contents(resource_path("assets/svg/body-styles/{$style['icon']}.svg")) !!}

    <div class="welcome-style-selector__name">{{ $style['style'] }}</div>
</a>