#!/usr/bin/env node

/**
 * GOCS CLI - Command Line Interface for the Genetic Oulipian Constraint System
 * Provides a simple way to apply GOCS mutations to text files
 */

const fs = require('fs');
const path = require('path');
const { GOCSMutator } = require('./gocs-implementation.js');
const { PhoneticGOCS, EpigeneticGOCS, MultilingualGOCS } = require('./gocs-extensions.js');

// Process command line arguments
const args = process.argv.slice(2);

// Display help message if no arguments or help flag is present
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
GOCS - Genetic Oulipian Constraint System
=========================================

A text mutation tool based on genomic patterns and Oulipo principles.

Usage:
  gocs [options] <input-file> [output-file]

Options:
  --help, -h          Show this help message
  --mode, -m          Mutation mode (default, phonetic, epigenetic, multilingual)
  --viz, -v           Visualize the transition matrix
  --population, -p    Set population for multilingual mode (yoruba, han, european)
  --strength, -s      Mutation strength (0.0-1.0)
  --preserve, -P      Preserve formatting (preserves line breaks and spacing)

Examples:
  gocs input.txt                      # Output mutations to console
  gocs input.txt output.txt           # Save mutations to file
  gocs -m phonetic input.txt          # Use phonetic mutation mode
  gocs -m multilingual -p yoruba      # Use Yoruba population profile
  gocs -s 0.8 input.txt               # Use stronger mutation rate
  `);
  process.exit(0);
}

// Parse options
let inputFile = null;
let outputFile = null;
let mode = 'default';
let visualize = false;
let population = 'european';
let strength = 0.5;
let preserveFormat = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--mode' || arg === '-m') {
    mode = args[++i];
  } else if (arg === '--viz' || arg === '-v') {
    visualize = true;
  } else if (arg === '--population' || arg === '-p') {
    population = args[++i];
  } else if (arg === '--strength' || arg === '-s') {
    strength = parseFloat(args[++i]);
  } else if (arg === '--preserve' || arg === '-P') {
    preserveFormat = true;
  } else if (!inputFile) {
    inputFile = arg;
  } else if (!outputFile) {
    outputFile = arg;
  }
}

// Validate input file
if (!inputFile) {
  console.error('Error: Input file is required.');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file "${inputFile}" not found.`);
  process.exit(1);
}

// Initialize the appropriate GOCS engine
let gocs;
switch (mode) {
  case 'phonetic':
    gocs = new PhoneticGOCS();
    console.log('Using Phonetic GOCS mode');
    break;
  case 'epigenetic':
    gocs = new EpigeneticGOCS();
    console.log('Using Epigenetic GOCS mode');
    break;
  case 'multilingual':
    gocs = new MultilingualGOCS();
    gocs.setPopulation(population);
    console.log(`Using Multilingual GOCS mode with ${population} population`);
    break;
  default:
    gocs = new GOCSMutator();
    console.log('Using standard GOCS mode');
}

// Display the transition matrix if requested
if (visualize) {
  console.log('\nTransition Matrix:');
  console.log(gocs.visualizeMatrix());
}

// Read the input file
try {
  const text = fs.readFileSync(inputFile, 'utf8');
  
  // Process the text
  let mutatedText;
  
  if (preserveFormat) {
    // Preserve line breaks and paragraphs by processing each line separately
    const lines = text.split(/\r?\n/);
    mutatedText = lines.map(line => {
      if (line.trim() === '') return line; // Preserve empty lines
      return gocs.mutateText(line);
    }).join('\n');
  } else {
    // Process the text as a whole
    mutatedText = gocs.mutateText(text);
  }
  
  // Output the result
  if (outputFile) {
    fs.writeFileSync(outputFile, mutatedText);
    console.log(`Mutated text saved to ${outputFile}`);
  } else {
    console.log('\nMutated Text:');
    console.log('==============');
    console.log(mutatedText);
  }
  
} catch (error) {
  console.error(`Error processing file: ${error.message}`);
  process.exit(1);
}
