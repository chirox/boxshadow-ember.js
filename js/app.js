window.App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
	model: function () {
		return App.shadowValues;
	}
});

App.ShadowValues = Ember.Object.extend({
	hor: 0,
	vert: 0,
	blur: 0,
	spr: 0,
	isInset: false,
	colModes: ['hex', 'rgba'],
	selectedColMode: 'hex',
	opacityIsVisible: false,
	r:0, g:0, b:0,
	hex:'#000000',
	opacity: 1,

	colorObserver: function () { // Color mode dropdown
		this.toggleProperty('opacityIsVisible');
	}.observes('selectedColMode'),

	output: function () {
		var color = '',
			mode = this.get('selectedColMode');

		if (mode === 'hex') {
			color = this.get('hex');
		} else {
			color = 'rgba('+this.get('r')+','+this.get('g')+','+this.get('b')+','+this.get('opacity')+')';
		}

		return '-webkit-box-shadow: ' +
			this.get('hor')+'px ' +
			this.get('vert')+'px ' +
			this.get('blur')+'px ' +
			this.get('spr')+'px ' +
			color +
			(this.get('isInset')?' inset':'') + ';\n'+
			'box-shadow: ' +
			this.get('hor')+'px ' +
			this.get('vert')+'px ' +
			this.get('blur')+'px ' +
			this.get('spr')+'px ' +
			color +
			(this.get('isInset')?' inset;':';');
	}.property('hor', 'vert', 'blur', 'spr', 'col', 'isInset', 'r', 'g', 'b', 'hex', 'opacity', 'selectedColMode'),

	colorInput: function () {
		var color = '',
			mode = this.get('selectedColMode');

		if (mode === 'hex') {
			color = this.get('hex');
		} else {
			color = 'rgba('+this.get('r')+','+this.get('g')+','+this.get('b')+','+this.get('opacity')+')';
		}
		return color;
	}.property('r', 'g', 'b', 'hex', 'opacity', 'selectedColMode')
});

App.shadowValues = App.ShadowValues.create();

App.ApplicationView = Ember.View.extend({
	didInsertElement: function () {
		var colorMode = App.shadowValues.get('selectedColMode'),
			opacity = App.shadowValues.get('opacity');

		$('input[type=text], textarea').on('click', function(){
			$(this).select();
		});

		$('#colormode').on('change', function () {
			colorMode = $(this).val();
		});

		$('#opacity').on('change', function () {
			opacity = $(this).val();
		});

		$('#picker').colpick({
			layout: 'rgbhex',
			color: App.shadowValues.get('col'),
			onChange: function(hsb, hex, rgb, fromSetColor) {
				var rgbaStr = 'rgba('+ rgb.r +','+ rgb.g +','+ rgb.b +','+ opacity +')',
					input = $('#picker');

				if (colorMode === 'hex') {
					if(!fromSetColor) input.val('#'+hex).css('border-color','#'+hex);
				} else {
					if(!fromSetColor) input.val(rgbaStr).css('border-color', rgbaStr);
				}

				App.shadowValues.set('r', rgb.r);
				App.shadowValues.set('g', rgb.g);
				App.shadowValues.set('b', rgb.b);
				App.shadowValues.set('hex', '#'+hex);
			},
			onSubmit: function () {
				$('#picker').colpickHide();
			}
		})
		.keyup(function() {
			$(this).colpickSetColor(this.value, true);
		});
	}
});

window.BC = Ember.Namespace.create({
	VERSION: "0.0.1"
});

BC.RangeInput = Ember.View.extend({
	tagName: "input",
	attributeBindings: ["type", "min", "max", "step", "value", "name"],
	type: "range",
	min: 0,
	max: 10,
	step: 1,
	value: 5,
	change: function (event) {
		this.set("value", event.target.value);
	}
});