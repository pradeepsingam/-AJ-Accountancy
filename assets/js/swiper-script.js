document.addEventListener("DOMContentLoaded", function () {
    var swiperPartner = new Swiper(".swiper-partner", {
        slidesPerView: 3, // default (desktop & tablet)
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        observer: true,
        observeParents: true,
        speed: 1000,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            0: {
                // mobile (max-width 767px)
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                // tablet & desktop
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
});
