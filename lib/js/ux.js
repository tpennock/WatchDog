/*
 * ux.js
 * Kevin Mesiab
 * 
 * The $.watchdog.ux class provides shortcut functionality
 * for modifying the user-interface in a consistent way.
 * 
 * TODO: Not yet wired up to the namespace
 * 
 * 
 */
if( !$.watchdog )
$.watchdog = {};
$.watchdog.ux = {};




function startup_animation() {
	$('#status').fadeIn('fast');
	$('#footer img').fadeIn(3000);
}			




function init_ui() {
	
	set_button_to_start_mode();
	bind_modem_types();
	startup_animation();
}			




function set_button_to_stop_mode() {
	
	$('button').button({
		icons: {
			primary: "ui-icon-stop"
		}, 
		label: "Stop Monitoring"
	});
	$('#model').fadeOut();

}



		
function set_button_to_start_mode() {
	
	$('button').button({
		icons: {
			primary: "ui-icon-play"
		}, 
		label: "Start Monitoring"
	});
	$('#model').fadeIn();
}			



			
function bind_modem_types() {
	
	var opts = [];				
	//
	// Add the default option
	//
	opts.push( '<option>Select Your Modem</option>' );
	//
	// Add all modem types
	//
	for (var i = 0; i < $.watchdog.modems.length; ++i) {
		opts.push( '<option>' + $.watchdog.modems[i].model + '</option>' );
	}
	//
	// Append to select tag
	//
	$('#model').html( opts.join('\r\n') );
}