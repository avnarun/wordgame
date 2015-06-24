// ls | perl -pi -e 's/^(.*)\.jpg/"$1",/g'

$.ajax({
     async: false,
     type: 'GET',
     url: 'wordlist/original.txt',
     success: function(data) {
       words = data.split('\n');
       console.log(words);
     }
});

function speak(str) {

    var msg = new SpeechSynthesisUtterance(str);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}


function GameCntl($scope, $timeout) {
    $scope.clue = "_ar";
    $scope.word = "car";
    $scope.letter = "c";
    $scope.index = 0;
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;
    $scope.mode = "single";

    $scope.setmode = function(m) {
        $scope.mode = m;
        $scope.next();
    }

    $scope.next = function() {

        $scope.timeout = 0;

        // Pick a random word
        $scope.word = words[Math.floor(Math.random()*words.length)];

        // Select a letter
        if($scope.mode == "any") {
            $scope.index = Math.floor(Math.random()*$scope.word.length);
        } else {
            $scope.index = 0;
        }

        $scope.letter = $scope.word[$scope.index];

        $scope.resetclue();
    };

    $scope.resetclue = function() {
        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;

        $scope.clue = $scope.word.substr(0, $scope.index) + '_'
        + $scope.word.substr($scope.index + 1);

        $scope.firstletter = $scope.word.substring(0,1).toUpperCase() + ' / ' + $scope.word.substring(0,1);

        speak($scope.word);
    };

    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }

        c = String.fromCharCode(e.keyCode);

        // Ignore key presses outside of A-Z
        if(c < 'A' || c > 'Z') {
            return;
        }

        if(c == $scope.letter.toUpperCase()) {
            $scope.correct();
        } else if(c == ' ') {
            $scope.next();
        } else {
            $scope.incorrect(c);
        }
    };

    $scope.correct = function() {

        $scope.number_right += 1;

        $scope.right_indicator = true;
        $scope.wrong_indicator = false;

        $scope.clue = $scope.word.substr(0, $scope.index) + $scope.letter
        + $scope.word.substr($scope.index + 1);

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.next, 2000);

        $('#jpId').jPlayer("play");
    };

    $scope.incorrect = function(c) {
        $scope.right_indicator = false;
        $scope.wrong_indicator = true;

        $scope.clue = $scope.word.substr(0, $scope.index) + c.toLowerCase()
        + $scope.word.substr($scope.index + 1);

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.resetclue, 2000);

        speak($scope.clue + "?");
    };

    $scope.next();
}
