FormBuilder (pre-alpha)
===========

Build html forms from JSON for Javascript, Node.js, PHP(Smarty,Twig), Ruby

===========

Main terms:
- Form builds from rows.
- Row has a label(single), controls(multiple) and messages(multiple). Row essences(label, controls, messages) render is the same order.
- Label is HTML container with label or span with text content
- Controls is HTML container has separate controls or single control inside
- Control is HTML container with form control (input, textarea, select, button) inside
- Messages is HTML container with some messages or single message inside
- Message is HTML container with message text content inside
- Form, rows, label, control(s), message can have an options like:
    - name (logical name for essence, control has the same name attribute, essence has a className with name)
    - id (id attribute)
    - classNames (extended classNames)
    - value (for control)
    - attributes (other attributes, data and etc)
    - before (string content for rendering before essence)
    - after (string content for rendering after essence)
    - hidden (hide HTML container by setting style "display: none")
    - norender (if true essence don't render)
    - state (state of essence, essence has a className with state)
    - validState (means valid state of essence, essence has a className %essence%-valid)
    - invalidState (means invalid state of essence, essence has a className %essence%-invalid)
    - wrapper (extended HTML container, has an all before written options)
- Wrapper render outside the essence
- After and before content render inside its container

