<div class="steps">
    @php
    $steps = [
        'Select',
        'Results',
        'Details',
        'Compare',
        'Confirm',
        'Purchase'
    ]
    @endphp
    @php
    $check = file_get_contents(resource_path("assets/svg/zondicons/checkmark.svg"))
    @endphp
    @foreach ($steps as $i => $step)
        <div class="step {{ $current == $i + 1 ? 'step--active' : '' }}">
            <div class="step__icon">{!! $current > ($i + 1) ? $check : $i + 1 !!}</div>
            <div class="step__label">{{ $step }}</div>
        </div>
    @endforeach
</div>
