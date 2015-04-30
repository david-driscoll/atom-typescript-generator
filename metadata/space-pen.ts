import * as _ from 'lodash'
import {readFileSync} from 'fs'
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

var content = `        
        /**
        * Adds the specified class(es) to each of the set of matched elements.
        *
        * @param className One or more space-separated classes to be added to the class attribute of each matched element.
        */
        addClass(className: string): JQuery;
        /**
        * Adds the specified class(es) to each of the set of matched elements.
        *
        * @param function A function returning one or more space-separated class names to be added to the existing class name(s). Receives the index position of the element in the set and the existing class name(s) as arguments. Within the function, this refers to the current element in the set.
        */
        addClass(func: (index: number, className: string) => string): JQuery;

        /**
        * Add the previous set of elements on the stack to the current set, optionally filtered by a selector.
        */
        addBack(selector?: string): JQuery;

        /**
        * Get the value of an attribute for the first element in the set of matched elements.
        *
        * @param attributeName The name of the attribute to get.
        */
        attr(attributeName: string): string;
        /**
        * Set one or more attributes for the set of matched elements.
        *
        * @param attributeName The name of the attribute to set.
        * @param value A value to set for the attribute.
        */
        attr(attributeName: string, value: string|number): JQuery;
        /**
        * Set one or more attributes for the set of matched elements.
        *
        * @param attributeName The name of the attribute to set.
        * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old attribute value as arguments.
        */
        attr(attributeName: string, func: (index: number, attr: string) => string|number): JQuery;
        /**
        * Set one or more attributes for the set of matched elements.
        *
        * @param attributes An object of attribute-value pairs to set.
        */
        attr(attributes: Object): JQuery;

        /**
        * Determine whether any of the matched elements are assigned the given class.
        *
        * @param className The class name to search for.
        */
        hasClass(className: string): boolean;

        /**
        * Get the HTML contents of the first element in the set of matched elements.
        */
        html(): string;
        /**
        * Set the HTML contents of each element in the set of matched elements.
        *
        * @param htmlString A string of HTML to set as the content of each matched element.
        */
        html(htmlString: string): JQuery;
        /**
        * Set the HTML contents of each element in the set of matched elements.
        *
        * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
        */
        html(func: (index: number, oldhtml: string) => string): JQuery;
        /**
        * Set the HTML contents of each element in the set of matched elements.
        *
        * @param func A function returning the HTML content to set. Receives the index position of the element in the set and the old HTML value as arguments. jQuery empties the element before calling the function; use the oldhtml argument to reference the previous content. Within the function, this refers to the current element in the set.
        */

        /**
        * Get the value of a property for the first element in the set of matched elements.
        *
        * @param propertyName The name of the property to get.
        */
        prop(propertyName: string): any;
        /**
        * Set one or more properties for the set of matched elements.
        *
        * @param propertyName The name of the property to set.
        * @param value A value to set for the property.
        */
        prop(propertyName: string, value: string|number|boolean): JQuery;
        /**
        * Set one or more properties for the set of matched elements.
        *
        * @param properties An object of property-value pairs to set.
        */
        prop(properties: Object): JQuery;
        /**
        * Set one or more properties for the set of matched elements.
        *
        * @param propertyName The name of the property to set.
        * @param func A function returning the value to set. Receives the index position of the element in the set and the old property value as arguments. Within the function, the keyword this refers to the current element.
        */
        prop(propertyName: string, func: (index: number, oldPropertyValue: any) => any): JQuery;

        /**
        * Remove an attribute from each element in the set of matched elements.
        *
        * @param attributeName An attribute to remove; as of version 1.7, it can be a space-separated list of attributes.
        */
        removeAttr(attributeName: string): JQuery;

        /**
        * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
        *
        * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
        */
        removeClass(className?: string): JQuery;
        /**
        * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
        *
        * @param function A function returning one or more space-separated class names to be removed. Receives the index position of the element in the set and the old class value as arguments.
        */
        removeClass(func: (index: number, className: string) => string): JQuery;

        /**
        * Remove a property for the set of matched elements.
        *
        * @param propertyName The name of the property to remove.
        */
        removeProp(propertyName: string): JQuery;

        /**
        * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
        *
        * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
        * @param swtch A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
        */
        toggleClass(className: string, swtch?: boolean): JQuery;
        /**
        * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
        *
        * @param swtch A boolean value to determine whether the class should be added or removed.
        */
        toggleClass(swtch?: boolean): JQuery;
        /**
        * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the switch argument.
        *
        * @param func A function that returns class names to be toggled in the class attribute of each element in the matched set. Receives the index position of the element in the set, the old class value, and the switch as arguments.
        * @param swtch A boolean value to determine whether the class should be added or removed.
        */
        toggleClass(func: (index: number, className: string, swtch: boolean) => string, swtch?: boolean): JQuery;

        /**
        * Get the current value of the first element in the set of matched elements.
        */
        val(): any;
        /**
        * Set the value of each element in the set of matched elements.
        *
        * @param value A string of text or an array of strings corresponding to the value of each matched element to set as selected/checked.
        */
        val(value: string|string[]): JQuery;
        /**
        * Set the value of each element in the set of matched elements.
        *
        * @param func A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
        */
        val(func: (index: number, value: string) => string): JQuery;


        /**
        * Get the value of style properties for the first element in the set of matched elements.
        *
        * @param propertyName A CSS property.
        */
        css(propertyName: string): string;
        /**
        * Set one or more CSS properties for the set of matched elements.
        *
        * @param propertyName A CSS property name.
        * @param value A value to set for the property.
        */
        css(propertyName: string, value: string|number): JQuery;
        /**
        * Set one or more CSS properties for the set of matched elements.
        *
        * @param propertyName A CSS property name.
        * @param value A function returning the value to set. this is the current element. Receives the index position of the element in the set and the old value as arguments.
        */
        css(propertyName: string, value: (index: number, value: string) => string|number): JQuery;
        /**
        * Set one or more CSS properties for the set of matched elements.
        *
        * @param properties An object of property-value pairs to set.
        */
        css(properties: Object): JQuery;

        /**
        * Get the current computed height for the first element in the set of matched elements.
        */
        height(): number;
        /**
        * Set the CSS height of every matched element.
        *
        * @param value An integer representing the number of pixels, or an integer with an optional unit of measure appended (as a string).
        */
        height(value: number|string): JQuery;
        /**
        * Set the CSS height of every matched element.
        *
        * @param func A function returning the height to set. Receives the index position of the element in the set and the old height as arguments. Within the function, this refers to the current element in the set.
        */
        height(func: (index: number, height: number) => number|string): JQuery;

        /**
        * Get the current computed height for the first element in the set of matched elements, including padding but not border.
        */
        innerHeight(): number;

        /**
        * Sets the inner height on elements in the set of matched elements, including padding but not border.
        *
        * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
        */
        innerHeight(height: number|string): JQuery;

        /**
        * Get the current computed width for the first element in the set of matched elements, including padding but not border.
        */
        innerWidth(): number;

        /**
        * Sets the inner width on elements in the set of matched elements, including padding but not border.
        *
        * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
        */
        innerWidth(width: number|string): JQuery;

        /**
        * Get the current coordinates of the first element in the set of matched elements, relative to the document.
        */
        offset(): JQueryCoordinates;
        /**
        * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
        *
        * @param coordinates An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
        */
        offset(coordinates: JQueryCoordinates): JQuery;
        /**
        * An object containing the properties top and left, which are integers indicating the new top and left coordinates for the elements.
        *
        * @param func A function to return the coordinates to set. Receives the index of the element in the collection as the first argument and the current coordinates as the second argument. The function should return an object with the new top and left properties.
        */
        offset(func: (index: number, coords: JQueryCoordinates) => JQueryCoordinates): JQuery;

        /**
        * Get the current computed height for the first element in the set of matched elements, including padding, border, and optionally margin. Returns an integer (without "px") representation of the value or null if called on an empty set of elements.
        *
        * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
        */
        outerHeight(includeMargin?: boolean): number;

        /**
        * Sets the outer height on elements in the set of matched elements, including padding and border.
        *
        * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
        */
        outerHeight(height: number|string): JQuery;

        /**
        * Get the current computed width for the first element in the set of matched elements, including padding and border.
        *
        * @param includeMargin A Boolean indicating whether to include the element's margin in the calculation.
        */
        outerWidth(includeMargin?: boolean): number;

        /**
        * Sets the outer width on elements in the set of matched elements, including padding and border.
        *
        * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
        */
        outerWidth(width: number|string): JQuery;

        /**
        * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
        */
        position(): JQueryCoordinates;

        /**
        * Get the current horizontal position of the scroll bar for the first element in the set of matched elements or set the horizontal position of the scroll bar for every matched element.
        */
        scrollLeft(): number;
        /**
        * Set the current horizontal position of the scroll bar for each of the set of matched elements.
        *
        * @param value An integer indicating the new position to set the scroll bar to.
        */
        scrollLeft(value: number): JQuery;

        /**
        * Get the current vertical position of the scroll bar for the first element in the set of matched elements or set the vertical position of the scroll bar for every matched element.
        */
        scrollTop(): number;
        /**
        * Set the current vertical position of the scroll bar for each of the set of matched elements.
        *
        * @param value An integer indicating the new position to set the scroll bar to.
        */
        scrollTop(value: number): JQuery;

        /**
        * Get the current computed width for the first element in the set of matched elements.
        */
        width(): number;
        /**
        * Set the CSS width of each element in the set of matched elements.
        *
        * @param value An integer representing the number of pixels, or an integer along with an optional unit of measure appended (as a string).
        */
        width(value: number|string): JQuery;
        /**
        * Set the CSS width of each element in the set of matched elements.
        *
        * @param func A function returning the width to set. Receives the index position of the element in the set and the old width as arguments. Within the function, this refers to the current element in the set.
        */
        width(func: (index: number, width: number) => number|string): JQuery;

        /**
        * Remove from the queue all items that have not yet been run.
        *
        * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
        */
        clearQueue(queueName?: string): JQuery;

        /**
        * Store arbitrary data associated with the matched elements.
        *
        * @param key A string naming the piece of data to set.
        * @param value The new data value; it can be any Javascript type including Array or Object.
        */
        data(key: string, value: any): JQuery;
        /**
        * Store arbitrary data associated with the matched elements.
        *
        * @param obj An object of key-value pairs of data to update.
        */
        data(obj: { [key: string]: any; }): JQuery;
        /**
        * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
        *
        * @param key Name of the data stored.
        */
        data(key: string): any;
        /**
        * Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.
        */
        data(): any;

        /**
        * Remove a previously-stored piece of data.
        *
        * @param name A string naming the piece of data to delete or space-separated string naming the pieces of data to delete.
        */
        removeData(name: string): JQuery;
        /**
        * Remove a previously-stored piece of data.
        *
        * @param list An array of strings naming the pieces of data to delete.
        */
        removeData(list: string[]): JQuery;
        /**
        * Trigger the "change" event on an element.
        */
        change(): void;
        /**
        * Trigger the "show" event on an element.
        */
        show(): void;
        /**
        * Trigger the "hide" event on an element.
        */
        hide(): void;
        /**
        * Trigger the "toggle" event on an element.
        */
        toggle(): void;
        /**
        * Trigger the "click" event on an element.
        */
        click(): void;
        /**
        * Trigger the "dblclick" event on an element.
        */
        dblclick(): void;
        /**
        * Trigger the "focus" event on an element.
        */
        focus(): void;
        /**
        * Remove an event handler.
        */
        off(): JQuery;
        /**
        * Remove an event handler.
        *
        * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
        * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
        * @param handler A handler function previously attached for the event(s), or the special value false.
        */
        off(events: string, selector?: string, handler?: (eventObject: JQueryEventObject) => any): JQuery;
        /**
        * Remove an event handler.
        *
        * @param events One or more space-separated event types and optional namespaces, or just namespaces, such as "click", "keydown.myPlugin", or ".myPlugin".
        * @param handler A handler function previously attached for the event(s), or the special value false.
        */
        off(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
        /**
        * Remove an event handler.
        *
        * @param events An object where the string keys represent one or more space-separated event types and optional namespaces, and the values represent handler functions previously attached for the event(s).
        * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
        */
        off(events: { [key: string]: any; }, selector?: string): JQuery;

        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false. Rest parameter args is for optional parameters passed to jQuery.trigger(). Note that the actual parameters on the event handler function must be marked as optional (? syntax).
        */
        on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param data Data to be passed to the handler in event.data when an event is triggered.
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
        */
        on(events: string, data : any, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
        */
        on(events: string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
        * @param data Data to be passed to the handler in event.data when an event is triggered.
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
        */
        on(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
        * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
        * @param data Data to be passed to the handler in event.data when an event occurs.
        */
        on(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;
        /**
        * Attach an event handler function for one or more events to the selected elements.
        *
        * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
        * @param data Data to be passed to the handler in event.data when an event occurs.
        */
        on(events: { [key: string]: any; }, data?: any): JQuery;

        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
        * @param handler A function to execute at the time the event is triggered.
        */
        one(events: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events A string containing one or more JavaScript event types, such as "click" or "submit," or custom event names.
        * @param data An object containing data that will be passed to the event handler.
        * @param handler A function to execute at the time the event is triggered.
        */
        one(events: string, data: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;

        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
        */
        one(events: string, selector: string, handler: (eventObject: JQueryEventObject) => any): JQuery;
        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin".
        * @param selector A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element.
        * @param data Data to be passed to the handler in event.data when an event is triggered.
        * @param handler A function to execute when the event is triggered. The value false is also allowed as a shorthand for a function that simply does return false.
        */
        one(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
        * @param selector A selector string to filter the descendants of the selected elements that will call the handler. If the selector is null or omitted, the handler is always called when it reaches the selected element.
        * @param data Data to be passed to the handler in event.data when an event occurs.
        */
        one(events: { [key: string]: any; }, selector?: string, data?: any): JQuery;

        /**
        * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
        *
        * @param events An object in which the string keys represent one or more space-separated event types and optional namespaces, and the values represent a handler function to be called for the event(s).
        * @param data Data to be passed to the handler in event.data when an event occurs.
        */
        one(events: { [key: string]: any; }, data?: any): JQuery;

        /**
        * Trigger the "resize" event on an element.
        */
        resize(): JQuery;
        /**
        * Trigger the "scroll" event on an element.
        */
        scroll(): JQuery;
        /**
        * Trigger the "select" event on an element.
        */
        select(): JQuery;
        /**
        * Execute all handlers and behaviors attached to the matched elements for the given event type.
        *
        * @param eventType A string containing a JavaScript event type, such as click or submit.
        * @param extraParameters Additional parameters to pass along to the event handler.
        */
        trigger(eventType: string, extraParameters?: any[]|Object): JQuery;
        /**
        * Execute all handlers and behaviors attached to the matched elements for the given event type.
        *
        * @param event A jQuery.Event object.
        * @param extraParameters Additional parameters to pass along to the event handler.
        */
        trigger(event: JQueryEventObject, extraParameters?: any[]|Object): JQuery;

        /**
        * Execute all handlers attached to an element for an event.
        *
        * @param eventType A string containing a JavaScript event type, such as click or submit.
        * @param extraParameters An array of additional parameters to pass along to the event handler.
        */
        triggerHandler(eventType: string, ...extraParameters: any[]): Object;
        /**
        * The DOM node context originally passed to jQuery(); if none was passed then context will likely be the document. (DEPRECATED from v1.10)
        */
        context: Element;

        jquery: string;

        /**
        * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
        *
        * @param handler A function to execute when the event is triggered.
        */
        error(handler: (eventObject: JQueryEventObject) => any): JQuery;
        /**
        * Bind an event handler to the "error" JavaScript event. (DEPRECATED from v1.8)
        *
        * @param eventData A plain object of data that will be passed to the event handler.
        * @param handler A function to execute when the event is triggered.
        */
        error(eventData: any, handler: (eventObject: JQueryEventObject) => any): JQuery;

        /**
        * Add a collection of DOM elements onto the jQuery stack.
        *
        * @param elements An array of elements to push onto the stack and make into a new jQuery object.
        */
        pushStack(elements: any[]): JQuery;
        /**
        * Add a collection of DOM elements onto the jQuery stack.
        *
        * @param elements An array of elements to push onto the stack and make into a new jQuery object.
        * @param name The name of a jQuery method that generated the array of elements.
        * @param arguments The arguments that were passed in to the jQuery method (for serialization).
        */
        pushStack(elements: any[], name: string, args: any[]): JQuery;

        /**
        * Insert content, specified by the parameter, after each element in the set of matched elements.
        *
        * param content1 HTML string, DOM element, array of elements, or jQuery object to insert after each element in the set of matched elements.
        * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert after each element in the set of matched elements.
        */
        after(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
        /**
        * Insert content, specified by the parameter, after each element in the set of matched elements.
        *
        * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert after each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
        */
        after(func: (index: number, html: string) => string|Element|JQuery): JQuery;

        /**
        * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
        *
        * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the end of each element in the set of matched elements.
        * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the end of each element in the set of matched elements.
        */
        append(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
        /**
        * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
        *
        * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the end of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
        */
        append(func: (index: number, html: string) => string|Element|JQuery): JQuery;

        /**
        * Insert every element in the set of matched elements to the end of the target.
        *
        * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the end of the element(s) specified by this parameter.
        */
        appendTo(target: JQuery|any[]|Element|string): JQuery;

        /**
        * Insert content, specified by the parameter, before each element in the set of matched elements.
        *
        * param content1 HTML string, DOM element, array of elements, or jQuery object to insert before each element in the set of matched elements.
        * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert before each element in the set of matched elements.
        */
        before(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
        /**
        * Insert content, specified by the parameter, before each element in the set of matched elements.
        *
        * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert before each element in the set of matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
        */
        before(func: (index: number, html: string) => string|Element|JQuery): JQuery;

        /**
        * Create a deep copy of the set of matched elements.
        *
        * param withDataAndEvents A Boolean indicating whether event handlers and data should be copied along with the elements. The default value is false.
        * param deepWithDataAndEvents A Boolean indicating whether event handlers and data for all children of the cloned element should be copied. By default its value matches the first argument's value (which defaults to false).
        */
        clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;

        /**
        * Remove the set of matched elements from the DOM.
        *
        * param selector A selector expression that filters the set of matched elements to be removed.
        */
        detach(selector?: string): JQuery;

        /**
        * Remove all child nodes of the set of matched elements from the DOM.
        */
        empty(): JQuery;

        /**
        * Insert every element in the set of matched elements after the target.
        *
        * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted after the element(s) specified by this parameter.
        */
        insertAfter(target: JQuery|any[]|Element|Text|string): JQuery;

        /**
        * Insert every element in the set of matched elements before the target.
        *
        * param target A selector, element, array of elements, HTML string, or jQuery object; the matched set of elements will be inserted before the element(s) specified by this parameter.
        */
        insertBefore(target: JQuery|any[]|Element|Text|string): JQuery;

        /**
        * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
        *
        * param content1 DOM element, array of elements, HTML string, or jQuery object to insert at the beginning of each element in the set of matched elements.
        * param content2 One or more additional DOM elements, arrays of elements, HTML strings, or jQuery objects to insert at the beginning of each element in the set of matched elements.
        */
        prepend(content1: JQuery|any[]|Element|Text|string, ...content2: any[]): JQuery;
        /**
        * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
        *
        * param func A function that returns an HTML string, DOM element(s), or jQuery object to insert at the beginning of each element in the set of matched elements. Receives the index position of the element in the set and the old HTML value of the element as arguments. Within the function, this refers to the current element in the set.
        */
        prepend(func: (index: number, html: string) => string|Element|JQuery): JQuery;

        /**
        * Insert every element in the set of matched elements to the beginning of the target.
        *
        * @param target A selector, element, HTML string, array of elements, or jQuery object; the matched set of elements will be inserted at the beginning of the element(s) specified by this parameter.
        */
        prependTo(target: JQuery|any[]|Element|string): JQuery;

        /**
        * Remove the set of matched elements from the DOM.
        *
        * @param selector A selector expression that filters the set of matched elements to be removed.
        */
        remove(): void;

        /**
        * Replace each target element with the set of matched elements.
        *
        * @param target A selector string, jQuery object, DOM element, or array of elements indicating which element(s) to replace.
        */
        replaceAll(target: JQuery|any[]|Element|string): JQuery;

        /**
        * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
        *
        * param newContent The content to insert. May be an HTML string, DOM element, array of DOM elements, or jQuery object.
        */
        replaceWith(newContent: JQuery|any[]|Element|Text|string): JQuery;
        /**
        * Replace each element in the set of matched elements with the provided new content and return the set of elements that was removed.
        *
        * param func A function that returns content with which to replace the set of matched elements.
        */
        replaceWith(func: () => Element|JQuery): JQuery;

        /**
        * Get the combined text contents of each element in the set of matched elements, including their descendants.
        */
        text(): string;
        /**
        * Set the content of each element in the set of matched elements to the specified text.
        *
        * @param text The text to set as the content of each matched element. When Number or Boolean is supplied, it will be converted to a String representation.
        */
        text(text: string|number|boolean): JQuery;
        /**
        * Set the content of each element in the set of matched elements to the specified text.
        *
        * @param func A function returning the text content to set. Receives the index position of the element in the set and the old text value as arguments.
        */
        text(func: (index: number, text: string) => string): JQuery;

        /**
        * Retrieve all the elements contained in the jQuery set, as an array.
        */
        toArray(): any[];

        /**
        * Remove the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
        */
        unwrap(): JQuery;

        /**
        * Wrap an HTML structure around each element in the set of matched elements.
        *
        * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
        */
        wrap(wrappingElement: JQuery|Element|string): JQuery;
        /**
        * Wrap an HTML structure around each element in the set of matched elements.
        *
        * @param func A callback function returning the HTML content or jQuery object to wrap around the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
        */
        wrap(func: (index: number) => string|JQuery): JQuery;

        /**
        * Wrap an HTML structure around all elements in the set of matched elements.
        *
        * @param wrappingElement A selector, element, HTML string, or jQuery object specifying the structure to wrap around the matched elements.
        */
        wrapAll(wrappingElement: JQuery|Element|string): JQuery;
        wrapAll(func: (index: number) => string): JQuery;

        /**
        * Wrap an HTML structure around the content of each element in the set of matched elements.
        *
        * @param wrappingElement An HTML snippet, selector expression, jQuery object, or DOM element specifying the structure to wrap around the content of the matched elements.
        */
        wrapInner(wrappingElement: JQuery|Element|string): JQuery;
        /**
        * Wrap an HTML structure around the content of each element in the set of matched elements.
        *
        * @param func A callback function which generates a structure to wrap around the content of the matched elements. Receives the index position of the element in the set as an argument. Within the function, this refers to the current element in the set.
        */
        wrapInner(func: (index: number) => string): JQuery;

        /**
        * Iterate over a jQuery object, executing a function for each matched element.
        *
        * @param func A function to execute for each matched element.
        */
        each(func: (index: number, elem: Element) => any): JQuery;

        /**
        * Retrieve one of the elements matched by the jQuery object.
        *
        * @param index A zero-based integer indicating which element to retrieve.
        */
        get(index: number): HTMLElement;
        /**
        * Retrieve the elements matched by the jQuery object.
        */
        get(): any[];

        /**
        * Search for a given element from among the matched elements.
        */
        index(): number;
        /**
        * Search for a given element from among the matched elements.
        *
        * @param selector A selector representing a jQuery collection in which to look for an element.
        */
        index(selector: string|JQuery|Element): number;

        /**
        * The number of elements in the jQuery object.
        */
        length: number;
        /**
        * A selector representing selector passed to jQuery(), if any, when creating the original set.
        * version deprecated: 1.7, removed: 1.9
        */
        selector: string;
        [index: string]: any;
        [index: number]: HTMLElement;

        /**
        * Add elements to the set of matched elements.
        *
        * @param selector A string representing a selector expression to find additional elements to add to the set of matched elements.
        * @param context The point in the document at which the selector should begin matching; similar to the context argument of the $(selector, context) method.
        */
        add(selector: string, context?: Element): JQuery;
        /**
        * Add elements to the set of matched elements.
        *
        * @param elements One or more elements to add to the set of matched elements.
        */
        add(...elements: Element[]): JQuery;
        /**
        * Add elements to the set of matched elements.
        *
        * @param html An HTML fragment to add to the set of matched elements.
        */
        add(html: string): JQuery;
        /**
        * Add elements to the set of matched elements.
        *
        * @param obj An existing jQuery object to add to the set of matched elements.
        */
        add(obj: JQuery): JQuery;

        /**
        * Get the children of each element in the set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        children(selector?: string): JQuery;

        /**
        * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        closest(selector: string): JQuery;
        /**
        * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
        *
        * @param selector A string containing a selector expression to match elements against.
        * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
        */
        closest(selector: string, context?: Element): JQuery;
        /**
        * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
        *
        * @param obj A jQuery object to match elements against.
        */
        closest(obj: JQuery): JQuery;
        /**
        * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
        *
        * @param element An element to match elements against.
        */
        closest(element: Element): JQuery;

        /**
        * Get an array of all the elements and selectors matched against the current element up through the DOM tree.
        *
        * @param selectors An array or string containing a selector expression to match elements against (can also be a jQuery object).
        * @param context A DOM element within which a matching element may be found. If no context is passed in then the context of the jQuery set will be used instead.
        */
        closest(selectors: any, context?: Element): any[];

        /**
        * Get the children of each element in the set of matched elements, including text and comment nodes.
        */
        contents(): JQuery;

        /**
        * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
        */
        end(): JQuery;

        /**
        * Reduce the set of matched elements to the one at the specified index.
        *
        * @param index An integer indicating the 0-based position of the element. OR An integer indicating the position of the element, counting backwards from the last element in the set.
        *
        */
        eq(index: number): JQuery;

        /**
        * Reduce the set of matched elements to those that match the selector or pass the function's test.
        *
        * @param selector A string containing a selector expression to match the current set of elements against.
        */
        filter(selector: string): JQuery;
        /**
        * Reduce the set of matched elements to those that match the selector or pass the function's test.
        *
        * @param func A function used as a test for each element in the set. this is the current DOM element.
        */
        filter(func: (index: number, element: Element) => any): JQuery;
        /**
        * Reduce the set of matched elements to those that match the selector or pass the function's test.
        *
        * @param element An element to match the current set of elements against.
        */
        filter(element: Element): JQuery;
        /**
        * Reduce the set of matched elements to those that match the selector or pass the function's test.
        *
        * @param obj An existing jQuery object to match the current set of elements against.
        */
        filter(obj: JQuery): JQuery;

        /**
        * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        find(selector: string): JQuery;
        /**
        * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
        *
        * @param element An element to match elements against.
        */
        find(element: Element): JQuery;
        /**
        * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element.
        *
        * @param obj A jQuery object to match elements against.
        */
        find(obj: JQuery): JQuery;

        /**
        * Reduce the set of matched elements to the first in the set.
        */
        first(): JQuery;

        /**
        * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        has(selector: string): JQuery;
        /**
        * Reduce the set of matched elements to those that have a descendant that matches the selector or DOM element.
        *
        * @param contained A DOM element to match elements against.
        */
        has(contained: Element): JQuery;

        /**
        * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        is(selector: string): boolean;
        /**
        * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
        *
        * @param func A function used as a test for the set of elements. It accepts one argument, index, which is the element's index in the jQuery collection.Within the function, this refers to the current DOM element.
        */
        is(func: (index: number, element: Element) => boolean): boolean;
        /**
        * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
        *
        * @param obj An existing jQuery object to match the current set of elements against.
        */
        is(obj: JQuery): boolean;
        /**
        * Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
        *
        * @param elements One or more elements to match the current set of elements against.
        */
        is(elements: any): boolean;

        /**
        * Reduce the set of matched elements to the final one in the set.
        */
        last(): JQuery;

        /**
        * Pass each element in the current matched set through a function, producing a new jQuery object containing the return values.
        *
        * @param callback A function object that will be invoked for each element in the current set.
        */
        map(callback: (index: number, domElement: Element) => any): JQuery;

        /**
        * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        next(selector?: string): JQuery;

        /**
        * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        nextAll(selector?: string): JQuery;

        /**
        * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
        *
        * @param selector A string containing a selector expression to indicate where to stop matching following sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        nextUntil(selector?: string, filter?: string): JQuery;
        /**
        * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
        *
        * @param element A DOM node or jQuery object indicating where to stop matching following sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        nextUntil(element?: Element, filter?: string): JQuery;
        /**
        * Get all following siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object passed.
        *
        * @param obj A DOM node or jQuery object indicating where to stop matching following sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        nextUntil(obj?: JQuery, filter?: string): JQuery;

        /**
        * Remove elements from the set of matched elements.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        not(selector: string): JQuery;
        /**
        * Remove elements from the set of matched elements.
        *
        * @param func A function used as a test for each element in the set. this is the current DOM element.
        */
        not(func: (index: number, element: Element) => boolean): JQuery;
        /**
        * Remove elements from the set of matched elements.
        *
        * @param elements One or more DOM elements to remove from the matched set.
        */
        not(...elements: Element[]): JQuery;
        /**
        * Remove elements from the set of matched elements.
        *
        * @param obj An existing jQuery object to match the current set of elements against.
        */
        not(obj: JQuery): JQuery;

        /**
        * Get the closest ancestor element that is positioned.
        */
        offsetParent(): JQuery;

        /**
        * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        parent(selector?: string): JQuery;

        /**
        * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        parents(selector?: string): JQuery;

        /**
        * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param selector A string containing a selector expression to indicate where to stop matching ancestor elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        parentsUntil(selector?: string, filter?: string): JQuery;
        /**
        * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param element A DOM node or jQuery object indicating where to stop matching ancestor elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        parentsUntil(element?: Element, filter?: string): JQuery;
        /**
        * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param obj A DOM node or jQuery object indicating where to stop matching ancestor elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        parentsUntil(obj?: JQuery, filter?: string): JQuery;

        /**
        * Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        prev(selector?: string): JQuery;

        /**
        * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        prevAll(selector?: string): JQuery;

        /**
        * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param selector A string containing a selector expression to indicate where to stop matching preceding sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        prevUntil(selector?: string, filter?: string): JQuery;
        /**
        * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param element A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        prevUntil(element?: Element, filter?: string): JQuery;
        /**
        * Get all preceding siblings of each element up to but not including the element matched by the selector, DOM node, or jQuery object.
        *
        * @param obj A DOM node or jQuery object indicating where to stop matching preceding sibling elements.
        * @param filter A string containing a selector expression to match elements against.
        */
        prevUntil(obj?: JQuery, filter?: string): JQuery;

        /**
        * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
        *
        * @param selector A string containing a selector expression to match elements against.
        */
        siblings(selector?: string): JQuery;

        /**
        * Reduce the set of matched elements to a subset specified by a range of indices.
        *
        * @param start An integer indicating the 0-based position at which the elements begin to be selected. If negative, it indicates an offset from the end of the set.
        * @param end An integer indicating the 0-based position at which the elements stop being selected. If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
        */
        slice(start: number, end?: number): JQuery;

        /**
        * Show the queue of functions to be executed on the matched elements.
        *
        * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
        */
        queue(queueName?: string): any[];
        /**
        * Manipulate the queue of functions to be executed, once for each matched element.
        *
        * @param newQueue An array of functions to replace the current queue contents.
        */
        queue(newQueue: Function[]): JQuery;
        /**
        * Manipulate the queue of functions to be executed, once for each matched element.
        *
        * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
        */
        queue(callback: Function): JQuery;
        /**
        * Manipulate the queue of functions to be executed, once for each matched element.
        *
        * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
        * @param newQueue An array of functions to replace the current queue contents.
        */
        queue(queueName: string, newQueue: Function[]): JQuery;
        /**
        * Manipulate the queue of functions to be executed, once for each matched element.
        *
        * @param queueName A string containing the name of the queue. Defaults to fx, the standard effects queue.
        * @param callback The new function to add to the queue, with a function to call that will dequeue the next item.
        */
        queue(queueName: string, callback: Function): JQuery;`.split('\n').map(z => z && z.trim())

spacePenStaticProperties.push(... content);

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
