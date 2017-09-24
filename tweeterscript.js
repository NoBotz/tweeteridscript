// Lock to prevent spamming button
var lock = false;

$('#twitterButton').click(function(){
	$('#twitterInput').submit();
});

$('#twitterInput').submit(function() {
	if (lock == false) {
		// Obtain lock
		lock = true;
		
		var input = $('#twitter').val().toLowerCase();
	
		// Post to PHP script
		$.ajax({
			url: 'ajax.php',
			data: {input:input},
			type: 'post',
			success: function (response) {//response is value returned from php
				outputConversion(input, response);
			}
		});
		
		setTimeout(function() { 
			lock = false;
		}, 3000); // Release lock after time
	}
});


var outputCount = 0;

function outputConversion(input, response){

	// Handle/Check for Error
	if (response == "error"){
		response = "<span style='color:red'>Error: Not Found</span>";
	}

	// Check if it is an id
	var isID = IsNumeric(input);

	// Add an @ for output if doesn't exist and not an ID
	if (input.charAt(0) != "@" && isID == false) {
		input = "@" + input;
	}
	
	if (outputCount == 0){
		$('#oop').fadeOut(500);
		$('#output').html("<p style='margin-bottom:8px'>Recent ID Conversions:</p>");
		setTimeout(function() {
			$('#output').fadeIn(500);
		}, 500); // Delay the animation for half a second
	}

	var outputText = "<p id='"+outputCount+"' style='display:none'>"+ input +" => "+ response +"</p>";

	$('#output').html($('#output').html() + outputText);
	$('#'+outputCount).fadeIn(800);

	$('#outputSection').switchClass("outputSection","outputSectionFlash");
	setTimeout(function() {
		$('#outputSection').switchClass("outputSectionFlash","outputSection");
	}, 500); // Delay the animation for half a second

	outputCount++;
}

// Checks if input is ID or not... returns true if it is an ID (if it is numerical)
function IsNumeric(input){
    return (input - 0) == input && input.length > 0;
}

