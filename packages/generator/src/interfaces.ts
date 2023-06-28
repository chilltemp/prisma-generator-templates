export interface Config {
  output: string; // default: ./src/generated/schema.graphql
  template: string; // default: ./template.hbs
  exportedNameSuffix: string;
  exportedNamePrefix: string;
}

export type TypeKind = 'model' | 'field' | 'enum' | 'enumValue';
