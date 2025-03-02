// Genetic Oulipian Constraint System (GOCS) Implementation
// A text mutation engine based on genomic transition principles

class GOCSMutator {
  constructor() {
    // Nucleotide-to-Letter Mapping
    this.nucleotideMap = {
      A: ['e', 'a'], // Vowels: high-frequency
      G: ['r', 'n', 's'], // Common consonants
      C: ['k', 't'], // Sharp consonants
      T: ['o', 'i'] // Mid-to-low frequency vowels
    };

    // Reverse mapping to find nucleotide from letter
    this.letterToNucleotide = {};
    Object.entries(this.nucleotideMap).forEach(([nucleotide, letters]) => {
      letters.forEach(letter => {
        this.letterToNucleotide[letter] = nucleotide;
      });
    });

    // Transition Matrix (based on genomic mutation frequencies)
    this.transitionMatrix = {
      A: { G: 0.4, C: 0.1, T: 0.1, A: 0.4 }, // A→G transition is common
      G: { A: 0.4, C: 0.1, T: 0.1, G: 0.4 },
      C: { T: 0.4, A: 0.1, G: 0.1, C: 0.4 }, // C→T transition is common
      T: { C: 0.4, A: 0.1, G: 0.1, T: 0.4 }
    };

    // Haplotype phrases (word clusters that mutate as a unit)
    this.haplotypeList = [
      "the quick brown fox",
      "once upon a time",
      "in the beginning",
      "by the shore"
    ];
  }

  // Get a target nucleotide based on transition probabilities
  getTransitionTarget(nucleotide) {
    const rand = Math.random();
    let cumulativeProb = 0;
    
    for (const [target, prob] of Object.entries(this.transitionMatrix[nucleotide])) {
      cumulativeProb += prob;
      if (rand <= cumulativeProb) {
        return target;
      }
    }
    
    return nucleotide; // Default case
  }

  // Get a random letter from the nucleotide's mapping
  getLetterFromNucleotide(nucleotide) {
    const letters = this.nucleotideMap[nucleotide];
    return letters[Math.floor(Math.random() * letters.length)];
  }

  // Apply word-level mutation based on nucleotide transitions
  mutateWord(word, isHighMutationZone = false) {
    const maxMutations = isHighMutationZone ? 2 : 1;
    let mutationCount = 0;
    let mutatedWord = '';
    
    for (let i = 0; i < word.length; i++) {
      const letter = word[i].toLowerCase();
      const nucleotide = this.letterToNucleotide[letter];
      
      // If letter maps to a nucleotide and we haven't reached mutation limit
      if (nucleotide && mutationCount < maxMutations) {
        const targetNucleotide = this.getTransitionTarget(nucleotide);
        if (targetNucleotide !== nucleotide) {
          mutatedWord += this.getLetterFromNucleotide(targetNucleotide);
          mutationCount++;
          continue;
        }
      }
      
      // Keep original letter if no mutation occurs
      mutatedWord += word[i];
    }
    
    return mutatedWord;
  }

  // Handle indels (insertions and deletions)
  applyIndel(word, position, type) {
    if (type === 'deletion' && word.length > 2) {
      // Delete a letter or syllable (simplified as a letter)
      const deletePos = Math.floor(Math.random() * word.length);
      return word.slice(0, deletePos) + word.slice(deletePos + 1);
    } else if (type === 'insertion') {
      // Insert a "pseudo-codon" (simplified as a random letter)
      const insertPos = Math.floor(Math.random() * (word.length + 1));
      const randomNucleotide = ['A', 'G', 'C', 'T'][Math.floor(Math.random() * 4)];
      const insertLetter = this.getLetterFromNucleotide(randomNucleotide);
      return word.slice(0, insertPos) + insertLetter + word.slice(insertPos);
    }
    return word;
  }

  // Check if a phrase is a haplotype
  isHaplotype(phrase) {
    return this.haplotypeList.some(haplotype => 
      phrase.toLowerCase().includes(haplotype.toLowerCase())
    );
  }

  // Apply sentence-level evolution
  mutateSentence(sentence) {
    let words = sentence.split(' ');
    let mutatedWords = [];
    let silentMutation = false;
    
    // Check for haplotypes first
    let inHaplotype = false;
    let currentHaplotype = '';
    let haplotypeMutated = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Check if we're continuing a haplotype
      if (inHaplotype) {
        currentHaplotype += ' ' + word;
        // Check if the haplotype is complete
        if (this.haplotypeList.some(h => h === currentHaplotype.toLowerCase())) {
          // Mutate the haplotype as a unit
          haplotypeMutated = this.mutateHaplotype(currentHaplotype);
          mutatedWords.push(haplotypeMutated);
          inHaplotype = false;
          currentHaplotype = '';
          continue;
        }
      }
      
      // Check if this word starts a haplotype
      const potentialHaplotype = this.haplotypeList.find(h => 
        h.toLowerCase().startsWith(word.toLowerCase())
      );
      
      if (potentialHaplotype && !inHaplotype) {
        inHaplotype = true;
        currentHaplotype = word;
        continue;
      }
      
      // Regular word mutation
      const isHighMutationZone = (i + 1) % 3 === 0;
      let mutatedWord = this.mutateWord(word, isHighMutationZone);
      
      // Apply indels
      if ((i + 1) % 5 === 0) {
        mutatedWord = this.applyIndel(mutatedWord, i, 'deletion');
      }
      if ((i + 1) % 4 === 0) {
        mutatedWord = this.applyIndel(mutatedWord, i, 'insertion');
      }
      
      // Check for silent mutation (5% chance)
      if (Math.random() < 0.05) {
        silentMutation = true;
      }
      
      mutatedWords.push(mutatedWord);
    }
    
    // Apply sentence-level transitions and silent mutations
    if (silentMutation && mutatedWords.length > 2) {
      // Simple syntax reordering: swap two adjacent words
      const pos = Math.floor(Math.random() * (mutatedWords.length - 1));
      [mutatedWords[pos], mutatedWords[pos+1]] = [mutatedWords[pos+1], mutatedWords[pos]];
    }
    
    return mutatedWords.join(' ');
  }

  // Mutate a haplotype phrase as a unit
  mutateHaplotype(haplotype) {
    // For haplotypes, we'll mutate consonants while preserving structure
    return haplotype.split(' ')
      .map(word => this.mutateWord(word, true))
      .join(' ');
  }

  // Apply mutation filter for coherence
  makeCoherent(mutatedText, originalText) {
    // Simplified coherence: ensure 50% recognizability
    const mutatedWords = mutatedText.split(' ');
    const originalWords = originalText.split(' ');
    
    // Process each word to ensure some coherence
    for (let i = 0; i < Math.min(mutatedWords.length, originalWords.length); i++) {
      const mutWord = mutatedWords[i];
      const origWord = originalWords[i];
      
      // If too different, restore some elements
      if (this.calculateDifference(mutWord, origWord) > 0.5) {
        // Preserve at least the first letter
        mutatedWords[i] = origWord[0] + mutWord.slice(1);
      }
    }
    
    return mutatedWords.join(' ');
  }

  // Calculate difference ratio between words
  calculateDifference(word1, word2) {
    const len = Math.max(word1.length, word2.length);
    let diffCount = 0;
    
    for (let i = 0; i < len; i++) {
      if (i >= word1.length || i >= word2.length || word1[i] !== word2[i]) {
        diffCount++;
      }
    }
    
    return diffCount / len;
  }

  // Main function to apply the GOCS to a text
  mutateText(text) {
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Apply mutations to each sentence
    const mutatedSentences = sentences.map(sentence => {
      const mutated = this.mutateSentence(sentence);
      return this.makeCoherent(mutated, sentence);
    });
    
    return mutatedSentences.join(' ');
  }

  // Generate a visual representation of the transition matrix
  visualizeMatrix() {
    let visualization = "GOCS Transition Matrix:\n\n";
    visualization += "   | A    | G    | C    | T    |\n";
    visualization += "---|------|------|------|------|\n";
    
    for (const [from, targets] of Object.entries(this.transitionMatrix)) {
      visualization += ` ${from} |`;
      for (const nucleotide of ['A', 'G', 'C', 'T']) {
        const prob = (targets[nucleotide] * 100).toFixed(0);
        visualization += ` ${prob}%  |`;
      }
      visualization += "\n";
    }
    
    return visualization;
  }
}

// Example usage
const gocs = new GOCSMutator();

// Function to run a demonstration
function runGOCSDemo(inputText) {
  console.log("Original Text:");
  console.log(inputText);
  console.log("\nTransition Matrix:");
  console.log(gocs.visualizeMatrix());
  
  console.log("\nMutated Text:");
  const mutated = gocs.mutateText(inputText);
  console.log(mutated);
  
  return {
    original: inputText,
    matrix: gocs.visualizeMatrix(),
    mutated: mutated
  };
}

// Expose the engine for testing
module.exports = {
  GOCSMutator,
  runGOCSDemo
};
