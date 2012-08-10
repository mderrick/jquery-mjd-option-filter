/*
* jQuery Option Filter v0.0.1
*
* Copyright (c) 2012 Matt Derrick
* http://www.mattderrick.co.uk
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

(function ($) {
    "use strict";
    var instances = 0;
        
    $.widget("mjd.optionFilter", {

        options: {
            name: 'option-filter',
            afterChange: $.noop,
            beforeChange: $.noop
        },

        _create: function () {

            var self = this;

            this._objects();

            this.events();

            this.init();
            
            instances++;
        },

        _objects: function () {
            var self = this;

            this.objects = {};

            this.objects.selectLists = this.element.find('.' + this.options.name + '-select');

            this.objects.mainArray = {};

            self.createArrayObject();

            return;
        },

        events: function () {
            
            var self = this;

            /* Select box change event */
            self.element.delegate('.' + this.options.name + '-select', 'change', function (e) {
                var selectList = $(this),
                    selectName = selectList.attr('name');

                if (selectList.find(':selected').hasClass(self.options.name + '-placeholder')) {
                        
                    /* If placeholder is clicked */
                    var id = self.objects.mainArray[selectName]['data-option-filter-id'] - 1;

                    if (id < 0) {
                                /* If first list placeholder clicked reset them all */
                        self.resetAllLists();
                    } else {
                        /* Otherwise update lists from previous clicked element */
                        self.updateLists(self.getElementByData(id));
                    }
                            
                } else {
                    self.updateLists(selectList);
                }
            });

        },

        init: function () {
            /* Filter lists on page load by finding last selected option in all the lists and running update lists */
            var lastSelectedList = this.objects.selectLists.find(':selected')
                .not('.' + this.options.name + '-placeholder')
                .last()
                .closest('.' + this.options.name + '-select');

            if (lastSelectedList.length) {
                this.updateLists(lastSelectedList);
            }
        },

        getElementByData: function (id) {
            var element;
            
            this.element.find('.' + this.options.name + '-select').each(function () {
                var obj = $(this);
                if (obj.data('option-filter-id') == id) { element = obj; }
            });

            return element;
        },

        createArrayObject: function () {
            var self = this;

            self.objects.selectLists.each(function (i) {
                var select = $(this),
                    selectName = select.attr('name'),
                    selectId = select.data('option-filter-id'),
                    optionArray = {};

                optionArray.values = [];
                optionArray.placeholder = select.find('.' + self.options.name + '-placeholder').html();

                $.each(select[0].attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;
                    optionArray[name] = attrib.value;
                });
                    
                select.find('option').each(function (j) {
                    var option = $(this);

                    if (!option.hasClass(self.options.name + '-placeholder')) {
                        var optionObject = {
                            name: option.html(),
                            classArray: (option.attr('class') == null) ? [] : option.attr('class').split(" ")
                        };
                            
                        $.each(option[0].attributes, function (i, attrib) {
                            var name = attrib.name;
                            var value = attrib.value;
                            optionObject[name] = attrib.value;
                        });
                            
                        optionArray.values.push(optionObject);
                    }

                });

                self.objects.mainArray[selectName] = optionArray;
            });
        },

        updateLists: function (obj) {
            var self = this,
                currentOption = obj.find(':selected'),
                currentId = obj.data('option-filter-id'),
                currentValue = currentOption.val(),
                currentClassChain =  (currentOption.attr('class') == null) ? "" : currentOption.attr('class'),
                currentClasses = currentClassChain.split(' '),
                currentList = obj.attr('name'),
                newArray = [];

                /* Iterate Lists */
            $.each(this.objects.mainArray, function (listKey, listObj) {
                
                /* If placeholder has been clicked, reset all selects that are after the currently clicked one */
                if (currentId >= listObj['data-option-filter-id'] && currentClassChain == self.options.name + '-placeholder') {
                    return;
                }

                /* Add Placeholder back into select list here */
                newArray[listKey] = '<option class="' + self.options.name + '-placeholder">' + listObj.placeholder + '</option>';

                /* Iterate Values in List */
                $.each(listObj.values, function (optionKey, optionObj) {

                    var optionObjClass = optionObj.class,
                        optionObjClassArray = optionObj.classArray,
                        optionObjName = optionObj.name,
                        optionObjValue = optionObj.value,
                        optionString = "",
                        selectedAttr = 'selected="selected"';

                    /* If not first list then remove options with this logic */
                    if (listObj['data-option-filter-id'] != 0) {
                        
                        if (listObj['data-option-filter-id'] > currentId) {
                            /* Update selects AFTER current selected option list */
                            $.each(optionObjClassArray, function (undefined, cssClass) {
                                if (cssClass == currentValue.split(' ').join('-')) {
                                    newArray[listKey] += "<option value='" + optionObjValue + "' class='" + optionObjClass + "'>" + optionObjName + "</option>";
                                }
                            });
                        }

                        if (listObj['data-option-filter-id'] < currentId) {
                            /* This is when you update PREVIOUS selects */
                            if (listObj['data-option-filter-id'] < currentId) {
                                selectedAttr = 'selected="selected"';
                                if (currentClasses[listObj['data-option-filter-id']] != optionObjValue.split(' ').join('-')) {
                                    selectedAttr = "";
                                }

                                if (currentClasses[listObj['data-option-filter-id'] - 1] == optionObj.classArray[listObj['data-option-filter-id'] - 1]) {
                                    newArray[listKey] += "<option value='" + optionObjValue + "' " + selectedAttr + " class='" + optionObjClass + "'>" + optionObjName + "</option>";

                                }
                            }
                        }
                        
                        if (currentId == listObj['data-option-filter-id']) {
                            /* Filter current list to show only options that have the same class as the clicked option and set selected attribute */
                            selectedAttr = 'selected="selected"';
                            if (optionObjClass == currentClassChain) {
                                if (currentValue != optionObjValue) { selectedAttr = ''; }
                                newArray[listKey] += "<option value='" + optionObjValue + "' " + selectedAttr + " class='" + optionObjClass + "'>" + optionObjName + "</option>";
                            }
                        }
                        
                    } else {
                        /* If list 0 then include all options and set selected */
                        selectedAttr = 'selected="selected"';
                        if ((currentId != 0 && currentClasses[0] != optionObjValue.split(' ').join('-')) || (currentId == 0 && currentValue != optionObjValue)) { selectedAttr = ''; }
                        newArray[listKey] += "<option value='" + optionObjValue + "' " + selectedAttr + ">" + optionObjName + "</option>";
                    }
                    
                });
                
                self.replaceList(listKey, newArray[listKey]);

            });
            
        },

        resetAllLists: function () {
            var self = this;
            $.each(this.objects.mainArray, function (listKey, listObj) {
                self.resetList(listKey);
            });
        },

        resetList: function (listName) {
            var self = this,
                arrayListObj = this.objects.mainArray[listName],
                string = '<option class="' + self.options.name + '-placeholder" selected="selected">' + arrayListObj.placeholder + '</option>';
                
            $.each(arrayListObj.values, function (optionKey, optionObj) {

                string += "<option value='" + optionObj.value + "' class='" + optionObj.class + "'>" + optionObj.name + "</option>";
            });

            self.replaceList(listName, string);
        },

        replaceList: function (listName, string) {
            
            this.options.beforeChange({
                objects : this.objects,
                selectName : listName
            });

            this.element.find('[name="' + listName + '"]').html(string);

            this.options.afterChange({
                objects : this.objects,
                selectName : listName
            });

        },
        
        destroy: function () {

            if (instances < 1) {
                this.element.undelegate('.' + this.options.name + '-select', 'change');
            }
            else
            {
                instances--;
            }

            $.Widget.prototype.destroy.apply(this, arguments); // default destroy
        }
    });
    
})(jQuery);