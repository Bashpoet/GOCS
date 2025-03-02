// GOCS Extensions - Advanced mutation patterns

// Import the base GOCS engine
const { GOCSMutator } = require('./gocs-implementation.js');

/**
 * PhoneticGOCS - Extension that applies mutations based on phonetic relationships
 * Instead of just letter-to-letter transitions, this applies sound-based transformations
 */
class PhoneticGOCS extends GOCSMutator {
  constructor() {
    super();
    // Phoneme mapping (simplified IPA representation)
    this.phonemeMap = {
      // Vowels
      'a': { sound: '/æ/', category: 'vowel', neighbors: ['e', 'o'] },
      'e': { sound: '/ɛ/', category: 'vowel', neighbors: ['a', 'i'] },
      'i': { sound: '/ɪ/', category: 'vowel', neighbors: ['e', 'u'] },
      'o': { sound: '/ɒ/', category: 'vowel', neighbors: ['a', 'u'] },
      'u': { sound: '/ʌ/', category: 'vowel', neighbors: ['o', 'i'] },
      
      // Consonants
      'p': { sound: '/p/', category: 'stop', neighbors: ['b', 't'] },
      'b': { sound: '/b/', category: 'stop', neighbors: ['p', 'd'] },
      't': { sound: '/t/', category: 'stop', neighbors: ['d', 'k'] },
      'd': { sound: '/d/', category: 'stop', neighbors: ['t', 'g'] },
      'k': { sound: '/k/', category: 'stop', neighbors: ['g', 't'] },
      'g': { sound: '/g/', category: 'stop', neighbors: ['k', 'd'] },
      
      // Fricatives
      'f': { sound: '/f/', category: 'fricative', neighbors: ['v', 'th'] },
      'v': { sound: '/v/', category: 'fricative', neighbors: ['f', 'z'] },
      's': { sound: '/s/', category: 'fricative', neighbors: ['z', 'sh'] },
      'z': { sound: '/z/', category: 'fricative', neighbors: ['s', 'v'] },
      
      // Liquids & Nasals
      'l': { sound: '/l/', category: 'liquid', neighbors: ['r'] },
      'r': { sound: '/ɹ/', category: 'liquid', neighbors: ['l'] },
      'm': { sound: '/m/', category: 'nasal', neighbors: ['n'] },
      'n': { sound: '/n/', category: 'nasal', neighbors: ['m', 'ng'] }
    };
    
    // Phonological rules for mutation
    this.phonoRules = [
      // Vowel raising
      { pattern: /([aeiou])([mn])/, replacement: (match, vowel, nasal) => {
        // Raise vowel before nasal
        const vowelMap = { 'a': 'e', 'e': 'i', 'o': 'u' };
        return (vowelMap[vowel] || vowel) + nasal;
      }},
      
      // Consonant voicing between vowels
      { pattern: /([aeiou])([ptkfsθ])([aeiou])/, replacement: (match, v1, cons, v2) => {
        const voicingMap = { 'p': 'b', 't': 'd', 'k': 'g', 'f': 'v', 's': 'z', 'θ': 'ð' };
        return v1 + (voicingMap[cons] || cons) + v2;
      }},
      
      // Final devoicing
      { pattern: /([bdgvzð])$/, replacement: (match, cons) => {
        const devoicingMap = { 'b': 'p', 'd': 't', 'g': 'k', 'v': 'f', 'z': 's', 'ð': 'θ' };
        return devoicingMap[cons] || cons;
      }}
    ];
  }
  
  // Override the mutation logic to use phonetics
  mutateWord(word, isHighMutationZone = false) {
    // First apply basic nucleotide mutations
    let mutatedWord = super.mutateWord(word, isHighMutationZone);
    
    // Then apply phonological rules
    for (const rule of this.phonoRules) {
      if (Math.random() < 0.3) { // Apply rule with 30% chance
        mutatedWord = mutatedWord.replace(rule.pattern, rule.replacement);
      }
    }
    
    // Ensure pronounceability by checking consonant clusters
    mutatedWord = this.ensurePronounceability(mutatedWord);
    
    return mutatedWord;
  }
  
  // Ensure word is pronounceable by avoiding impossible consonant clusters
  ensurePronounceability(word) {
    // Break up difficult consonant clusters
    const difficultClusters = /([ptkbdg][ptkbdg][ptkbdg])/g;
    return word.replace(difficultClusters, (match) => {
      return match.charAt(0) + 'e' + match.slice(1);
    });
  }
}

/**
 * EpigeneticGOCS - Adds "silencing" patterns to text based on epigenetic principles
 * Some words are marked as "methylated" (suppressed) but still influence the text structure
 */
class EpigeneticGOCS extends GOCSMutator {
  constructor() {
    super();
    // Methylation patterns - words that are candidates for silencing
    this.methylationPatterns = [
      // Words that tend to be methylated (suppressed)
      {
        pattern: /\b(very|really|quite|just|simply|actually|literally)\b/i,
        methylationProb: 0.7
      },
      // Adjectives are sometimes suppressed
      {
        pattern: /\b([a-z]+)(ful|ous|ive|able|ible)\b/i,
        methylationProb: 0.4
      },
      // Function words can be silenced
      {
        pattern: /\b(the|a|an|in|on|at|to|for|with|by)\b/i,
        methylationProb: 0.2
      }
    ];
    
    // Keep track of methylated words
    this.methylatedWords = new Set();
  }
  
  // Override the sentence mutation to handle epigenetic silencing
  mutateSentence(sentence) {
    // Clear previous methylation state
    this.methylatedWords.clear();
    
    // First identify words to be methylated
    const words = sentence.split(' ');
    const methylationStatus = words.map(word => {
      for (const pattern of this.methylationPatterns) {
        if (pattern.pattern.test(word) && Math.random() < pattern.methylationProb) {
          this.methylatedWords.add(word);
          return true;
        }
      }
      return false;
    });
    
    // Apply regular mutations
    let mutatedSentence = super.mutateSentence(sentence);
    
    // Mark methylated words (e.g., with italics using markdown syntax)
    let mutatedWords = mutatedSentence.split(' ');
    
    // Words may have been reordered due to other mutations, so we match by original word
    mutatedWords = mutatedWords.map((mutatedWord, i) => {
      const originalWord = words[Math.min(i, words.length - 1)];
      if (this.methylatedWords.has(originalWord)) {
        return `*${mutatedWord}*`; // Italicize methylated words
      }
      return mutatedWord;
    });
    
    // Methylated words still influence sentence structure
    // For example, a methylated adjective still makes the following noun more likely to mutate
    for (let i = 0; i < mutatedWords.length - 1; i++) {
      if (mutatedWords[i].startsWith('*') && mutatedWords[i].endsWith('*')) {
        // The next word after a methylated word has increased mutation likelihood
        if (Math.random() < 0.6) {
          mutatedWords[i + 1] = this.mutateWord(mutatedWords[i + 1].replace(/[*]/g, ''), true);
        }
      }
    }
    
    return mutatedWords.join(' ');
  }
}

/**
 * MultilingualGOCS - Incorporates language switching based on population-specific genetic patterns
 * Different genetic populations have different mutation patterns
 */
class MultilingualGOCS extends GOCSMutator {
  constructor() {
    super();
    
    // Population-specific mutation patterns
    this.populationProfiles = {
      yoruba: {
        // Higher A→G transitions
        transitionMatrix: {
          A: { G: 0.6, C: 0.1, T: 0.1, A: 0.2 },
          G: { A: 0.3, C: 0.1, T: 0.1, G: 0.5 },
          C: { T: 0.4, A: 0.1, G: 0.1, C: 0.4 },
          T: { C: 0.4, A: 0.1, G: 0.1, T: 0.4 }
        },
        // Yoruba vocabulary that can be incorporated
        vocabulary: [
          { trigger: 'water', word: 'omi' },
          { trigger: 'house', word: 'ile' },
          { trigger: 'person', word: 'eniyan' },
          { trigger: 'food', word: 'ounje' },
          { trigger: 'good', word: 'dara' }
        ]
      },
      
      han: {
        // More balanced transitions
        transitionMatrix: {
          A: { G: 0.3, C: 0.2, T: 0.2, A: 0.3 },
          G: { A: 0.3, C: 0.2, T: 0.2, G: 0.3 },
          C: { T: 0.3, A: 0.2, G: 0.2, C: 0.3 },
          T: { C: 0.3, A: 0.2, G: 0.2, T: 0.3 }
        },
        // Mandarin vocabulary
        vocabulary: [
          { trigger: 'mountain', word: 'shān' },
          { trigger: 'water', word: 'shuǐ' },
          { trigger: 'person', word: 'rén' },
          { trigger: 'book', word: 'shū' },
          { trigger: 'good', word: 'hǎo' }
        ]
      },
      
      european: {
        // Higher C→T transitions
        transitionMatrix: {
          A: { G: 0.4, C: 0.1, T: 0.1, A: 0.4 },
          G: { A: 0.4, C: 0.1, T: 0.1, G: 0.4 },
          C: { T: 0.5, A: 0.1, G: 0.1, C: 0.3 },
          T: { C: 0.3, A: 0.1, G: 0.1, T: 0.5 }
        },
        // French vocabulary
        vocabulary: [
          { trigger: 'water', word: 'eau' },
          { trigger: 'house', word: 'maison' },
          { trigger: 'person', word: 'personne' },
          { trigger: 'book', word: 'livre' },
          { trigger: 'good', word: 'bon' }
        ]
      }
    };
    
    // Start with a random population
    this.activePopulation = 'european';
  }
  
  // Set the active population profile
  setPopulation(population) {
    if (this.populationProfiles[population]) {
      this.activePopulation = population;
      // Update the transition matrix
      this.transitionMatrix = this.populationProfiles[population].transitionMatrix;
      return true;
    }
    return false;
  }
  
  // Override mutate text to include linguistic switching
  mutateText(text) {
    // First pass: identify trigger words that might switch the population
    const words = text.split(/\s+/);
    
    for (const word of words) {
      for (const [population, profile] of Object.entries(this.populationProfiles)) {
        for (const vocabItem of profile.vocabulary) {
          if (word.toLowerCase() === vocabItem.trigger.toLowerCase() && Math.random() < 0.4) {
            this.setPopulation(population);
            break;
          }
        }
      }
    }
    
    // Second pass: replace some words with foreign vocabulary
    let modifiedText = text;
    const profile = this.populationProfiles[this.activePopulation];
    
    for (const vocabItem of profile.vocabulary) {
      const regex = new RegExp(`\\b${vocabItem.trigger}\\b`, 'gi');
      if (Math.random() < 0.3) { // 30% chance to replace with foreign word
        modifiedText = modifiedText.replace(regex, vocabItem.word);
      }
    }
    
    // Apply standard mutations with the active population's transition matrix
    return super.mutateText(modifiedText);
  }
}

/**
 * Create a combined extension that uses multiple mutation strategies
 */
class CombinedGOCS {
  constructor() {
    this.phonetic = new PhoneticGOCS();
    this.epigenetic = new EpigeneticGOCS();
    this.multilingual = new MultilingualGOCS();
    
    // Set the active engine
    this.activeEngine = this.phonetic;
  }
  
  setEngine(engineType) {
    switch (engineType) {
      case 'phonetic':
        this.activeEngine = this.phonetic;
        break;
      case 'epigenetic':
        this.activeEngine = this.epigenetic;
        break;
      case 'multilingual':
        this.activeEngine = this.multilingual;
        break;
      default:
        this.activeEngine = this.phonetic;
    }
  }
  
  setPopulation(population) {
    if (this.activeEngine === this.multilingual) {
      return this.multilingual.setPopulation(population);
    }
    return false;
  }
  
  mutateText(text) {
    return this.activeEngine.mutateText(text);
  }
  
  visualizeMatrix() {
    return this.activeEngine.visualizeMatrix();
  }
}

// Export the extensions
module.exports = {
  PhoneticGOCS,
  EpigeneticGOCS,
  MultilingualGOCS,
  CombinedGOCS
};
