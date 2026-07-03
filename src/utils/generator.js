import { hookTemplates } from '../data/hookTemplates.js';
import { painPoints, benefits, numbers } from '../data/wordBank.js';
import { getHashtagsForTopic } from '../data/hashtagBank.js';

let idCounter = Date.now();

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template, topic) {
  let result = template.replace(/\{topic\}/g, topic);
  result = result.replace(/\{pain_point\}/g, pickRandom(painPoints));
  result = result.replace(/\{benefit\}/g, pickRandom(benefits));
  result = result.replace(/\{number\}/g, pickRandom(numbers).toString());
  return result;
}

export function generateHooks(topic, platform, tone, type, count = 5) {
  const platformData = hookTemplates[platform];
  if (!platformData) return [];

  const toneData = platformData[type];
  if (!toneData) return [];

  const templates = toneData[tone] || toneData.casual || [];
  if (templates.length === 0) return [];

  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((template) => {
    const id = `hook_${idCounter++}`;
    return {
      id,
      text: fillTemplate(template, topic),
      platform,
      tone,
      type,
      hashtags: getHashtagsForTopic(topic, 4),
      saved: false,
    };
  });
}

export function generateDemoHooks() {
  const demoTopic = 'social media growth';
  return generateHooks(demoTopic, 'instagram', 'question', 'casual', 3);
}
