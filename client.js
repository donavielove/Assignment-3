var pollServer = function() {
    $.get('chat.php', function(result) {
        
        if(!result.success) {
            console.log("Error polling server for new messages!");
            return;
        }
        
        $.each(result.messages, function(idx) {
            
            var chatBubble;
            
            if(this.sent_by == 'self') {
                var addColor = '<div class="row bubble-sent pull-right" style="background: #' + this.color + '; border-color: #' + this.color + '; --color: #' + this.color + '; color: white">';
                chatBubble = $(addColor + 'Me:' +
                               this.message + 
                               '</div><div class="clearfix"></div>');
            } else {
                var cColor = 'div class="row bubble-recv" style = "background: #' + this.color + '; --color: #' + this.color + '; color:white">';
                chatBubble = $( cColor + this.userName + ': ' +
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
    // var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

    // if(userName == '' || pattern.test(userName)){
    //     document.getElementById("errorMessage").innerHTML = '*Error* Enter an alphanumeric names Please!\n';
    //     return;
    // } else{
    //     document.getElementById('errorMessage').innerHTML = "";
    // }
    // if (message == '' || pattern.test(message)){
    //     document.getElementById('messageErrorMessage').innerHTML = "*Error* Enter an alphanumeric name please!\n";
    //     return;
    // } else{
    //     document.getElementById('messageErrorMessage').innerHTML = "";
    // }

    
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

