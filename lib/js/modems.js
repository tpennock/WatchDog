if( !$.watchdog )
$.watchdog = {};
$.watchdog.modem = null;

/*
 * Watchdog Supported Modem Types
 * 
 * Qwest PK5000 - by Kevin Mesiab
 * 
 * 
 * Adding Support:
 * To add support for your modem, locate a page on its embedded web server that 
 * displays: 
 * 
 * Status of connection to ISP
 * Status of connection to Internet
 * Current connection (download) speed in kbps
 * 
 * Test and create three regular expressions that extract the above three states.  
 * Place these regular expressions in the respective json property in the modem
 * object (speed_rx, isp_rx, dsl_rx).
 * 
 * A connection is deemed to be made if the regular expression capture for both
 * isp_rx and dsl_rx match the modem properties dsl_confirm and isp_confirm respectively.
 * 
 * The modem object below indicates the minimum required properties for adding a new modem
 * to WatchDog.
 * 
 */

$.watchdog.modems = [
	{
		"model" 		: "PK5000",
		"ip" 			: "192.168.0.1",
		"page" 			: "/cgi-bin/webcm?getpage=../html/modemstatus_real.html",
		"speed_rx"		: /ds_rate="([0-9]*)"/,
		"isp_rx" 		: /var\sisp_status\s=\s"<span class=status_text_big.*?>.*?>([\sA-Z]*)<.*?"/,
		"dsl_rx" 		: /var\sdsl_status\s=\s"<span class=status_text_big.*?>.*?>([\sA-Z]*)<.*?"/,
		"dsl_confirm" 	: "CONNECTED",
		"isp_confirm" 	: "CONNECTED"
	}
];