/*!
 * trace v@VERSION - Yet another menu tracer for jQuery
 *
 * Copyright 2012, Alexander (SASh) Alexiev @ Edge Soft Ltd.
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * or GPL Version 2 (http://www.opensource.org/licenses/gpl-2.0.php) licenses.
 *
 * Date: @DATE
 */

/**
 * HTML Structure:
 * .frame
 *	.carousel
 *		#slider_X (the element must be emidiate child of the .carousel - .carousel>#slider_X)
 * a.prev
 * a.slide[href=#slider_X] (a.slide.selected[href=#slider_X])
 * a.next
 * */
(function($){
	
	var methods = {
		init : function( options ) { 
			return this.each(function(){
				var $this = $(this);
				
				if (!$this.data('trace')){
					var default_settings = {
						'animate'				: 0.5,
						'animateEasing'	: 'swing',
						'selected'	: '.selected',
						'tracer': '<li class="tracer"></li>',
						'elements': 'li:not([class~="tracer"])'
					}
					var settings = $.extend( default_settings, options);
					settings.id = 'app-slider-'+parseInt(Math.random()*10000000000000000);
					$this.data('trace', settings);
					$this.css({'position': 'relative'});
					var revert = $this.find(settings.selected);
					var tracer = $(settings.tracer).attr('id', settings.id).css({'position':'absolute', 'left':'0px', 'width': '0px', 'top': '0px', 'padding': '0', 'margin': '0', 'opacity':0});
					if (revert.size()){
						tracer.css({
							'opacity': 1,
							'top':revert.position().top,
							'left':revert.position().left,
							'width': revert.outerWidth(true),
							'height': revert.outerHeight(true)
						})
					}
					$this.append(tracer);
					$this.trigger('traceInit', [$this, tracer])
					
					$this.on('mouseenter.trace', settings.elements, function(){
						$this.trace('highlight', this);
						return false;
					});
					$this.on('mouseleave.trace', settings.elements, function(){
						var revert = $this.find(settings.selected);
						$this.trace('highlight', revert.size()?revert : false);
						return false;
					});
				}
			});
		},
		
		highlight: function(element, skipanimation){
			return this.each(function(){
				var $this = $(this), settings = $this.data('trace');
				var tracer = $this.find('#'+settings.id);
				if (settings.hover){settings.hover.trigger('traceBlur', [$this]);}
				if (element){
					element = $(element);
					if (tracer.width() == 0){
						tracer.css({
							'width':element.outerWidth(true),
							'height':element.outerHeight(true),
							'top':element.position().top,
							'left':element.position().left
						});
					}
					settings.hover = element;
					$this.data('trace', settings);
					element.trigger('traceFocus', [$this, tracer]);
					if (skipanimation){
						tracer.stop().css({
							'opacity':1,
							'top':element.position().top,
							'left':element.position().left,
							'width': element.outerWidth(true),
							'height': element.outerHeight(true)
						})
					}
					else{
						tracer.stop().animate({
							'opacity':1,
							'top':element.position().top,
							'left':element.position().left,
							'width': element.outerWidth(true),
							'height': element.outerHeight(true)
						}, settings.animate*1000, settings.animateEasing)
					}
					$this.trigger('traceHighlight', [element]);
					
				}
				else{
					settings.hover = false;
					$this.data('trace', settings);
					tracer.stop().animate({
						'opacity':0
					}, settings.animate*1000, settings.animateEasing)
					$this.trigger('traceHighlight', []);
				}
			})
		},
		destroy: function(){
			return this.each(function(){
				$(this).off('.trace').removeData('trace');
			})
		}
	};


	$.fn.trace =	function(method){
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.trace' );
		}    
  
	};
	
})(jQuery);
