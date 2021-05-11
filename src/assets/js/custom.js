(function ($) {
    "use strict";

    /*-----------------------------------------------------------------------------------*/
    /* Advance Search Select-ables
     /*-----------------------------------------------------------------------------------*/
    if (jQuery().selectric) {
        $( ".advance-selectable" ).selectric();
    }


   

    /*-----------------------------------------------------------------------------------*/
    /* Mean Menu
    /*-----------------------------------------------------------------------------------*/
    function menuDrop(target){
        var mainMenuItem = $(target);
        mainMenuItem.on( 'mouseenter',
            function () {
                $(this).children('ul').slideDown(200);
            });

        mainMenuItem.on( 'mouseleave',
            function () {
                $(this).children('ul').stop(true).slideUp(200);
            }
        );
    }

    menuDrop(".top-nav ul li");
    menuDrop(".nav-collapse ul li");


    if($(".header").hasClass("header-var1")){
        var navList = $(".main-menu.left").html();
        navList += $(".main-menu.right").html();


        $('.responsive-menu').html("<ul>" + navList + "</ul>");
    }

    if (jQuery().meanmenu) {
        $('.responsive-menu').meanmenu({
            meanScreenWidth: "991"
        });
    }



    /*-----------------------------------------------------------------------------------*/
    /* add ingredients
    /*-----------------------------------------------------------------------------------*/
    if (jQuery().meanmenu) {
        var list_sortable = $(".list-sortable");
        list_sortable.parents("body").addClass("visible-overflow");
        //  sortable
        list_sortable.sortable({
            forcePlaceholderSize: true,
            placeholder: "detail-placeholder",
            handle: ".handler-list"
        });
    }


    $('.add-button.add-ing').on("click",function(event){

        var newMajesticItem= '<li style="display: none">' +
            '<div class="add-fields">' +
            ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
            ' <input type="text" name="ingredients[]" id="ingredients"/>' +
            ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
            '</div>'+
            '</li>';
        $( '.list-sortable.ingredients-list').append( newMajesticItem );
        $( '.list-sortable.ingredients-list').children("li").slideDown();
        bindMajesticItem();

        event.preventDefault();
    });

$('.add-button.add-nutrient').on("click",function(event){

        var newMajesticItem= '<li style="">'+
                                '<div class="add-fields">'+
                                    '<span class="handler-list ui-sortable-handle"><i class="fa fa-arrows"></i></span>             '+                      
                                    '<div style="width:40%" class="selectric-wrapper selectric-advance-selectable"><div class="selectric-select"><select name="cuisine" id="cuisine" class="advance-selectable" tabindex="0">'+
                                       ' <option value="" selected="selected">Select Nutrient</option>'+
                                        '<option *ngFor="let nutrient of nutrientsList; let n = index" value="{{nutrient}}">{{nutrient}}</option>'+
                  
                                    '</select></div></div>'+

                                    '<input type="text" name="nutrients[]" id="nutrients">'+
                                   ' <span class="del-list"><i class="fa fa-trash"></i></span>'+
                                '</div>'+
                           ' </li>';
        $( '.list-sortable.nutrients-list').append( newMajesticItem );
        $( '.list-sortable.nutrients-list').children("li").slideDown();
        bindMajesticItem();

        event.preventDefault();
    });

    $('.add-button.add-steps').on("click",function(event){
        event.preventDefault();
        var newMajesticItem = '<li style="display: none">' +
            '<div class="add-fields">' +
            ' <span class="handler-list"><i class="fa fa-arrows"></i></span>' +
            '<textarea class="short-text" name="steps" id="steps" cols="30" rows="10">    </textarea>' +
            ' <span class="del-list"><i class="fa fa-trash"></i></span>' +
            '</div>'+
            '</li>';


        $( '.list-sortable.steps').append( newMajesticItem);
        $('.list-sortable.steps').children("li").slideDown();
        bindMajesticItem();
    });

    function bindMajesticItem(){

        /* Bind click event to remove detail icon button */

        $('.del-list').on("click",function(event){
            event.preventDefault();
            var $this = $( this );
            $this.closest( 'li' ).slideUp(function() { $(this).remove(); });
        });
    }





    /*-----------------------------------------------------------------------------------*/
    /* Listing list end grid buttons
    /*-----------------------------------------------------------------------------------*/

/*    $('.listing-buttons span').on("click",function(){
        $('.listing-buttons span').removeClass("current");
        if( $(this).hasClass("grid")){
            $(this).addClass("current");
            if($(".recipe-listing").hasClass("listing-list")){
                $(".recipe-listing").removeClass("listing-list").addClass("listing-grid");
            }

        }
        if( $(this).hasClass("list")){
            $(this).addClass("current");
            $(".recipe-listing").removeClass("listing-grid").addClass("listing-list");

        }
    });*/


    /*-----------------------------------------------------------------------------------*/
    /* Tabs
    /*-----------------------------------------------------------------------------------*/
    var $tabsNav = $('.tabs-nav'),
        $tabsNavLis = $tabsNav.children('li');

    $tabsNav.each(function () {
        var $this = $(this);
        $this.next().children('.tab-content').stop(true, true).hide()
            .first().show();
        $this.children('li').first().addClass('active').stop(true, true).show();
    });

    $tabsNavLis.on('click', function (e) {
        var $this = $(this);
        $this.siblings().removeClass('active').end()
            .addClass('active');
        var idx = $this.parent().children().index($this);
        $this.parent().next().children('.tab-content').stop(true, true).hide().eq(idx).fadeIn();
        e.preventDefault();
    });


    /*-----------------------------------------------------------------------------------*/
    /*	Accordion
    /*-----------------------------------------------------------------------------------*/
    $('dl.accordion dt').on("click",function(){
        $(this).siblings('dt').removeClass('current');
        $(this).addClass('current').next('dd').stop(true, true).slideDown(500).siblings('dd').stop(true, true).slideUp(500);
    });


    /*-----------------------------------------------------------------------------------*/
    /*	Animation CSS integrated with wow.js Plugin
     /*----------------------------------------------------------------------------------*/

    new WOW().init({ });

    $(function (){
        if (!$(".footer").hasClass("animate-footer")) {
            $(".footer").find(".wow").addClass("disable-wow");
        }
    });

    /*-----------------------------------------------------------------------------------*/
    /* swipebox
    /*-----------------------------------------------------------------------------------*/
    if (jQuery().swipebox) {
        $('.swipebox').swipebox();
    }



    /*-----------------------------------------------------------------------------------*/
    /* Alert close
     /*-----------------------------------------------------------------------------------*/
    $(".close-alert").on("click",function(){
        $(this).parent(".alert").slideUp();
    });

    /*----------------------------------------------------------------------------------*/
    /* Contact Form AJAX validation and submission
    /*---------------------------------------------------------------------------------- */
    if (jQuery().validate && jQuery().ajaxSubmit) {
        // Contact Form Handling
        var contact_options = {
            target: '#message-sent',
            beforeSubmit: function () {
                $('#contact-loader').fadeIn('fast');
                $('#message-sent').fadeOut('fast');
            },
            success: function () {
                $('#contact-loader').fadeOut('fast');
                $('#message-sent').fadeIn('fast');
                $('#contact-form').resetForm();
            }
        };

    /*    $('#contact-form').validate({
            errorLabelContainer: $("div.error-container"),
            submitHandler: function (form) {
                   $(form).ajaxSubmit(contact_options);
            }
        });*/
    }


    $(window).load(function () {
        /*-----------------------------------------------------------------------------------*/
        /* page loader
         /*-----------------------------------------------------------------------------------*/
        $(".loadr").fadeOut();
        jQuery(".preloader").delay(200).fadeOut("slow").delay(200, function(){
            jQuery(this).remove();
        });

        /*-----------------------------------------------------------------------------------*/
        /* animation on page load
         /*-----------------------------------------------------------------------------------*/

        $('.fade-load-left').queue(function(){
            $(this).addClass("fadeInLeft");
        });

        $('.fade-load-right').queue(function(){
            $(this).addClass("fadeInRight");
        });
        $('.fade-load-up').queue(function(){
            $(this).addClass("fadeInUp");
        });
        $('.fade-load-down').queue(function(){
            $(this).addClass("fadeInDown");
        });
    });

})(jQuery);


