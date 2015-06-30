module.exports = function (window) {
    "use strict";

    require('itags.core')(window);

    var pseudoName = 'multisource', // <-- define your own pseudo-name here
        superClassName = 'i-table', // <-- define the itag-name of the superClass here
        itagName = superClassName+'#'+pseudoName, // <-- define the itag-name of the superClass here
        Itag, ISuperClass;

    if (!window.ITAGS[itagName]) {
        ISuperClass = require('i-table')(window);  // <-- define the itag-name of the superClass here NOT by variable, for browserify wouldn't load it

        Itag = ISuperClass.pseudoClass(pseudoName, {
            cellContent: function(col, oneItem, rowIndex, colIndex) {
                var element = this,
                    colSource = col.source,
                    differentSource = colSource && (colSource>1),
                    item = differentSource ? element.model['items'+colSource][rowIndex] : oneItem,
                    superCellContent = element.$superProp('cellContent', col, item, rowIndex, colIndex, 'data-source="'+(differentSource ? colSource : 1)+'"');
                superCellContent.source = colSource;
                return superCellContent;
            },

            getItems: function(tdNode) {
                var source = tdNode.getAttr('data-source') || '';
                return this.model['items'+source];
            },

            cellClass: function(oneItem, classFormatter, index, cellContentObj) {
                var element = this,
                    source = cellContentObj.source,
                    item = source ? this.model['items'+source][index] : oneItem;
                return element.$superProp('cellClass', item, classFormatter, index);
            },

            templater: function(item, formatter, index) {
                var element = this,
                    model = element.model,
                    i, items, clonedItem;
                clonedItem = item.deepClone();
/*jshint boss:true */
                for (i=1; items=model['items'+((i===1) ? '' : i)]; i++) {
/*jshint boss:false */
                    clonedItem['$'+i] = items[index];
                }
                return element.$superProp('templater', clonedItem, formatter);
            }

        });

        window.ITAGS[itagName] = Itag;
    }

    return window.ITAGS[itagName];
};
