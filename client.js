var pollServer = function() {

    $.get('chat.php', function(result) {
        
        if(!result.success) {
            console.log("Error polling server for new messages!");
            return;
        }
        
        $.each(result.messages, function(idx) {
            
            var chatBubble;
            if(this.username == 'self') {
                chatBubble = $('<div class="row bubble-sent pull-right" style="background:' + this.user_color + '">' + 
                               'Me: ' + this.message + 
                               '</div><div class="clearfix"></div>');
            } else {
                chatBubble = $('<div class="row bubble-recv" style="background:' + this.user_color + '">' + 
                               this.username + ': ' + this.message + 
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

    //Checks the given nickname and message for null strings or sneaky sql injections.
    var username = $('#newname').val();
    var message = $('#chatMessage').val();
    
    //Sends the message and name to the server.
    $.post('chat.php', {
        'message' : message,
        'username' : username,
    }, function(result) {
        
        $('#sendMessageBtn').toggleClass('active');
        
        if(!result.success) {
            alert("There was an error sending your message");
        } else {
            console.log("Message sent!");
            $('#chatMessage').val('');
        }
    });
    
});
