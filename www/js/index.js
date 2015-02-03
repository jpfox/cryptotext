/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var isApp = !!window.cordova;
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		/*
        var devicereadyElement = document.getElementById(id);
        var viewcryptElement = document.getElementById('viewcrypt');

        console.log('Received Event: ' + id);
        
        devicereadyElement.setAttribute('style', 'display:none;');
        viewcryptElement.setAttribute('style', 'display:block;');
        */
        $.mobile.navigate( "#login" );
    }
};

if(isApp) { // cordova
	app.initialize();
} else { // browser
	app.receivedEvent('deviceready');
}

var bits = 512;
var myRSAKey = null;

var nextaction = '#mycryptoident';

$( document ).ready(function() {
	
	
	
	// disable crypt action on pass change
	$('#mypass, #pseudo').change(function(){
		$('checkbox.cryptaction').checkboxradio("disable");
		$('.cryptaction').prop( "disabled", true );
		$('#mypubkey').val('');
	});
	
	// generate key
	$('#validpass').click(function(){
		var pseudo = $('#pseudo').val();
		var pass = $('#mypass').val();
		if(pass.length<=5)
		{
			alert("Pass phrase must have more than 5 characters");
			pass = null;
			return;
		}
		if(pseudo.length==0)
		{
			alert("You have to enter a pseudo");
			pass = null;
			return;
		}
		myRSAKey = cryptico.generateRSAKey(pseudo + '/' + pass, bits);
		$('#mypubkey').val(cryptico.publicKeyString(myRSAKey));
		$('checkbox.cryptaction').checkboxradio("enable");
		$('.cryptaction').prop( "disabled", false );
		pass = null;
		$.mobile.navigate( nextaction );
		
	});
	
	// select on focus
	$("textarea").focus(function(e){
		$(this).select();
	});
	
	
	// Send ident
	$('#mailident').click(function(){
		window.location.assign("mailto:?subject=CryptoText&body=https://jpfox.fr/c/#i~" + $('#mypubkey').val() + "~");
	});
	$('#smsident').click(function(){
		window.location.assign("smsto:?body=https://jpfox.fr/c/#i~" + $('#mypubkey').val() + "~");
	});
	$('#shareident').click(function(){
		window.plugins.socialsharing.share('https://jpfox.fr/c/#i~' + $('#mypubkey').val() + "~");
	});
	

	// encrypt
	$('#encrypt').click(function(){
		var sign = $('#sign').prop("checked");
		try {
			var encryptionResult = cryptico.encrypt($('#cleartext').val(), $('#contactkey').val(), sign?myRSAKey:null);
			$('#cryptedtext').val(encryptionResult.cipher);
		} catch(e) {
			$('#cryptedtext').val('');
			$('#signature').html(e.message);
		}
	});
	
	// decrypt
	$('#decrypt').click(function(){
		try {
			var decryptionResult = cryptico.decrypt($('#cryptedtext').val(), myRSAKey);
			$('#cleartext').val(decryptionResult.plaintext);
			if(decryptionResult.status=="success") {
				if(decryptionResult.signature=='verified')
				{
					var signature = decryptionResult.publicKeyString;
					if($('#contactkey').val()=='')
						$('#contactkey').val(signature);
					if(signature==$('#contactkey').val())
						$('#signature').text("signed by contact.");
					else
						$('#signature').text(decryptionResult.publicKeyString);
				}
				else
					$('#signature').text(decryptionResult.signature + " !");
			} else {
				$('#signature').text("decryption failed !");
			}
		} catch(e) {
			$('#cleartext').val('');
			$('#signature').html(e.message);
		}

	});
	
	// send
	if(isApp) {
		$('#send').click(function(){
			window.plugins.socialsharing.share('https://jpfox.fr/c/#m' + $('#cryptedtext').val());
		});
	} else {
		$('#send').click(function(){
			window.location.href = "mailto:?subject=CryptoText&body=https://jpfox.fr/c/#m" + $('#cryptedtext').val();
		});
	}
	
	// parse #
	if(!isApp) {
		handleOpenURL(window.location.hash);
	}
	
});

function handleOpenURL(url) {
  if(url.indexOf('m~')!=-1) {
    setTimeout(function() {
      var cryptedtextElement = document.getElementById('cryptedtext');
      cryptedtextElement.value=url.substring(url.indexOf('~'));
    }, 0);
  }
}
