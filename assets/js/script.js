$(document).ready(function(){
    initNavLink();
    initAnimationScroll();
    initCounter();
    initSidebar();
    initSidebarDropdown();
    initFlatpickrCalendar();
    initCustomDropdown();
});

function initNavLink() {
    const currentUrl = window.location.href;
    $(".navbar-nav .nav-link").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
        }
    });
    $(".navbar-nav .dropdown-menu .dropdown-item").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
            $(this).closest(".dropdown").find(".nav-link.dropdown-toggle").addClass("active");
        }
    });
}

function initAnimationScroll() {
    const elements = document.querySelectorAll('[data-animation]');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const animation = el.dataset.animation;

            const styles = getComputedStyle(el);

            const duration = el.dataset.duration 
                || styles.getPropertyValue('--anim-duration').trim() 
                || '1s';

            const delay = el.dataset.delay 
                || styles.getPropertyValue('--anim-delay').trim() 
                || '0s';

            el.style.animationName = animation;
            el.style.animationDuration = duration;
            el.style.animationDelay = delay;
            el.style.animationPlayState = 'running';
            el.classList.add('animated');

            observer.unobserve(el);
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function initCounter() {
    var $counters = $(".counter");

    function formatCount(num, format) {

        if (format === "compact") {
            if (num >= 1_000_000) {
                return (num / 1_000_000)
                    .toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
            }
            if (num >= 1_000) {
                return (num / 1_000)
                    .toFixed(num % 1_000 === 0 ? 0 : 1) + "K";
            }
            return num;
        }

        // default: full format
        return Number(num).toLocaleString();
    }

    function updateCount($counter) {
        var target = parseInt($counter.data("target"), 10);
        var current = $counter.data("current") || 0;
        var format = $counter.data("format") || "full";

        var duration = 1500;
        var steps = 30;
        var increment = Math.max(1, Math.ceil(target / steps));

        var nextCount = Math.min(target, current + increment);
        $counter.data("current", nextCount);

        $counter.text(formatCount(nextCount, format));

        if (nextCount < target) {
            setTimeout(function () {
                updateCount($counter);
            }, duration / steps);
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !$(entry.target).data("counted")) {
                var $counter = $(entry.target);
                $counter.data("counted", true);
                updateCount($counter);
            }
        });
    }, { threshold: 0.5 });

    $counters.each(function () {
        var $counter = $(this);

        $counter.data("counted", false);
        $counter.data("current", 0);

        observer.observe(this);
    });
}

function initSidebar() {
    $(document).on("click", ".nav-btn", function() {
        $(".sidebar-overlay").addClass("active");
        setTimeout(() => $(".sidebar").addClass("active"), 200);
    });

    $(document).on("click", ".sidebar-close-btn, .sidebar-overlay", function() {
        $(".sidebar").removeClass("active");
        setTimeout(() => $(".sidebar-overlay").removeClass("active"), 200);
    });
}

function initSidebarDropdown() {
    $(document).on("click", ".sidebar-dropdown-btn", function() {
        const $dropdownMenu = $(this).parent().next(".sidebar-dropdown-menu");
        const isOpen = $dropdownMenu.hasClass("active");

        $(".sidebar-dropdown-menu").not($dropdownMenu).removeClass("active");

        $dropdownMenu.toggleClass("active", !isOpen);
    });
}

function initFlatpickrCalendar() {
    var $date = $("#consultation-date");

    $date.flatpickr({
        dateFormat: "d M Y"
    });
}

function initCustomDropdown() {

    $(document).on('click', '.dropdown-select', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $container = $(this).closest('.dropdown-container');
        const $caretIcon = $(this).find('.fa-caret-down');

        $('.dropdown-container').not($container).removeClass('active');
        $('.fa-caret-down').not($caretIcon).removeClass('rotate');

        $container.toggleClass('active');
        $caretIcon.toggleClass('rotate');
    });

    $(document).on('click', '.dropdown-option', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $option = $(this);
        const $container = $option.closest('.dropdown-container');
        const $selectedText = $container.find('.selected-text');
        const $hiddenInput = $container.find('.dropdown-value');
        const $allOptions = $container.find('.dropdown-option');

        const selectedValue = $option.data('value');
        const selectedText = $option.text().trim();

        $selectedText.text(selectedText).addClass('has-value');
        $hiddenInput.val(selectedValue).trigger('change');

        $allOptions.removeClass('selected');
        $option.addClass('selected');

        $container.removeClass('active');
        $container.find('.fa-caret-down').removeClass('rotate');

        console.log('Selected:', selectedValue, selectedText);
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-container').removeClass('active');
            $('.fa-caret-down').removeClass('rotate');
        }
    });

    $(document).on('keydown', '.dropdown-select', function (e) {
        const $container = $(this).closest('.dropdown-container');

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                $(this).trigger('click');
                break;

            case 'Escape':
                $container.removeClass('active');
                $container.find('.fa-caret-down').removeClass('rotate');
                break;

            case 'ArrowDown':
            case 'ArrowUp':
                e.preventDefault();

                if (!$container.hasClass('active')) {
                    $container.addClass('active');
                    $container.find('.fa-caret-down').addClass('rotate');
                }

                const $options = $container.find('.dropdown-option');
                const $focused = $options.filter(':focus');
                let nextIndex;

                if ($focused.length === 0) {
                    nextIndex = e.key === 'ArrowDown' ? 0 : $options.length - 1;
                } else {
                    const currentIndex = $options.index($focused);

                    if (e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % $options.length;
                    } else {
                        nextIndex = (currentIndex - 1 + $options.length) % $options.length;
                    }
                }

                $options.eq(nextIndex).focus();
                break;
        }
    });

    $(document).on('keydown', '.dropdown-option', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    $(document).on('mouseenter', '.dropdown-option', function () {
        if (!$(this).attr('tabindex')) {
            $(this).attr('tabindex', '0');
        }
    });

    window.resetDropdown = function (containerId) {
        const $container = $('#' + containerId);

        if ($container.length) {
            $container.find('.selected-text')
                .text('Project Type')
                .removeClass('has-value');

            $container.find('.dropdown-value').val('');
            $container.find('.dropdown-option').removeClass('selected');
            $container.removeClass('active');
            $container.find('.fa-caret-down').removeClass('rotate');
        }
    };

    window.getDropdownValue = function (containerId) {
        return $('#' + containerId).find('.dropdown-value').val();
    };

    window.setDropdownValue = function (containerId, value) {
        const $container = $('#' + containerId);
        const $option = $container.find('.dropdown-option[data-value="' + value + '"]');

        if ($option.length) {
            $option.trigger('click');
        }
    };
}
