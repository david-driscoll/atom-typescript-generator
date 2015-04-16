import * as _ from 'lodash'
function makeProperty(name: string) {
    return `static ${name}(...args : any[]) : Builder;`;
}

var spacePenStaticProperties = _.sortBy(_.unique(`
 a abbr address article aside audio b bdi bdo blockquote body button canvas
 caption cite code colgroup datalist dd del details dfn dialog div dl dt em
 fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header html i
 iframe ins kbd label legend li main map mark menu meter nav noscript object
 ol optgroup option output p pre progress q rp rt ruby s samp script section
 select small span strong style sub summary sup table tbody td textarea tfoot
 th thead time title tr u ul var video area base br col command embed hr img
 input keygen link meta param source track wbr area base br col command embed
 hr img input keygen link meta param source track wbr`.split(/\s+/))).filter(z => !!z).map(makeProperty);

export default {
    content: { "space-pen.View": spacePenStaticProperties },
    moduleContent: {
        "space-pen": [
            'var jQuery : JQueryStatic;',
            'var $ : JQueryStatic;',
            'function $$$(fn: Function): JQuery;',
            'function $$$$$(fn: Function): Node;'
        ],
        "atom-space-pen-views": [
            'var jQuery : JQueryStatic;',
            'var $ : JQueryStatic;',
            'function $$$(fn: Function): JQuery;',
            'function $$$$$(fn: Function): Node;'
        ]
    }
};
