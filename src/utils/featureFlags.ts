import features from '../../config/features.json';

export const isClaudeSonnetEnabled = (): boolean => {
  return features.ai.claude35Sonnet.enabled && features.ai.claude35Sonnet.defaultForAllClients;
};
