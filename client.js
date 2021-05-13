var pollServer = function() {
    $.get('chat.php', function(result) {
        
        if(!result.success) {
            console.log("Error polling server for new messages!");
            return;
        }
        
        $.each(result.messages, function(idx) {
            
            var chatBubble;
            
            if(this.sent_by == 'self') {
                chatBubble = $('<div class="row bubble-sent pull-right">' + this.userName+ '&nbsp' +
                               this.message + 
                               '</div><div class="clearfix"></div>');
            } else {
                chatBubble = $('<div class="row bubble-recv">' + this.userName + '&nbsp' +
                               this.message + 
                               '</div><div class="clearfix"></div>');
            }
            
            $('#chatPanel').append(chatBubble);
        });
        
        setTimeout(pollServer, 5000);
    });
}

$(document).on('ready', function() {
    pollServer();
    
    $('button').click(function() {
        $(this).toggleClass('active');
    });
});

$('#sendMessageBtn').on('click', function(event) {
    event.preventDefault();

    var userName = $('#userName').val();
    var message = $('#chatMessage').val();
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

    if(userName == '' || pattern.test(username)){
        document.getElementById("errorMessage").innerHTML = '*Error* Enter an alphanumeric names Please!\n';
        return;
    } else{
        document.getElementById('errorMessage').innerHTML = "";
    }
    if (message == '' || pattern.test(message)){
        document.getElementById('messageErrorMessage').innerHTML = "*Error* Enter an alphanumeric name please!\n";
        return;
    } else{
        document.getElementById('messageErrorMessage').innerHTML = "";
    }

    
    $.post('chat.php', {
	    'userName' : userName,
        'message' : message
    }, function(result) {
        
        $('#sendMessageBtn').toggleClass('active');
        
        
        if(!result.success) {
            alert("There was an error sending your message");
        } else {
            console.log("Message sent!");

	        $('#userName').val('');
            $('#chatMessage').val('');
        }
    });
    
});

