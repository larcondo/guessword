var app = angular.module('myApp', ["ngRoute"]);
app.controller('myCtrl', function($scope, $window){
  const maxErrors = 5;
  let numeroWord = 0;
  $scope.status = 0;
  $scope.pasoIntro = 1;

  $scope.avanzarPasoIntro = () => {
    if ($scope.pasoIntro < 7) $scope.pasoIntro += 1;
  }

  $scope.retrocederPasoIntro = () => {
    if ($scope.pasoIntro > 1) $scope.pasoIntro -= 1;
  }

  $scope.reiniciarPasoIntro = () => {
    $scope.pasoIntro = 1;
  }

  $scope.validaciones = {
    player1: false, player2: false
  }

  $scope.players = [
    {name: '', score: 0, errors: 0, pts: 0},
    {name: '', score: 0, errors: 0, pts: 0}
  ];

  $scope.playersWords = [
    ['', '', ''],
    ['', '', '']
  ];

  $scope.playersArrays = [
    [], [], [], [], [], []
  ];

  $scope.gameStatus = {
    player: 0,
    word: [],
    word2guess: [],
    result: 0,
    winner: 'empty',
    p1inicializado: false,
    p2inicializado: false,
    p1message: null,
    p2message: null
  };

  $scope.validarP1 = function() {
    $scope.gameStatus.p1message = null
    const valName = ($scope.players[0].name !== '')
    const palabra1 = ($scope.playersWords[0][0] !== '')
    const palabra2 = ($scope.playersWords[0][1] !== '')
    const palabra3 = ($scope.playersWords[0][2] !== '')

    $scope.validaciones.player1 = valName && palabra1 && palabra2 && palabra3
  }

  $scope.validarP2 = function() {
    $scope.gameStatus.p2message = null
    const valName = ($scope.players[1].name !== '')
    const palabra1 = ($scope.playersWords[1][0] !== '')
    const palabra2 = ($scope.playersWords[1][1] !== '')
    const palabra3 = ($scope.playersWords[1][2] !== '')

    $scope.validaciones.player2 = valName && palabra1 && palabra2 && palabra3
  }

  $scope.inicializarP1 = function () {

    if (!$scope.validaciones.player1) {
      // alert('Completa todos los campos correctamente!')
      $scope.gameStatus.p1message = 'Completa todos los campos correctamente!'
      return
    }  

    $scope.playersArrays[0] = $scope.playersWords[0][0].toUpperCase().split('');
    $scope.playersArrays[1] = $scope.playersWords[0][1].toUpperCase().split('');
    $scope.playersArrays[2] = $scope.playersWords[0][2].toUpperCase().split('');
    console.log('Player 1 inicializado...');
    $scope.status = 1;
    $scope.gameStatus.p1inicializado = true;
    $window.location.href = '#!player2'
    return;
  };

  $scope.inicializarP2 = function () {

    if (!$scope.validaciones.player2) {
      // alert('Completa todos los campos correctamente!')
      $scope.gameStatus.p2message = 'Completa todos los campos correctamente!'
      return
    }

    $scope.playersArrays[3] = $scope.playersWords[1][0].toUpperCase().split('');
    $scope.playersArrays[4] = $scope.playersWords[1][1].toUpperCase().split('');
    $scope.playersArrays[5] = $scope.playersWords[1][2].toUpperCase().split('');
    console.log('Player 2 inicializado...');
    $scope.status = 2;
    $scope.gameStatus.p2inicializado = true;
    
    console.log(numeroWord);
    console.log(typeof numeroWord);
    $scope.gameStatus.player = 1;
    $scope.gameStatus.word = $scope.playersArrays[0];
    $scope.gameStatus.word2guess = $scope.gameStatus.word.map(() => { return '_'; });
    $window.location.href = '#!game'
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
    $scope.gameStatus.result = 0;

    if ($scope.gameStatus.player === 1 ) {
      indice = numeroWord + 3;
      // Eliminar linea siguiente
      // $scope.gameStatus = {player: 0, word: $scope.playersArrays[indice]};
      $scope.gameStatus.player = 0;
      $scope.gameStatus.word = $scope.playersArrays[indice];
    } else if ($scope.gameStatus.player === 0) {
      numeroWord += 1;
      indice = numeroWord;
      // Eliminar linea siguiente
      // $scope.gameStatus = {player: 1, word: $scope.playersArrays[indice]};
      $scope.gameStatus.player = 1;
      $scope.gameStatus.word = $scope.playersArrays[indice];
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

  $scope.reiniciar = function() {
    
    // Reiniciar palabras
    $scope.playersWords = [ ['', '', ''], ['', '', '']];
    
    // Reiniciar jugadores
    $scope.players[0].name = ''
    $scope.players[0].score = 0
    $scope.players[0].errors = 0
    $scope.players[0].pts = 0
    $scope.players[1].name = ''
    $scope.players[1].score = 0
    $scope.players[1].errors = 0
    $scope.players[1].pts = 0

    // Reiniciar estado de validaciones
    $scope.validaciones.player1 = false
    $scope.validaciones.player2 = false

    // Reiniciar estados
    $scope.gameStatus.p1inicializado = false
    $scope.gameStatus.p2inicializado = false

    $window.location.href = '/'
    
  }

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