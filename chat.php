<?php
session_start();
ob_start();
header("Content-type: application/json");
date_default_timezone_set('UTC');
//connect to database
$db = mysqli_connect('mariadb', 'cs431s31', 'aoma2Gei', 'cs431s31');
if (mysqli_connect_errno()) {
   echo '<p>Error: Could not connect to database.<br/>
   Please try again later.</p>';
   exit;
}
//helper funtion to replace get_results() if without mysqlnd 
function get_result( $Statement ) {
    $RESULT = array();
    $Statement->store_result();
    for ( $i = 0; $i < $Statement->num_rows; $i++ ) {
        $Metadata = $Statement->result_metadata();
        $PARAMS = array();
        while ( $Field = $Metadata->fetch_field() ) {
            $PARAMS[] = &$RESULT[ $i ][ $Field->name ];
        }
        call_user_func_array( array( $Statement, 'bind_result' ), $PARAMS );
        $Statement->fetch();
    }
    return $RESULT;
}
try { 
    $currentTime = time();
    $session_id = session_id();    
    $lastPoll = isset($_SESSION['last_poll']) ? $_SESSION['last_poll'] : $currentTime;    
    $action = isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ? 'send' : 'poll';
    switch($action) {
        case 'poll':
           $query = "SELECT * FROM chat WHERE date_created >= ".$lastPoll;
           $stmt = $db->prepare($query);
           $stmt->execute();
           $stmt->bind_result($id, $message, $sent_by, $date_created, $username, $user_color);
           $result = get_result( $stmt);
           $newChats = [];
           while($chat = array_shift($result)) {
               
               if($session_id == $chat['sent_by']) 
                  $chat['username'] = 'self';
               
               $newChats[] = $chat;
            }
           $_SESSION['last_poll'] = $currentTime;

           print json_encode([
                'success' => true,
		'messages' => $newChats
           ]);
           exit;
        case 'send':

            //get the username, message and color and store into the database
            $message = isset($_POST['message']) ? $_POST['message'] : '';            
            $message = strip_tags($message);
            $user_name = isset($_POST['username']) ? $_POST['username'] : '';
            $bubbleColor = '#'.substr(str_shuffle('ABCDEF0123456789'), 0, 6); 

            // Adding color to user
            $colorQuery = "SELECT username, user_color FROM chat";
            $colorResult = $db->query($colorQuery);
            while($pair = $colorResult->fetch_assoc()){

              if($user_name == $pair["username"]){
                $bubbleColor = $pair["user_color"];
              }

            }

            //modify query to add username and color 
            $query = "INSERT INTO chat (message, sent_by, date_created, username, user_color) VALUES(?,?,?,?,?)";
            $stmt = $db->prepare($query);
            $stmt->bind_param('ssi', $message, $session_id, $currentTime, $user_name, $bubbleColor); 
            $stmt->execute(); 
            print json_encode(['success' => true]);
            exit;
    }
} catch(Exception $e) {
    print json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
