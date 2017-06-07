const errorSymbol = Symbol('mdeval error symbol');

export function enhanceError(error: object): object {
  return Object.defineProperty(error, errorSymbol, {
    value: true
  });
}

export function isError(enhancedError: object) {
  return Boolean(enhancedError[errorSymbol]);
}
