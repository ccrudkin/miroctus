$(document).ready(() => {
    $('.hamburgerButton').click(() => {
        $('.nav').animate({
            left: '0%'
        });
        $('.graycover').fadeIn();
    });
    $('#navXimg').click(() => {
        $('.nav').animate({ left: '-60%' });
        $('.graycover').fadeOut();
    });
    $('.main').click(() => {
        let nav = document.getElementById('nav');
        let navleft = window.getComputedStyle(nav, null).getPropertyValue('left');
        if (navleft === '0px') { 
            $('.nav').animate({ left: '-60%' });
            $('.graycover').fadeOut();
        }
    });
});