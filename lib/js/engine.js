if( !$.watchdog )
$.watchdog = {};
$.watchdog.engine = {};
$.watchdog.engine.up = false;
$.watchdog.engine.running = false;
$.watchdog.engine.thread_id = null;
$.watchdog.engine.session_start = null;
$.watchdog.engine.session_stop = null;

$.watchdog.engine.start = function() {
	
	$.watchdog.engine.session_start = new Date();
	$.watchdog.engine.session_stop = null;
	
	$.watchdog.engine.running = true;
	$.watchdog.engine.track_modem_status();
	
}

//
// Stop monitoring the global modem object
// and stop all up/down time tracking and event 
// logging
//
$.watchdog.engine.stop = function() {
	//
	// Calling individual stop functions will
	// cause the engine to log a change of connection
	// event.  Instead, we manually set their run flags
	// to off, silently ending their timers.
	//
	$.watchdog.engine.running 	= false;
	$.watchdog.engine.up 		= false;
	$.watchdog.engine.down 		= false;
	
	$.watchdog.engine.session_stop = new Date();
}

//
// Fetches the global modem object's status page 
// and sends it for parsing, setting a timer to 
// repeat this process according to config.lookup_delay (config.js)
//
$.watchdog.engine.track_modem_status = function() {
	
	if( !$.watchdog.engine.running ) return;
	 
	//
	// Threading cleanup
	//
	if( $.watchdog.engine.thread_id != null ) 
		window.clearTimeout( $.watchdog.engine.thread_id );
	 
	// 
	// Set icon
	//
	$('#status_icon').attr('src', '/img/testing.png');

	//
	// Construct url
	//
	var url = 'http://' + $.watchdog.modem.ip + $.watchdog.modem.page;
		 
	//
	// Fetch then parse page.  Restart the timer
	//
	$.get( url, null, function(data){
		$.watchdog.engine.parse_modem_page(data);
		$.watchdog.engine.thread_id = window.setTimeout($.watchdog.engine.track_modem_status, config.lookup_delay);
	});
}

//
// Parses the returned modem status page HTML and performs 
// regex to determine connection and speed status.  
//
// The particular regex tests are defined in the global
// modem object chosen at start time.  See modems.js for
// a complete view of the modem object, its regular expressions
// and its regex validation properties.
//
$.watchdog.engine.parse_modem_page = function(data) {
	
	var dsl 	= $.watchdog.modem.dsl_rx.exec(data);
	var isp 	= $.watchdog.modem.isp_rx.exec(data);
	var speed 	= $.watchdog.modem.speed_rx.exec(data);
	
	//
	// Set DSL info
	//
	if( dsl )
		$('#dsl_status').text( dsl[1] ); 
	else
		$('#dsl_status').text( "Unknown" ); 
		 
	//
	// Set ISP info
	//
	if( isp )
		$('#isp_status').text( isp[1] ); 
	else
		$('#isp_status').text( "Unknown" ); 

	//
	// Set speed info
	//
	if( speed )
		$('#connection_speed').text( speed[1] + ' kbps' );
	else
		$('#connection_speed').text( "Unknown" );


	if( dsl && dsl[1] == $.watchdog.modem.dsl_confirm && isp && isp[1] == $.watchdog.modem.isp_confirm ) {
		
		$.watchdog.engine.stop_tracking_downtime();
		$.watchdog.engine.track_uptime();

		$('.msg').text("Connected");
		$('.msg').removeClass('error');
		$('.msg').addClass('connected');
		$('#status_icon').attr('src', '/img/on.png');
		
	} else {

		$.watchdog.engine.stop_tracking_uptime();
		$.watchdog.engine.track_down_time();

		$('.msg').removeClass('connected');
		$('.msg').addClass('error');
		$('.msg').text("Disconnected"); 
		$('#status_icon').attr('src', '/img/off.png');
	
	}
} 


//
// Fired when downtime is detected, this function kicks off an internal
// timer that tracks the time and length of the downtime and reports it
// on screen.  
//
$.watchdog.engine.track_down_time = function(){}

//
// Fired when downtime is no longer detected.  This function will log
// the details of the downtime event, such as start time, date and duration.
//
$.watchdog.engine.stop_tracking_downtime = function(){}

//
// Fired when uptime is detected.  This function kicks off an internal 
// timer that tracks the time and length of the uptime and reports it on
// screen
// 
$.watchdog.engine.track_uptime = function() {
	
	if( $.watchdog.engine.up ) return;
	$.watchdog.engine.up = true;
	
	//
	// The time we began tracking uptime
	//
	var uptime_start = new Date();

	//
	// Display the time elapsed every second
	//
	var timer_loop = function(){
 
		if (!$.watchdog.engine.up) {
			$('#timer').text('00:00:00');
			return;
		}

		var utid = window.setTimeout(function(){
		
			if (utid) window.clearTimeout(utid);
			//
			// Get elapsed time
			//
			var now = new Date();
			var time = new Date( now.getTime()-uptime_start.getTime() );
			
			//
			// Format to double digits
			//
			var hours = (time.getHours()-17 < 10 ) ? "0" + time.getHours()-17 : time.getHours() -17;
			var minutes = (time.getMinutes() < 10 ) ? "0" + time.getMinutes() : time.getMinutes();
			var seconds = (time.getSeconds() < 10 ) ? "0" + time.getSeconds() : time.getSeconds();
			
			//
			// Display time on screen
			//
			$('#timer').text( hours + ":" + minutes + ":" + seconds );
			
			timer_loop();
		}, 1000);
	}
	
	//
	// Start the timer loop
	//
	timer_loop();
	
}

//
// Fired when uptime is no longer detected (modem down).  This function
// wil log the details of the uptime event, such as start time, date, speed and duration
//
$.watchdog.engine.stop_tracking_uptime = function(){
	$.watchdog.engine.up = false;
	//
	// Log Event
	//
}

 



 