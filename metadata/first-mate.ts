export default {
    content: { "first-mate.Grammar": ['name: string;'] },
    moduleContent: {
        "first-mate": [
            'class ScopeSelector extends FirstMate.ScopeSelector {}',
            'class GrammarRegistry extends FirstMate.GrammarRegistry {}',
            'class Grammar extends FirstMate.Grammar {}'
        ]
    }
};
