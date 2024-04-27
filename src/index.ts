import { ElevenLabsClient, PronunciationDictionaryClient, TextToSpeechClient } from 'elevenlabs';
import { play } from 'elevenlabs';
import fs from 'fs';

// Initialize the ElevenLabs client with your API key
const elevenlabs = new ElevenLabsClient({
  apiKey: "YOUR_API_KEY"
});

async function main() {
  // Step 1: Create a Pronunciation Dictionary from an XML file
  const fileStream = fs.createReadStream("/path/to/your/pronunciation-dictionary.xml");
  const dictionaryDetails = await elevenlabs.pronunciationDictionary.addFromFile(fileStream, {
    name: "TomatoDictionary"
  });

  // Step 2: Generate Audio for the word "tomato"
  let audioStream = await elevenlabs.textToSpeech.convertAsStream("VOICE_ID_RACHEL", {
    text: "tomato",
    pronunciationDictionaryId: dictionaryDetails.id
  });
  await play(audioStream);

  // Step 3: Remove the "tomato" rules from the Pronunciation Dictionary
  await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(dictionaryDetails.id, {
    rule_strings: ["tomato", "Tomato"]
  });

  // Step 4: Generate Audio for the word "tomato" after rules removal
  audioStream = await elevenlabs.textToSpeech.convertAsStream("VOICE_ID_RACHEL", {
    text: "tomato"
  });
  await play(audioStream);

  // Step 5: Add again the "tomato" rules to the Pronunciation Dictionary using their phonemes
  await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(dictionaryDetails.id, {
    rules: [
      { string_to_replace: "tomato", type: "phoneme", phoneme: "təˈmeɪtoʊ", alphabet: "ipa" },
      { string_to_replace: "Tomato", type: "phoneme", phoneme: "təˈmeɪtoʊ", alphabet: "ipa" }
    ]
  });

  // Step 6: Generate Audio for the word "tomato" after re-adding phoneme rules
  audioStream = await elevenlabs.textToSpeech.convertAsStream("VOICE_ID_RACHEL", {
    text: "tomato"
  });
  await play(audioStream);
}

main().catch(console.error);
