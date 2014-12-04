(function (global, undefined) {

    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        //create a global DOM nodes cache for using cloneNode for new essences
        global.FormBuilder.init();

        global.FormBuilder.Form({/*form options here*/});

        global.FormBuilder.Form.rows([/*rows objects here*/]).create();

        global.FormBuilder.Form
            .row({/*row options here*/})
            /* ... more and more rows ... */
            .row({/*row options here*/})
            .create();

        global.FormBuilder.Form
            .row()//add child row and deep in to it context/methods
                .label(/*label options here*/)
                .controls(/*controls options here*/)
                .messages(/*messages options here*/)
            .up()//bubble to parent essence of row - form
            .create();//create form


        /*
            And more and more methods
        */

    }, false);

}(this));
