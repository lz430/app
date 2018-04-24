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
        <div class="step {{ $current == $i + 1 ? 'step--active' : '' }} {{ $current == $i || $current == $i + 1 || $current == $i + 2 ? 'step--show-mobile' : '' }}">
            <div class="step__icon">{!! $current > ($i + 1) ? $check : $i + 1 !!}</div>
            <div class="step__label">{{ $step }}</div>
        </div>
    @endforeach
    <script>
        if (window.innerWidth < 576) {
            const steps = document.getElementsByClassName('step');
            Array.from(steps).forEach(element => {
                if (!element.className.includes('step--show-mobile')) {
                    element.remove();
                }
            })
        }
    </script>
</div>
