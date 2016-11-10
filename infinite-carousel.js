;
(function($, window, document, undefined) {
    'use strict'

    let pluginName = 'infinitecarousel',
        defaults = {
            slide: 'li',
            delay: 3000,
            ease: 'swing',
            speed: 500,
            yourMum: 'epic'
        }

    function Plugin(element, options) {
        this.element = element

        this.options = $.extend({}, defaults, options)

        this._defaults = defaults
        this._name = pluginName

        this.init()
    }

    Plugin.prototype.init = function() {
        let caro = this.options
        let wrapper = this.element
        let $slide = $(wrapper).find(caro.slide)
        
        let slideML = window.getComputedStyle($slide[0], null)['margin-left']
        let slideMR = window.getComputedStyle($slide[0], null)['margin-right']
            //let margins = (~~(slideML.replace('px', '')) + ~~(slideMR.replace('px', '')))
        let margins = (parseInt(slideML) + parseInt(slideMR))
        // log for debug
        //console.log(margins)
        $(wrapper).wrap("<div style='overflow: hidden;' />")
        $(wrapper).css({
            'width': (($slide[0].clientWidth + margins) * $slide.length)
        })
        let carouselInfinite = setInterval(function() {
            let distance = ($slide[0].clientWidth + margins)

            $(wrapper).animate({
                marginLeft: "-=" + distance
            }, caro.speed, caro.ease, function() {
                let firstSlide = $(wrapper).find(caro.slide).first()
                let lastSlide = $(wrapper).find(caro.slide).last()
                $(firstSlide).insertAfter(lastSlide)
                $(wrapper).css('margin-left', 0)
            })

        }, caro.delay)
    }


    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options))
            }
        })
    }


}(jQuery, window, document))
