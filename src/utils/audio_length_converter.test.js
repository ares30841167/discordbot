const { convertAudioLength } = require('./audio_length_converter');

test('Test convertAudioLength', () => {
  expect(convertAudioLength('120')).toBe('00:02:00');
});