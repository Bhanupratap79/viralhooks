const hashtagByCategory = {
  general: ['#viral', '#trending', '#foryou', '#explore', '#contentcreator'],
  business: ['#entrepreneur', '#business', '#success', '#marketing', '#growth'],
  tech: ['#tech', '#innovation', '#coding', '#ai', '#future'],
  fitness: ['#fitness', '#workout', '#health', '#motivation', '#gym'],
  food: ['#foodie', '#cooking', '#recipes', '#yummy', '#foodlover'],
  travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'],
  fashion: ['#fashion', '#style', '#outfit', '#trendy', '#ootd'],
  finance: ['#finance', '#money', '#investing', '#wealth', '#cryptocurrency'],
  education: ['#education', '#learning', '#study', '#knowledge', '#skills'],
  music: ['#music', '#singer', '#artist', '#song', '#audios'],
  gaming: ['#gaming', '#gamer', '#twitch', '#esports', '#gameplay'],
  lifestyle: ['#lifestyle', '#selfcare', '#mindset', '#goals', '#inspiration'],
};

export function getHashtagsForTopic(topic, count = 4) {
  let keywords = topic.toLowerCase().split(' ');
  let matched = [];
  for (const [cat, tags] of Object.entries(hashtagByCategory)) {
    if (keywords.some(k => cat.includes(k) || tags.some(t => t.includes(k)))) {
      matched.push(...tags);
    }
  }
  if (matched.length < count) {
    matched.push(...hashtagByCategory.general);
  }
  const shuffled = [...new Set(matched)].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
