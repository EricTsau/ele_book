import {legacySpeechCues} from './speech-cues-legacy.js';
import {speechCuesClassics} from './speech-cues-classics.js';
import {speechCuesOriginals} from './speech-cues-originals.js';
import {speechCuesReflections} from './speech-cues-reflections.js';
export const speechCues={...legacySpeechCues,...speechCuesClassics,...speechCuesOriginals,...speechCuesReflections};
