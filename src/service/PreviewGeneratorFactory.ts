import { PreviewGenerator } from './PreviewGeneratorService';

class PreviewGeneratoryFactory {
  private generators: { [key: string]: PreviewGenerator } = {};

  register(mime_type: string, generatorInstance: PreviewGenerator) {
    this.generators[mime_type] = generatorInstance;
  }

  generate(mime_type: string) {
    return this.generators[mime_type];
  }
}

export { PreviewGeneratoryFactory };
