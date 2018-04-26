<nav class="nav">
    @php
    $menuIcon = file_get_contents(resource_path("assets/svg/zondicons/menu.svg"));
    $closeIcon = file_get_contents(resource_path("assets/svg/zondicons/close.svg"));
    @endphp

    <div class="nav__constrained">
        <a class="nav__logo" href="{{ url('/') }}">
            <img src="/images/dmr-logo.svg">
        </a>

        <div class="nav__links">
            <a href="{{ marketing_url('about/') }}">About</a>
            <a href="{{ marketing_url('contact/') }}">Contact</a>
            <a href="{{ marketing_url('blog/') }}">Blog</a>
            <a href="/#findNewCar">Find New Vehicle</a>
        </div>

        <button class="nav__icon">
            <div class="nav__icon-menu">
                {!! $menuIcon !!}
            </div>
            <div class="nav__icon-close hidden">
                {!! $closeIcon !!}
            </div>
        </button>
    </div>

    <div class="nav__links-mobile">
        <a href="{{ marketing_url('about/') }}">About</a>
        <a href="{{ marketing_url('contact/') }}">Contact</a>
        <a href="{{ marketing_url('blog/') }}">Blog</a>
        <a href="/#findNewCar">Find New Vehicle</a>
    </div>

    <script>
        /*
            Add JS to animate show/hiding of menu bar
            IIFE is to prevent global scope creep
        */
        (function initializeMobileNavBar() {
            /* Don't show mobile menu by default */
            document.querySelector('.nav__links-mobile').style.height = '0px';

            function collapseSection(element) {
                var sectionHeight = element.scrollHeight;
                var elementTransition = element.style.transition;
                element.style.transition = '';
                requestAnimationFrame(function() {
                    element.style.height = sectionHeight + 'px';
                    element.style.transition = elementTransition;
                    requestAnimationFrame(function() {
                    element.style.height = 0 + 'px';
                    });
                });
                element.setAttribute('data-collapsed', 'true');
            }

            function expandSection(element) {
                var sectionHeight = element.scrollHeight;
                element.style.height = sectionHeight + 'px';
                element.addEventListener('transitionend', function(e) {
                    element.removeEventListener('transitionend', arguments.callee);
                    element.style.height = null;
                });
                element.setAttribute('data-collapsed', 'false');
            }

            document.querySelector('.nav__icon').addEventListener('click', function(e) {
                var section = document.querySelector('.nav__links-mobile');
                var menu = document.querySelector('.nav__icon-menu');
                var close = document.querySelector('.nav__icon-close');
                var isCollapsed = section.getAttribute('data-collapsed') === 'true' || section.getAttribute('data-collapsed') === null;
                if (isCollapsed) {
                    expandSection(section);
                    menu.classList.add('hidden');
                    close.classList.remove('hidden');
                    section.setAttribute('data-collapsed', 'false');
                } else {
                    menu.classList.remove('hidden');
                    close.classList.add('hidden');
                    collapseSection(section);
                }
            });
        })();
    </script>
</nav>
