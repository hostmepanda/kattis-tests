'use strict'

const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dices = [];

readlineInterface
  .on('line', (line) => {
    const [firstDiceMin, firstDiceMax, secondDiceMin, secondDiceMax] = line.split(' ');
  
    dices.push([
      [Number(firstDiceMin), Number(firstDiceMax)],
      [Number(secondDiceMin),  Number(secondDiceMax)],
    ]);
  })
  .on('close', () => {
    const [gunnerDices, emmaDices] = dices;
    
    const [gunnerProbability, emmaProbability] = [gunnerDices, emmaDices].map(
      // Both distributions are symmetric around the mean
      ([
         [firstDiceMin, firstDiceMax],
         [secondDiceMin, secondDiceMax],
       ]) =>
        firstDiceMin + firstDiceMax + secondDiceMin + secondDiceMax,
    );
    
    const isTie = gunnerProbability === emmaProbability;
    const isGunnerProbablyWin = gunnerProbability > emmaProbability;
  
    if (isTie) {
      console.log('Tie');
      // 0 is expected value of successful ending
      return 0;
    }
    
    if (isGunnerProbablyWin) {
      console.log('Gunner');
    } else {
      console.log('Emma');
    }
    
    // 0 is expected value of successful ending
    return 0;
  });
