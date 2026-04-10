module.exports = {
  TextDecoder: global.TextDecoder,
  TextEncoder: global.TextEncoder,
  TextDecoderStream: global.TextDecoderStream,
  TextEncoderStream: global.TextEncoderStream,
  normalizeEncoding: (x) => x,
  getBOMEncoding: () => null,
  labelToName: (x) => x,
  legacyHookDecode: () => null,
  isomorphicDecode: () => '',
  isomorphicEncode: () => new Uint8Array(),
};
