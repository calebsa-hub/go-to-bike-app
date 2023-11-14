export const SupportedTypes = {
  INTEGER: {
      value: 'INTEGER',
      type: 'INTEGER',
      default_value: null
  },
  LONG: {
      value: 'LONG',
      type: 'INTEGER',
      default_value: null
  },
  DOUBLE: {
      value: 'DOUBLE',
      type: 'REAL',
      default_value: null
  },
  TEXT: {
      value: 'TEXT',
      type: 'TEXT',
      default_value: null
  },
  BOOLEAN: {
      value: 'BOOLEAN',
      type: 'INTEGER',
      default_value: null
  },
  DATETIME: {
      value: 'DATETIME',
      type: 'TEXT',
      default_value: null
  },
  SYNC_STATUS: {
      value: 'STATUS',
      type: 'TEXT',
      default_value: null
  },
  JSON: {
      value: 'JSON',
      type: 'TEXT',
      default_value: null
  },
};

export const Tables = {
  treinos: {
      nome_treino: {
          type: SupportedTypes.TEXT,
          primary_key: false,
          default_value: null,
      },
      distancia_total: {
          type: SupportedTypes.DOUBLE,
          primary_key: false,
          default_value: null,
      },
      velocidade_media: {
        type: SupportedTypes.DOUBLE,
        primary_key: false,
        default_value: null,
      },
      velocidade_maxima: {
        type: SupportedTypes.DOUBLE,
        primary_key: false,
        default_value: null,
      },
      calorias: {
        type: SupportedTypes.DOUBLE,
        primary_key: false,
        default_value: null,
      },
      ritmo: {
        type: SupportedTypes.DOUBLE,
        primary_key: false,
        default_value: null,
      },
      cadencia: {
        type: SupportedTypes.DOUBLE,
        primary_key: false,
        default_value: null,
      },
      tempo_total: {
        type: SupportedTypes.INTEGER,
        primary_key: false,
        default_value: null,
      },
      data: {
        type: SupportedTypes.DATETIME,
        primary_key: false,
        default_value: null,
      }
  },
};