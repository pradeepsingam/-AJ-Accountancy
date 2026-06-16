function initBookingForm() {
    const $form = $('#booking-form');
    const $successMessage = $('.success-message-booking');
    const $errorMessage = $('.error-message-booking');

    $('.dropdown-select').on('click', function () {
        $(this).siblings('.dropdown-list').toggleClass('show');
    });

    $('.dropdown-option').on('click', function () {
        const value = $(this).data('value');
        const text = $(this).text();

        $('#service-type').val(value);
        $('.selected-text').text(text);
        $('.dropdown-list').removeClass('show');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-list').removeClass('show');
        }
    });

    $form.on('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        $form.find('input[type="text"], input[type="email"], input[type="tel"], input[type="hidden"], textarea').each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                return false; // break loop
            }
        });

        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');

        if (isValid) {
            $successMessage.removeClass('hidden');
            $form[0].reset();
            $('.selected-text').text('Select Service Type');
            setTimeout(function () {
                $successMessage.addClass('hidden');
            }, 3000);
        } else {
            $errorMessage.removeClass('hidden');
            setTimeout(function () {
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });
}

function initContactForm() {
    const $form = $('#contact-form');
    const $successMessage = $('.success-message-contact');
    const $errorMessage = $('.error-message-contact');

    $form.on('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        $form.find('input[type="text"], input[type="email"], textarea')
            .each(function () {
                if ($(this).val().trim() === '') {
                    isValid = false;
                    return false;
                }
            });

        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');

        if (isValid) {
            $successMessage.removeClass('hidden');
            $form[0].reset();
            setTimeout(function () {
                $successMessage.addClass('hidden');
            }, 3000);
        } else {
            $errorMessage.removeClass('hidden');
            setTimeout(function () {
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });
}

function initNewsletterForm() {
    const $form = $('#newsletter-form');
    const $successMessage = $('.success-message-newsletter');
    const $errorMessage = $('.error-message-newsletter');

    $form.on('submit', function (e) {
        e.preventDefault();

        const email = $('#newsletter').val().trim();

        // Reset pesan
        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');

        if (email !== '') {
            $successMessage.removeClass('hidden');
            $form[0].reset();
            setTimeout(function () {
                $successMessage.addClass('hidden');
            }, 3000);
        } else {
            $errorMessage.removeClass('hidden');
            setTimeout(function () {
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });
}

$(document).ready(function () {
    initBookingForm();
    initContactForm();
    initNewsletterForm();
});