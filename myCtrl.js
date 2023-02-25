var app = angular.module('myApp', ["ngRoute"]);
app.controller('myCtrl', function($scope){
const maxErrors = 5;
let numeroWord = 0;
$scope.status = 0;

$scope.players = [
  {name: 'Lucas', score: 0, errors: 0, pts: 0},
  {name: 'Nadia', score: 0, errors: 0, pts: 0}
];

$scope.playersWords = [
  ['ARROZ', 'TOMATE', 'CASA'],
  ['CHOCLO', 'GATO', 'PERRO']
];

$scope.playersArrays = [
  [], [], [], [], [], []
];

$scope.gameStatus = {
  player: 0,
  word: [],
  word2guess: [],
  result: 0,
  winner: 'empty'
};

$scope.inicializarP1 = function () {
  $scope.playersArrays[0] = $scope.playersWords[0][0].toUpperCase().split('');
  $scope.playersArrays[1] = $scope.playersWords[0][1].toUpperCase().split('');
  $scope.playersArrays[2] = $scope.playersWords[0][2].toUpperCase().split('');
  console.log('Player 1 inicializado...');
  $scope.status = 1;
  return;
};

$scope.inicializarP2 = function () {
  $scope.playersArrays[3] = $scope.playersWords[1][0].toUpperCase().split('');
  $scope.playersArrays[4] = $scope.playersWords[1][1].toUpperCase().split('');
  $scope.playersArrays[5] = $scope.playersWords[1][2].toUpperCase().split('');
  console.log('Player 2 inicializado...');
  $scope.status = 2;
  
  console.log(numeroWord);
  console.log(typeof numeroWord);
  $scope.gameStatus = {player: 1, word: $scope.playersArrays[0] };
  $scope.gameStatus.word2guess = $scope.gameStatus.word.map(() => { return '_'; });
  return;
};

$scope.pulsar = function(myE) {
  myE.target.disabled = true;
  const pal = $scope.gameStatus.word;
  const cPlayer = $scope.gameStatus.player;

  if (pal.includes(myE.target.innerHTML)){
    for(let i = 0; i < pal.length; i++) {
      if (myE.target.innerHTML === pal[i]) {
        // console.log(myE.target.innerHTML + ' está en la pos: ' + i);
        $scope.gameStatus.word2guess[i] = myE.target.innerHTML;
        $scope.players[cPlayer].score += 1;

        if ($scope.players[cPlayer].score === $scope.gameStatus.word.length) {
          console.log('GANASTE!!!');
          deshabilitarBotones();
          $scope.gameStatus.result = 1;
          $scope.players[cPlayer].pts += ( maxErrors - $scope.players[cPlayer].errors ) * 10;
        }
      }
    };
  } else {
    // console.log(myE.target.innerHTML + ' no está en la palabra');
    $scope.players[cPlayer].errors += 1;
    if ( $scope.players[cPlayer].errors >= maxErrors ) {
      console.log('PERDISTE!!!');
      deshabilitarBotones();
      $scope.gameStatus.result = 2;
    };
  };
};

$scope.nextTurn = function() {

  let indice = 0;

  if ($scope.gameStatus.player === 1 ) {
    indice = numeroWord + 3;
    $scope.gameStatus = {player: 0, word: $scope.playersArrays[indice]};
  } else if ($scope.gameStatus.player === 0) {
    numeroWord += 1;
    indice = numeroWord;
    $scope.gameStatus = {player: 1, word: $scope.playersArrays[indice]};
  }

  $scope.gameStatus.word2guess = $scope.gameStatus.word.map(() => { return '_'; });

  const botonesTeclas = document.getElementsByClassName('teclado-letra');
  for(let i=0; i<botonesTeclas.length; i++){
    botonesTeclas[i].disabled = false;
  }

  $scope.players[0].score = 0;
  $scope.players[0].errors = 0;
  $scope.players[1].score = 0;
  $scope.players[1].errors = 0;

  if(numeroWord === 3 && $scope.gameStatus.player === 1) {
    console.log('Final del juego');

    if ( $scope.players[0].pts === $scope.players[1].pts ) {
      $scope.gameStatus.winner = 'EMPATE';
    } else {
      $scope.gameStatus.winner = ($scope.players[0].pts > $scope.players[1].pts) ? $scope.players[0].name : $scope.players[1].name
    };
    $scope.status = 3;
  };
};

});

function habilitarBotones() {
  const botonesTeclas = document.getElementsByClassName('teclado-letra');
  for(let i=0; i<botonesTeclas.length; i++){
    botonesTeclas[i].disabled = false;
  }
}

function deshabilitarBotones() {
  const botonesTeclas = document.getElementsByClassName('teclado-letra');
  for(let i=0; i<botonesTeclas.length; i++){
    botonesTeclas[i].disabled = true;
  }
}



// Rutas
app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'main.htm'
  })
  .when('/player1', {
    templateUrl: 'player1.htm'
  })
  .when('/player2', {
    templateUrl: 'player2.htm'
  })
  .when('/game', {
    templateUrl: 'game.htm'
  })
}]);