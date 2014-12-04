(function (global, document, undefined) {

    'use strict';

    var PROPS_NAMES = [
            'checked', 'selected', 'disabled', 'readonly', 'capture', 'multiple',
            'autofocus', 'novalidate', 'formnovalidate', 'required',
            'directory', 'mozdirectory', 'webkitdirectory', 'hidden'
        ],
        FORM_ESSENCE_NAME = 'form',
        ROW_ESSENCE_NAME = 'row',
        LABEL_ESSENCE_NAME = 'label',
        CONTROLS_ESSENCE_NAME = 'controls',
        CONTROL_ESSENCE_NAME = 'control',
        MESSAGES_ESSENCE_NAME = 'messages',
        MESSAGE_ESSENCE_NAME = 'message',
        SELECT_ESSENCE_NAME = 'select',
        OPTGROUP_ESSENCE_NAME = 'optgroup',
        OPTION_ESSENCE_NAME = 'option',
        CONTAINER_NODE_NAME = 'div',
        WRAPPER_NODE_NAME = 'div',
        WRAPPER_POSTFIX = '-wrapper',
        HIDDEN_TYPE_NAME = 'hidden',
        TEXT_TYPE_NAME = 'text',
        TEXTAREA_NODE_NAME = 'textarea',
        BUTTON_NODE_NAME = 'button',
        ERROR_STR = 'error',
        ROWS_CACHE = [],
        _formTrait,
        _rowTrait,
        _context,
        _instance;

    /*##################################
                 PRIVATE
    ##################################*/

    function _getParentEssence (essence) {
        /*
            Return parent name of essence
                NB: control and message have row as parent, because essence has a className with it parent essence
                and "controls-control" or "messages-message" is not a good className
        */
        var parent = '';

        if (essence === FORM_ESSENCE_NAME) {
            parent = FORM_ESSENCE_NAME;
        } else if ([LABEL_ESSENCE_NAME, CONTROLS_ESSENCE_NAME, CONTROL_ESSENCE_NAME, MESSAGES_ESSENCE_NAME, MESSAGE_ESSENCE_NAME].indexOf(essence) > -1) {
            parent = ROW_ESSENCE_NAME;
        } else if ([OPTGROUP_ESSENCE_NAME, OPTION_ESSENCE_NAME].indexOf(essence) > -1) {
            parent = SELECT_ESSENCE_NAME;
        }

        return parent;

    }

    function _isObject (any) {
        return any === Object(any);
    }

    function _isArray (any) {
        return Array.isArray(any);
    }

    function _createElement (nodeName) {
        return document.createElement(nodeName);
    }

    function _init () {
        //init top level - form
        _instance = _createElement(FORM_ESSENCE_NAME);
        _context = _instance;
    }

    function _append (any) {
        var innerContext = this || {},
            context = innerContext && innerContext.nodeName ? innerContext : _context;
        if (any.nodeName) {
            context.appendChild(any);
        } else if (_context.insertAdjacentHTML) {
            context.insertAdjacentHTML('beforeEnd', any);
        }
    }

    function _addBeforeContent (before) {
        /*
            Just render inside essence and after open tag (like css pseudo before element)
            Can be string type only
        */

        _append(before);
    }


    function _addAfterContent (after) {
        /*
            Just append inside essence and before closing tag (like css pseudo after element)
            Can be string type only
        */

        _append(after);
    }

    function _addClassNames (options, essence, isWrapper) {

        options = options || {};

        var parentEssence = _getParentEssence(essence),
            wrapperPostfix = isWrapper ? WRAPPER_POSTFIX : '',
            innerContext = this || {},
            space = ' ',
            classNames = [space];

        if (isWrapper) {
            classNames.push(essence + WRAPPER_POSTFIX);
        } else if (parentEssence) {
            classNames.push(parentEssence + '-' + essence);
        } else {
            classNames.push(essence + '-self');
        }

        if (options.pseudo) {
            classNames.push(essence + '-pseudo');
        }

        if (options.name) {
            classNames.push(essence + '-' + options.name + wrapperPostfix);
        }

        if (options.type) {
            classNames.push(essence + '-' + options.type);
        }

        if (options.state) {
            classNames.push(essence + '-' + options.state + wrapperPostfix);
        }

        if (options.invalidState) {
            classNames.push(essence + '-invalid' + wrapperPostfix);
        }

        if (options.validState) {
            classNames.push(essence+ '-valid' + wrapperPostfix);
        }

        classNames.push(space);

        if (innerContext && innerContext.nodeName) {
            innerContext.className = classNames.join(space);
        } else {
            _context.className = classNames.join(space);
        }

    }

    function _addHidden (isHidden) {
        var innerContext = this;

        if (isHidden) {
            if (!innerContext || !innerContext.nodeName) {
                innerContext = _context;
            }
            innerContext.style.cssText += 'display: none;';
        }

    }

    function _addProperty (propName, propValue) {
        var innerContext = this;

        if (!innerContext || !innerContext.nodeName) {
            innerContext = _context;
        }

        innerContext.propName = propValue;

    }

    function _addAttribute (attrName, attrValue) {
        var innerContext = this;

        if (!innerContext || !innerContext.nodeName) {
            innerContext = _context;
        }

        innerContext.setAttribute(attrName, attrValue);

    }

    function _addAttributes (attributes) {
        /*
            Try to add attributes to the context, context is hidden in attr method
        */

        if (!attributes) {
            return;
        }

        Object.keys(attributes).forEach(function (attrName) {
            var attrValue = attributes[attrName],
                isProp = PROPS_NAMES.indexOf(attrName) > -1;

            //remove or not logic is inside attr/prop methods
            if (isProp) {
                _addProperty(attrName, attrValue);
            } else {
                _addAttribute(attrName, attrValue);
            }

        });

    }

    function _startWrapper (options, essence) {
        /*
            Append to essence container wrapper and append wrapper before content
        */
        options = options || {};

        var attributes,
            node;

        if (!options.norender) {

            attributes = options.attributes || {};
            attributes.id = attributes.id || options.id;

            node = _createElement(WRAPPER_NODE_NAME);
            _append(node);
            _context = node;

            _addAttributes(attributes);
            _addClassNames(options, essence, true);
            _addHidden(options.hidden);

            _addBeforeContent(options.before);

        }


    }

    function _closeWrapper (options, essence) {
        /*
            Append after content to wrapper and change (close) context
        */

        options = options || {};

        if (!options.norender) {
            _addAfterContent(options.after);
        }

    }

    function _startContainer (options, essence) {
        /*
            Append to context new container, change context and append before content
        */

        options = options || {};

        var attributes,
            nodeName,
            node;

        if (!options.norender) {

            nodeName = essence === FORM_ESSENCE_NAME ? FORM_ESSENCE_NAME : CONTAINER_NODE_NAME;
            node = _createElement(nodeName);
            attributes = options.attributes || {};
            attributes.id = attributes.id || options.id;

            _append(node);
            _context = node;

            _addAttributes(attributes);
            _addClassNames(options, essence, false);
            _addHidden(options.hidden);
            _addBeforeContent(options.before);

        }

    }

    function _closeContainer (options, essence) {
        /*
            Append after content to essence container and change (close) context
        */

        options = options || {};

        if (!options.norender) {
            _addBeforeContent(options.after);
        }

    }

    function _addTextarea (options) {
        /*
            Append to context textarea only
        */

        options = options || {};

        var attributes,
            textarea;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.id = attributes.id || options.id;
                attributes.value = attributes.value || options.value;

                textarea = _createElement(TEXTAREA_NODE_NAME);
                _append(textarea);

                _addAttributes.call(textarea, attributes);
                _addClassNames.call(textarea, options, CONTROL_ESSENCE_NAME, false);
                _addHidden.call(textarea, options.hidden);

            } else {
                _append(options);
            }

        }

    }

    function _addOption (options) {
        /*
            Append option to context only
        */

        options = options || {};

        var attributes,
            option;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.selected = attributes.selected || options.selected;
                attributes.value = attributes.value || options.value;

                option = _createElement(OPTION_ESSENCE_NAME);
                option.innerText = options.text;
                _append(option);

                _addAttributes.call(option, attributes);
                _addClassNames.call(option, options, OPTION_ESSENCE_NAME, false);
                _addHidden.call(option, options.hidden);

            } else {
                _append(options);
            }

        }

    }

    function _addOptGroup (options) {
        /*
            Append optgroup with options to context
        */

        options = options || {};

        var attributes,
            optgroup;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.label = attributes.label || options.text || '';

                optgroup = _createElement(OPTGROUP_ESSENCE_NAME);
                _append(optgroup);

                _addAttributes.call(optgroup, attributes);
                _addClassNames.call(optgroup, options, OPTGROUP_ESSENCE_NAME, false);
                _addHidden.call(optgroup, options.hidden);

                (options.value || []).forEach(function (optionObject) {
                    _addOption(optionObject);
                });

            } else {
                _append(options);
            }

        }

    }

    function _addSelect(options) {
        /*
            Append select with options and optgroups to context
        */

        options = options || {};

        var attributes,
            select;

        if (!options.noredner) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.id = attributes.id || options.id;

                select = _createElement(SELECT_ESSENCE_NAME);
                _append(select);

                _addAttributes.call(select, attributes);
                _addClassNames.call(select, options, CONTROL_ESSENCE_NAME, false);
                _addHidden.call(select, options.hidden);

                if (_isArray(options.options)) {
                    options.options.forEach(function (optionObject) {
                        if (optionObject.group) {
                            _addOptGroup(optionObject);
                        } else if (_isObject(optionObject)) {
                            _addOption(optionObject);
                        } else {
                            _append(optionObject);
                        }
                    });
                } else {
                    _append(options.options);
                }

            } else {
                _append(options);
            }

        }

    }

    function _addButton (options) {
        /*
            Append button to context only, button can be with after/before content
        */

        options = options || {};

        var attributes,
            button;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.id = attributes.id || options.id;
                if (!options.nosubmit) {
                    attributes.type = options.submit;
                }

                button = _createElement(BUTTON_NODE_NAME);

                _append.call(button, options.before);
                _append.call(button, options.value);

                _addAttributes.call(button, attributes);
                _addClassNames.call(button, options, CONTROL_ESSENCE_NAME, false);
                _addHidden.call(button, options.hidden);

                _append.call(button, options.after);
                _append(button);

            } else {
                _append(options);
            }

        }

    }

    function _addInput(options) {
        /*
            Append input to context only
        */

        options = options || {};

        var attributes,
            input;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.id = attributes.id || options.id;
                attributes.type = attributes.type || options.type;
                attributes.value = attributes.value ||options.value;

                input = _createElement('input');

                _addAttributes.call(input, attributes);
                _addClassNames.call(input, options, CONTROL_ESSENCE_NAME, false);
                _addHidden.call(input, options.hidden);

            } else {
                _append(options);
            }

        }

    }

    function _changeRowByIndex (index) {
        _context = ROWS_CACHE[index];
        return _rowTrait;
    }

/*####################################################
             PUBLIC (can use anyone of its)
#####################################################*/

    function returnNode () {
        return _context;
    }

    function createLabel (options) {
        /*
            Append label to context
            options : Object {text : String, reference : String, pseudo : Boolean, ...<common options>}
            options : String
            NB: If label object has not reference for control, createRow function add to label first control id value
        */

        options = options || {};

        var attributes,
            label;

        if (!options.norender) {

            if (_isObject(options)) {

                attributes = options.attributes || {};
                attributes.id = attributes.id || options.id;
                attributes.reference = attributes.reference || options.reference;

                if (options.pseudo) {
                    label = _createElement('span');
                } else {
                    label = _createElement('input');
                }

                _startContainer(options, LABEL_ESSENCE_NAME);
                _startWrapper(options.wrapper, LABEL_ESSENCE_NAME);

                _append(label);
                _append.call(label, options.text);
                _addAttributes.call(label, attributes);
                _addClassNames.call(label, options, LABEL_ESSENCE_NAME, false);
                _addHidden.call(label, options.hidden);

                _closeWrapper(options.wrapper, LABEL_ESSENCE_NAME);
                _closeContainer(options, LABEL_ESSENCE_NAME);

            } else {
                _append(options);
            }

        }

        return _rowTrait;

    }

    function createControl (options) {
        /*
            Append control to context
            options: Object (simple)
                    {type : String, name : String, value : String, ...<common options>}
            options: String
            NB: if control has type "hidden" rendering just control input type="hidden" without wrappers and containers, but with name, id, classNames and attributes
        */

        options = options || {};

        var controlType;

        if (!options.norender) {

            if (_isObject(options)) {

                if (!options.type) {
                    options.type = TEXT_TYPE_NAME;
                }

                controlType = options.type;

                if (controlType !== HIDDEN_TYPE_NAME) {
                    _startContainer(options, CONTROL_ESSENCE_NAME);
                    _startWrapper(options.wrapper, CONTROL_ESSENCE_NAME);
                }

                if (controlType === TEXTAREA_NODE_NAME) {
                    _addTextarea(options);
                } else if (controlType === SELECT_ESSENCE_NAME) {
                    _addSelect(options);
                } else if (controlType === BUTTON_NODE_NAME) {
                    _addButton(options);
                } else {
                    _addInput(options);
                }

                if (controlType !== HIDDEN_TYPE_NAME) {
                    _closeWrapper(options.wrapper, CONTROL_ESSENCE_NAME);
                    _closeContainer(options, CONTROL_ESSENCE_NAME);
                }

            } else {
                _append(options);
            }

        }

        return _rowTrait;

    }

    function createControls (options) {
        /*
            Append controls to context
            options : [control, control, ..., control] Array of control Objects
            options : control Object
            options : String
        */

        options = options || {};

        if (!options.norender) {

            _startContainer(options, CONTROLS_ESSENCE_NAME);
            _startWrapper(options.wrapper, CONTROLS_ESSENCE_NAME);

            if  (_isArray(options)) {
                options.forEach(function (controlObject) {
                    createControl(controlObject);
                });
            } else if (_isObject(options)) {
                createControl(options);
            } else {
                _append(options);
            }

            _closeWrapper(options.wrapper, CONTROLS_ESSENCE_NAME);
            _closeContainer(options, CONTROLS_ESSENCE_NAME);

        }

        return _rowTrait;

    }

    function createMessage (options) {
        /*
            Append message to context only
            options : message Object
            options : String
        */

        options = options || {};

        if (!options.norender) {

            if (_isObject(options)) {

                options.type = options.type || ERROR_STR;
                options.text = options.text || ERROR_STR;

                _startContainer(options, MESSAGE_ESSENCE_NAME);
                _startWrapper(options.wrapper, MESSAGE_ESSENCE_NAME);

                _append(options.text);

                _closeContainer(options, MESSAGE_ESSENCE_NAME);
                _closeWrapper(options.wrapper, MESSAGE_ESSENCE_NAME);

            } else {
                _append(options);
            }

        }

        return _rowTrait;

    }

    function createMessages (options) {
        /*
            Append messages to context
            options : [message, message, ..., message] Array of message Objects
            options : message Object
            options : String
        */

        options = options || {};

        if (!options.norender) {

            _startContainer(options, MESSAGES_ESSENCE_NAME);
            _startWrapper(options.wrapper, MESSAGES_ESSENCE_NAME);

            if  (_isArray(options)) {
                options.forEach(function (messageObject) {
                    createMessage(messageObject);
                });
            } else if (_isObject(options)) {
                createMessage(options);
            } else {
                _append(options);
            }

            _closeWrapper(options.wrapper, MESSAGES_ESSENCE_NAME);
            _closeContainer(options, MESSAGES_ESSENCE_NAME);
        }

        return _rowTrait;

    }

    function createRow (options, openMultipleWrapper, closeMultipleWrapper) {
        /*
            Append form row to form and change context to this form
            Row is the only essence which can be wrap by multiple-row wrapper.
        */

        options = options || {};

        if (!options.norender) {

            if (_isObject(options)) {

                if (_isObject(options.controls) && options.controls.type === HIDDEN_TYPE_NAME) {
                    // Row with hidden only control
                    _addInput(options.controls);
                    // Cache row-with-hidden-control-only
                    ROWS_CACHE.push(_context);
                    // Do not provide row interface for row-with-hidden-control-only
                    return _formTrait;

                } else {

                    if (_isArray(options.controls)) {
                        options.controls = options.controls.filter(function (controlsObject) {
                            if (_isObject(controlsObject) && controlsObject.type === HIDDEN_TYPE_NAME) {
                                //Don't cache every row-with-hidden-control-only if many controls
                                //Create one new row per one new hidden control for cache it
                                _addInput(controlsObject);
                                return;
                            }
                            return true;
                        });
                        if (!options.controls[0]) {
                            return _formTrait;
                        }
                    }
                    _startContainer(options, ROW_ESSENCE_NAME);
                    if (openMultipleWrapper || openMultipleWrapper === undefined) {
                        _startWrapper(options.wrapper, ROW_ESSENCE_NAME);
                    }

                    if (options.label) {
                        if (_isObject(options.label) && !options.label.reference) {
                            //Try to get label for reference
                            if (_isArray(options.controls)) {
                                //get first control from array
                                options.label.reference = options.controls[0].id;
                            } else if (_isObject(options.controls)) {
                                options.label.reference = options.controls.id;
                            }
                        }
                        createLabel(options.label);
                    }

                    if (options.controls) {
                        createControls(options.controls);
                    }

                    if (options.messages) {
                        createMessages(options.messages);
                    }

                    if (closeMultipleWrapper || closeMultipleWrapper === undefined) {
                        _closeWrapper(options.wrapper, ROW_ESSENCE_NAME);
                    }
                    _closeContainer(options, ROW_ESSENCE_NAME);

                }

            } else {
                _append(options);
            }

            ROWS_CACHE.push(_context)

        }

        return _rowTrait;

    }

    function createRows (options) {
        /*
            Append form rows to form and change context to this rows
        */

        options = options || {};

        var formTrait;

        if (!options.norender) {

            _startContainer(options, ROW_ESSENCE_NAME);
            _startWrapper(options.wrapper, ROW_ESSENCE_NAME);

            if  (_isArray(options)) {
                options.forEach(function (messageObject) {
                    createRow(messageObject);
                });
            } else if (_isObject(options)) {
                createRow(options);
            } else {
                _append(options);
            }

            _closeWrapper(options.wrapper, ROW_ESSENCE_NAME);
            _closeContainer(options, ROW_ESSENCE_NAME);
        }

        formTrait = Object.create(_formTrait);
        formTrait.get = _changeRowByIndex;

        return formTrait;

    }

    function createForm (options) {
        /*
            Create form
        */

        options = options || {};

        var hasMultipleWrapper,
            openMultipleWrapper,
            closeMultipleWrapper,
            rowsCount,
            attributes;

        if (!options.norender) {

            attributes = options.attributes || {};
            attributes.method = attributes.method || options.method || 'post';
            attributes.action = attributes.action || options.action || '';
            options.attributes = attributes;

            _startContainer(options, FORM_ESSENCE_NAME);
            _startWrapper(options.wrapper, FORM_ESSENCE_NAME);

            if (_isArray(options.rows)) {
                //Array only, no object support

                rowsCount = options.rows.length;

                options.rows.forEach(function (rowObject, index, rowsArray) {

                    var isLast = index === rowsCount,
                        nextRowObject = isLast ? {} : rowsArray[index + 1];

                    if (_isObject(rowObject)) {

                        if (!rowObject.norender) {
                            // if row must be not render - miss it and don't destroy row wrapper logic

                            /*
                                Don't has active wrapper - check it
                            */
                            if (!hasMultipleWrapper) {
                                //Don't check for new wrappers while has one opened
                                openMultipleWrapper = rowObject.wrapper && rowObject.wrapper.multiple && rowObject.wrapper.openMultiple;
                                hasMultipleWrapper = openMultipleWrapper;
                            }

                            /*
                                close wrapper if it starts and:
                                - last loop index
                                - has row.wrapper.multiple and row.wrapper.closeMultiple flags
                                - row names are different (if no wrapper flags, wrapper depends from row "name")
                            */
                            closeMultipleWrapper = hasMultipleWrapper && (
                                isLast
                                ||
                                rowObject.wrapper.multipe && row.wrapper.closeMultiple
                                ||
                                nextRowObject.name && rowObject.name && nextRowObject.name !== rowObject.name
                            );

                            createRow(rowObject, openMultipleWrapper, closeMultipleWrapper);

                        }

                    } else {

                        closeMultipleWrapper = hasMultipleWrapper ? 1 : 0;
                        createRow(rowObject, false, closeMultipleWrapper);

                    }

                    openMultipleWrapper = false;
                    hasMultipleWrapper = closeMultipleWrapper ? false : hasMultipleWrapper;

                });

            } else {

                _append(options.rows)

            }

            _closeWrapper(options.wrapper, FORM_ESSENCE_NAME);
            _closeContainer(options, FORM_ESSENCE_NAME);

        }

        return _formTrait;

    }

    _formTrait = {
        create : createForm,
        rows : createRows,
        row : createRow,
        node : returnNode
    };

    _rowTrait = {
        label : createLabel,
        control : createControl,
        controls : createControls,
        message : createMessage,
        messages : createMessages,
        node : returnNode,
        up : function () {
            return _formTrait;
        }
    };

    global.FormBuilder = {
        Form : function (options) {
            if (options) {
                return createForm(options);
            } else {
                return _formTrait;
            }
        },
        //TODO check init
        init : _init()
    };

}(this, document));
