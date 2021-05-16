//generate color randomly
var randomNum = Math.floor(Math.random() * 6) + 1;
switch (randomNum) {
    case 1:
        color = '#000000'
        break;
    case 2:
        color = '#FF0000'
        break;
    case 3:
        color = '#FF00FF'
        break;
    case 4:
        color = '#0000FF'
        break;
    case 5:
        color = '#00FFFF'
        break;
    case 6:
        color = '#00FF00'
        break;
    default:
}


var pollServer = function () {
    $.get('chat.php', function (result) {

        if (!result.success) {
            console.log("Error polling server for new messages!");
            return;
        }
        // Generating colors for chat bubbles 
        $.each(result.messages, function (idx) {

            var chatBubble;

            if(this.username == 'self') {
                chatBubble = $('<div class="row bubble-sent pull-right" style="background:' + this.color + '">' + 
                               'Me: ' + this.message + 
                               '</div><div class="clearfix"></div>');
            } else {
                chatBubble = $('<div class="row bubble-recv" style="background:' + this.color + '">' + 
                               this.username + ': ' + this.message + 
                               '</div><div class="clearfix"></div>');
            }

            $('#chatPanel').append(chatBubble);
        });

        setTimeout(pollServer, 5000);
    });
}

$(document).on('ready', function () {
    pollServer();

    $('button').click(function () {
        $(this).toggleClass('active');
    });
});

$('#sendMessageBtn').on('click', function (event) {
    event.preventDefault();

    var username = $('#username').val();
    var message = $('#chatMessage').val();
    var color = input.get('color');


    $.post('chat.php', {
        'userName': userName,
        'message': message,
        'color': color
    }, function (result) {

        $('#sendMessageBtn').toggleClass('active');

        if (!result.success) {
            alert("There was an error sending your message");
        } else {
            console.log("Message sent!");
            $('#chatMessage').val('');
        }
    });

});

