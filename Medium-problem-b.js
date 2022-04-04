'use strict'

const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let words = [];

readlineInterface
  .on('line', (line) => {
    words.push(line);
  })
  .on('close', () => {
    words.map(countDistinctAnagrams);
  });

function countDistinctAnagrams(word) {
  const wordLength = BigInt(word.length);
  
  const allAnagrams = countFactorial(wordLength);
  
  const letterDuplicateFactorialList = Object
    .values(countLetterDuplicatesInWord(word))
    .filter(counter => counter > 1n)
    .map(countFactorial);
  
  const duplicateAnagramsCount = letterDuplicateFactorialList.reduce(
    (duplicateCount, factorial) => duplicateCount * factorial,
    1n,
  );
  
  const uniqueAnagrams = allAnagrams / duplicateAnagramsCount
  
  console.log(BigInt(uniqueAnagrams).toString());
}

function countFactorial(n) {
  return n === 1n ? 1n : n * countFactorial(n - 1n);
}

function countLetterDuplicatesInWord(word) {
  return word
    .split('')
    .reduce(
      (countedLetterDuplicates, letter) => {
        if (!countedLetterDuplicates[letter]) {
          countedLetterDuplicates[letter] = BigInt(0);
        }
        countedLetterDuplicates[letter] += 1n;
        return countedLetterDuplicates;
      },
      {}
    );
}