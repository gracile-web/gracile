export const sqlPjson = {
  injectTo: [
    'source.js',
    'source.js.jsx',
    'source.jsx',
    'source.svelte',
    'source.ts',
    'source.tsx',
  ],
  scopeName: 'inline.tagged-template-sql',
  path: './syntaxes/grammar.json',
  embeddedLanguages: {
    'meta.embedded.block.sql': 'sql',
  },
};

export const sqlLang = {
  __COMMENT__:
    'TypeScript patterns are taken from https://github.com/microsoft/vscode/blob/74623bc93c5482cbf6fbb78346167cb39717b703/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json',
  scopeName: 'inline.tagged-template-sql',
  injectionSelector: 'L:source -comment -string',
  patterns: [
    {
      __COMMENT__:
        "Literals tagged with an sql function (including optional accessors and types), e.g. sql<User>('user-by-id')`SELECT ...`",
      begin:
        '(?:([_$[:alpha:]][_$[:alnum:]]*)(?:\\s*(\\??\\.)\\s*(\\#?[_$[:alpha:]][_$[:alnum:]]*))*\\s*(\\??\\.))?\\s*(#?(?i)sql|sqlFragment(?-i))\\s*(?=(?:(\\?\\.\\s*)|(\\!))?((<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))(([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>)*(?<!=)\\>))*(?<!=)\\>)*(?<!=)>\\s*)?\\())',
      beginCaptures: {
        1: { name: 'meta.function-call.ts variable.other.object.ts' },
        2: {
          name: 'meta.function-call.ts punctuation.accessor.optional.ts',
        },
        3: { name: 'meta.function-call.ts variable.other.object.ts' },
        4: {
          name: 'meta.function-call.ts punctuation.accessor.optional.ts',
        },
        5: { name: 'meta.function-call.ts entity.name.function.ts' },
      },
      end: '(?<=(`|\\)\\s*[^\\s`]))',
      patterns: [
        { include: 'source.ts#comment' },
        { include: 'source.ts#function-call-optionals' },
        { include: 'source.ts#type-arguments' },
        { include: 'source.ts#paren-expression' },
        { include: '#embedded-sql' },
      ],
    },
    {
      __COMMENT__:
        'Literals tagged with an sql comment, e.g. /*sql*/`SELECT ...`',
      begin: '(/\\*\\s*(?i)sql(?-i)\\s*\\*/)\\s*(?=`)',
      beginCaptures: {
        1: { name: 'comment.block.ts' },
      },
      end: '(?<=`)',
      patterns: [{ include: '#embedded-sql' }],
    },
    {
      __COMMENT__:
        'Literals tagged with sql (including optional accessors and types), e.g. my.object?.sql<User>`SELECT ...`. This is based on the 1st #template-call pattern in TypeScript.tmLanguage.json',
      name: 'string.template.ts',
      begin:
        '(?=(([_$[:alpha:]][_$[:alnum:]]*\\s*\\??\\.\\s*)*|(\\??\\.\\s*)?)(#?(?i)sql|sqlFragment(?-i))(<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))(([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>)*(?<!=)\\>))*(?<!=)\\>)*(?<!=)>\\s*)?`)',
      end: '(?<=`)',
      patterns: [
        {
          begin:
            '(?=(([_$[:alpha:]][_$[:alnum:]]*\\s*\\??\\.\\s*)*|(\\??\\.\\s*)?)(#?(?i)sql|sqlFragment(?-i)))',
          end: '(?=(<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))(([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>)*(?<!=)\\>))*(?<!=)\\>)*(?<!=)>\\s*)?`)',
          patterns: [
            { include: 'source.ts#support-function-call-identifiers' },
            {
              name: 'entity.name.function.tagged-template.ts',
              match: '(#?(?i)sql|sqlFragment(?-i))',
            },
          ],
        },
        { include: 'source.ts#type-arguments' },
        { include: '#embedded-sql' },
      ],
    },
    {
      __COMMENT__:
        'Literals tagged with sql (including optional types), e.g. sql<User>`SELECT ...`. This is based on the 2nd #template-call pattern in TypeScript.tmLanguage.json',
      name: 'string.template.ts',
      begin:
        '\\b((?i)sql|sqlFragment(?-i))\\s*(?=(<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))(([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>|\\<\\s*(((keyof|infer|awaited|typeof|readonly)\\s+)|(([_$[:alpha:]][_$[:alnum:]]*|(\\{([^\\{\\}]|(\\{([^\\{\\}]|\\{[^\\{\\}]*\\})*\\}))*\\})|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(\\[([^\\[\\]]|(\\[([^\\[\\]]|\\[[^\\[\\]]*\\])*\\]))*\\])|(\\\'([^\\\'\\\\]|\\\\.)*\\\')|(\\"([^\\"\\\\]|\\\\.)*\\")|(\\`([^\\`\\\\]|\\\\.)*\\`))(?=\\s*([\\<\\>\\,\\.\\[]|=>|&(?!&)|\\|(?!\\|)))))([^<>\\(]|(\\(([^\\(\\)]|(\\(([^\\(\\)]|\\([^\\(\\)]*\\))*\\)))*\\))|(?<==)\\>)*(?<!=)\\>))*(?<!=)\\>)*(?<!=)>\\s*)`)',
      beginCaptures: {
        1: { name: 'entity.name.function.tagged-template.ts' },
      },
      end: '(?<=`)',
      patterns: [
        { include: 'source.ts#type-arguments' },
        { include: '#embedded-sql' },
      ],
    },
    {
      __COMMENT__:
        'Literals tagged with sql, e.g. sql`SELECT ...`. This is based on the 2nd #template pattern in TypeScript.tmLanguage.json',
      name: 'string.template.ts',
      begin: '\\b((?i)sql|sqlFragment(?-i))\\s*(?=`)',
      beginCaptures: {
        1: { name: 'entity.name.function.tagged-template.ts' },
      },
      end: '(?<=`)',
      patterns: [{ include: '#embedded-sql' }],
    },
  ],
  repository: {
    'embedded-sql': {
      name: 'string.template.ts',
      contentName: 'meta.embedded.block.sql',
      begin: '`',
      beginCaptures: {
        0: { name: 'punctuation.definition.string.template.begin.js' },
      },
      end: '`',
      endCaptures: {
        0: { name: 'punctuation.definition.string.template.end.js' },
      },
      patterns: [
        { include: 'source.ts#template-substitution-element' },
        { include: 'source.ts#string-character-escape' },
        { include: 'source.sql' },
        { include: 'source.plpgsql.postgres' },
        { match: '.' },
      ],
    },
  },
};
