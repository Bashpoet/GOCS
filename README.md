# GOCS
## Genetic Oulipian Constraint System (GOCS)
Genetic Oulipian Constraint System

GOCS is a text mutation engine that applies principles from genomics to create Oulipo-style literary constraints. The system takes inspiration from DNA mutation patterns in the 1000 Genomes Project to transform text in structured, rule-based ways.

## Core Concepts

GOCS operates on several key principles derived from genomics:

1. **Nucleotide Mapping**: Letters are mapped to DNA nucleotides (A, G, C, T) based on frequency patterns.
   - A → Vowels: e, a (high-frequency)
   - G → Consonants: r, n, s (common, resonant)
   - C → Consonants: k, t (sharp, frequent)
   - T → Vowels: o, i (mid-to-low frequency)

2. **Transition Matrix**: Text mutations follow genomic transition probabilities:
   - Transitions (A↔G, C↔T) are more common than transversions (e.g., A↔T)
   - Each letter mutation is determined by these probabilities

3. **Word-Level Mutation**: Words undergo systematic letter changes based on nucleotide transitions.

4. **Indels**: Insertions and deletions occur at specific intervals (every 4th or 5th word).

5. **Haplotype Phrases**: Certain word clusters mutate as a single unit.

6. **Coherence Filter**: A mechanism ensures mutated text retains relationship to the original.

## Oulipo Connection

The [Oulipo](https://en.wikipedia.org/wiki/Oulipo) (Ouvroir de littérature potentielle) is a group of writers and mathematicians who create works using constrained writing techniques. GOCS continues this tradition by imposing rigorous, systematic constraints based on genetic principles rather than purely arbitrary rules.

## Example

**Original**: "The poet gazes at the ocean and sighs."

**Mutated**: "Thg pget gczes gst th otegn gnd sghs."

**Readable Adaptation**: "The poet gazes gusts there ocean and sighs."

## Project Structure

The GOCS system consists of:

- **Core Engine**: Base mutation system
- **Extensions**: Specialized mutation patterns (phonetic, epigenetic, multilingual)
- **Web Interface**: Browser-based tool for experimentation
- **CLI Tool**: Command-line interface for batch processing

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/gocs.git
cd gocs
npm install
```

Make the CLI executable:

```bash
chmod +x gocs-cli.js
```

## Usage

### Web Interface

Open `gocs-web-interface.html` in your browser to use the visual interface.

### Command Line

Process a text file:

```bash
./gocs-cli.js input.txt output.txt
```

Use different mutation modes:

```bash
./gocs-cli.js --mode phonetic input.txt
./gocs-cli.js --mode multilingual --population yoruba input.txt
```

## Extensions

### Phonetic GOCS

Applies sound-based mutations rather than just letter-by-letter changes.

### Epigenetic GOCS

Introduces "silencing" of certain words (shown in *italics*) that affect nearby text without being pronounced, mimicking DNA methylation.

### Multilingual GOCS

Incorporates language switching based on population-specific genetic patterns (Yoruba, Han Chinese, European).

## API

```javascript
// Basic usage
const { GOCSMutator } = require('./gocs-implementation.js');
const gocs = new GOCSMutator();
const mutatedText = gocs.mutateText("Your text here");

// Using extensions
const { PhoneticGOCS } = require('./gocs-extensions.js');
const phoneticGOCS = new PhoneticGOCS();
const phoneticallyMutated = phoneticGOCS.mutateText("Your text here");
```

## Development

Modify `gocs-implementation.js` to adjust the core mutation engine, or extend functionality through the extension system.

## License

MIT

---

## File Descriptions

- **gocs-implementation.js**: Core GOCS mutation engine implementation
- **gocs-extensions.js**: Advanced mutations (phonetic, epigenetic, multilingual)
- **gocs-cli.js**: Command-line interface for processing text files
- **gocs-web-interface.html**: Browser-based interactive interface
- **README.md**: This documentation file

## Future Directions

1. **Context-Sensitive Mutations**: Mutations that depend on surrounding words
2. **Historical Text Evolution**: Model multiple generations of mutations 
3. **Pattern Recognition**: Detect and preserve poetic structures during mutation
4. **Poetry-Specific Modes**: Special handling for meter, rhyme, and other poetic features
