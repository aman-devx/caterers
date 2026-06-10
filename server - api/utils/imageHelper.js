function img(seed, w = 800, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

module.exports = { img };
