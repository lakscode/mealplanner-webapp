(function ($) {
    "use strict";

    /*-----------------------------------------------------------------------------------*/
    /* Advance Search Select-ables
     /*-----------------------------------------------------------------------------------*/
    if (jQuery().selectric) {
        $( ".advance-selectable" ).selectric();
    }





    if($(".header").hasClass("header-var1")){
        var navList = $(".main-menu.left").html();
        navList += $(".main-menu.right").html();


        $('.responsive-menu').html("<ul>" + navList + "</ul>");
    }

   

   


/*
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
*/
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

    





})(jQuery);


