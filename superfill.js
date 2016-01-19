'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.Helpers = {
  uncamelCase: function(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1 $2');
  },

  makeEverythingSpaces: function(string) {
    return MaxwellForest.Helpers
      .uncamelCase(string)
      .replace(/\.|-|_|\[|\]/g, ' ');
  },

  toArray: function(object) {
    var array = [];
    for (var index = 0; index < object.length; index++) {
      array.push(object[index]);
    }
    return array;
  },

  fullCardAsArray: function(card) {
    return [card['card_number_1'], card['card_number_2'], card['card_number_3'], card['card_number_4']];
  },

  //
  // Returns last element in array or __undefined__ for empty array.
  //
  last: function(array) {
    return array[array.length - 1];
  },

  //
  // Returns value that is added to array.
  // Adds value to array.
  //
  append: function(array, value) {
    array.push(value);
    return value;
  },

  //
  // Returns a count of a value within an array.
  //
  count: function(array,value){
    var result = 0;
    for(var i in array) {
      if(array[i] == value) {
        result++;
      }
    }
    return result;
  },

  isVisible: function(element) {
    var style = window.getComputedStyle(element);
    var rect = element.getBoundingClientRect();

    return element.offsetWidth > 0 && element.offsetHeight > 0 &&
      style.visibility !== 'hidden' && style.display !== 'hidden';
  },

  fetchAboveRect: function(rect) {
    return { top: rect.top - rect.height, left: rect.left, width: rect.width, height: rect.height };
  },

  //
  // Return a rect that sits below the given rect.
  //
  // padding: a number added to the height of returned value. Defaults to zero.
  //
  fetchBelowRect: function(rect, padding) {
    if (!padding) padding = 0;
    return { top: rect.top + rect.height, left: rect.left, width: rect.width, height: rect.height + padding };
  },

  // padding: not required, defaults to zero.
  fetchLeftRect: function(rect, padding) {
    if (!padding) padding = 0;
    return { top: rect.top, left: rect.left - rect.width - padding, width: rect.width + padding, height: rect.height };
  },

  // padding: not required, defaults to zero.
  fetchRightRect: function(rect, padding) {
    if (!padding) padding = 0;
    return {
      top: rect.top,
      left: rect.left + rect.width,
      width: rect.width + padding,
      height: rect.height
    };
  },

  // Return right rect with a fixed width of 100 + padding.
  fetchFixedRightRect: function(rect, padding) {
    if (!padding) padding = 0;
    return {
      top: rect.top,
      left: rect.left + rect.width,
      width: 100 + padding,
      height: rect.height
    };
  },

  isIntersecting: function(rect, otherRect) {
    return rect.left < otherRect.left + otherRect.width && rect.left + rect.width > otherRect.left &&
      rect.top < otherRect.top + otherRect.height && rect.height + rect.top > otherRect.top;
  },

  stripMarkerChars: function(text) {
    return text.replace(':', '');
  },

  hasJQuery: function() {
    try {
      if (window.jQuery && $(document.body)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  sortVertically: function(inputs) {
    return inputs.sort(function(a, b) {
      var aBoundingRect = a.getBoundingClientRect();
      var bBoundingRect = b.getBoundingClientRect();

      if (aBoundingRect.top < bBoundingRect.top) {
        return -1;
      } else if (aBoundingRect.top > bBoundingRect.top) {
        return 1;
      } else {
        return 0;
      }
    });
  },

  extractTextNodes: function(element) {
    var childNodes = MaxwellForest.Helpers.toArray(element.childNodes);
    var textNodes = childNodes.filter(function(node) {
      return node.nodeType === 3; // Text node type.
    });
    var nonTextNodes = childNodes.filter(function(node) {
      return node.nodeType !== 3; // Text node type.
    });

    if (nonTextNodes.length > 0) {
      var nestedTextNodes = nonTextNodes.map(function(nonTextNode) {
        return MaxwellForest.Helpers.extractTextNodes(nonTextNode);
      });
      nestedTextNodes = MaxwellForest.Helpers.flatten(nestedTextNodes);
      textNodes = textNodes.concat(nestedTextNodes);
    }
    return textNodes;
  },

  randomUuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },

  addUuid: function(element) {
    element.mfuuid = element.mfuuid || MaxwellForest.Helpers.randomUuid();
  },

  getZIndex: function(element) {
    window.ZIndexCache = window.ZIndexCache || {};
    element.mfuuid = element.mfuuid || MaxwellForest.Helpers.randomUuid();

    if (window.ZIndexCache[element.mfuuid]) {
      return window.ZIndexCache[element.mfuuid];
    } else {
      var style = window.document.defaultView.getComputedStyle(element);
      if (style) {
        var zIndex = style.getPropertyValue('z-index');
        if ((isNaN(zIndex) || zIndex === '0') && element.parentNode) {
          zIndex = MaxwellForest.Helpers.getZIndex(element.parentNode);
        }

        window.ZIndexCache[element.mfuuid] = zIndex;
      }
      return zIndex;
    }
  },

  absoluteRect: function(elem) {
    var rect = elem.getBoundingClientRect();
    var doc = elem.ownerDocument;
    var win = doc.defaultView;
    var docElem = doc.documentElement;

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft,
      width: rect.width,
      height: rect.height
    };
  },

  ensureInViewport: function(element) {
    var windowRect = {
      top: window.pageYOffset,
      left: window.pageXOffset,
      width: window.innerWidth,
      height: window.innerHeight
    };
    return MaxwellForest.Helpers.isIntersecting(windowRect,
        MaxwellForest.Helpers.absoluteRect(element));
  },

  flatten: function(array) {
    var ret = [];
    for(var i = 0; i < array.length; i++) {
      if(Array.isArray(array[i])) {
        ret = ret.concat(MaxwellForest.Helpers.flatten(array[i]));
      } else {
        ret.push(array[i]);
      }
    }
    return ret;
  },

  fillInput: function(input, value) {
    if (value) {
      if (input.tagName === 'INPUT') {
        MaxwellForest.Helpers.fillTextInput(input, value);
      } else if (input.tagName === 'SELECT') {
        MaxwellForest.Helpers.fillSelect(input, value);
      } else if (input.tagName === 'TEXTAREA') {
        MaxwellForest.Helpers.fillTextArea(input, value);
      }
    }
  },

  fillTextInput: function(element, value) {
    if (element.value === value) {
      return;
    }
    element.focus();
    element.value = value;
    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', false, true);
    element.dispatchEvent(changeEvent);

    ['keypress', 'keyup', 'keydown'].forEach(function(eventType) {
      var keyboardEvent = document.createEvent('KeyboardEvent');
      keyboardEvent.initKeyboardEvent(eventType, true, true, document.defaultView, 0, 0, '', false, '');
      element.dispatchEvent(keyboardEvent);
    });
    element.blur();
  },

  fillTextArea: function(element, value) {
    if (element.value === value) {
      return;
    }
    element.focus();
    element.innerHTML = value;
    element.value = value;
    var changeEvent = document.createEvent('HTMLEvents');
    changeEvent.initEvent('change', false, true);
    element.dispatchEvent(changeEvent);

    ['keypress', 'keyup', 'keydown'].forEach(function(eventType) {
      var keyboardEvent = document.createEvent('KeyboardEvent');
      keyboardEvent.initKeyboardEvent(eventType, true, true, document.defaultView, 0, 0, '', false, '');
      element.dispatchEvent(keyboardEvent);
    });
    element.blur();
  },

  fillSelect: function(element, value) {
    var hasChanged = false;
    var selectedIndex = element.selectedIndex;
    if (selectedIndex != -1 &&
        element.options[selectedIndex].innerText.trim().toLowerCase() === value.trim().toLowerCase()) {
      return hasChanged;
    }
    MaxwellForest.Helpers.toArray(element.querySelectorAll('option')).forEach(function(option) {
      if (option.innerText.trim().toLowerCase() === value.trim().toLowerCase()) {
        element.value = option.value;
        hasChanged = true;
      }
    });
    if (hasChanged) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('change', false, true);
      element.dispatchEvent(event);
      if (MaxwellForest.Helpers.hasJQuery() && $(element) && $(element).trigger) {
        $(element).trigger('change');
      }
    }
    return hasChanged;
  },

  fillPhoneNumberWithSelect: function(select, input, value) {
    if(select.options.length <= 1) {
      return;
    }
    var prefexText = select.options[1].innerText;
    var prefixLength = select.options[1].innerText.length;
    if(prefexText.indexOf('0') === 0) {
      value = '0' + value;
    }

    if(prefexText.indexOf('+') !== -1) {
      MaxwellForest.Helpers.toArray(select.querySelectorAll('option')).forEach(function(option) {
        if (option.innerText.trim().toLowerCase().indexOf('+90') !== -1) {
          MaxwellForest.Helpers.fillSelect(select,option.innerText.trim().toLowerCase());
          prefixLength = 0;
        }
      });
    } else {
      MaxwellForest.Helpers.fillSelect(select, value.substring(0, prefixLength));
    }


    MaxwellForest.Helpers.fillTextInput(input, value.substring(prefixLength, value.length));
  },

  fillGender: function(element, value) {
    var filled = MaxwellForest.Helpers.fillSelect(element, value);
    if (!filled) {
      value = (value.toLowerCase() === "bay" ? "Erkek" : "Kadın");
      filled = MaxwellForest.Helpers.fillSelect(element, value);
    }
    if (!filled) {
      value = (value.toLowerCase() === "erkek" ? "Male" : "Female");
      filled = MaxwellForest.Helpers.fillSelect(element, value);
    }
  },

  fillMonth: function(element, value) {
    var month = value;
    var year = '';
    if (element.tagName === 'SELECT') {
      var isZeroPrefixed = MaxwellForest.Helpers.toArray(element.querySelectorAll('option')).filter(function(option) {
        return option.innerText.trim() === '01'
      }).length === 1;
      var hasNamedMonths = MaxwellForest.Helpers.toArray(element.querySelectorAll('option')).filter(function(option) {
        return option.innerText.trim() === 'Ocak'
      }).length === 1;
      var hasNamedAndNumberedMonths = MaxwellForest.Helpers.toArray(element.querySelectorAll('option')).filter(function(option) {
        return option.innerText.trim() === '01 - Ocak'
      }).length === 1;

      var namedMonths = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      if (isZeroPrefixed) {
        MaxwellForest.Helpers.fillSelect(element, month);
      } else if (hasNamedMonths) {
        var index = parseInt(month);
        MaxwellForest.Helpers.fillSelect(element, namedMonths[index - 1]);
      } else if (hasNamedAndNumberedMonths) {
        var index = parseInt(month);
        MaxwellForest.Helpers.fillSelect(element, month + ' - ' + namedMonths[index - 1]);
      } else {
        MaxwellForest.Helpers.fillSelect(element, parseInt(month).toString());
      }
    } else if (element.type === 'month') {
      element.value = year + '-' + month;
    } else {
      element.value = month;
    }
  },

  fillYear: function(element, value) {
    var shortYear = value.substring(2, 4);
    if (element.tagName === 'SELECT') {
      MaxwellForest.Helpers.fillSelect(element, value);
      MaxwellForest.Helpers.fillSelect(element, shortYear);
    } else if (element.maxLength && element.maxLength === 2) {
      element.value = shortYear;
    } else {
      element.value = value;
    }
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.Form = function(classifications) {
  this.classifications = classifications;
  this.correctProbability = 0;
};

MaxwellForest.Classification = function(identifier, heading, fields) {
  this.identifier = identifier;
  this.heading = heading;
  this.fields = fields;
};

MaxwellForest.Field = function(inputs, labels, correctLabel,
    correctProbability) {
  this.inputs = inputs;
  this.labels = labels;
  this.correctLabel = correctLabel;
  this.correctProbability = correctProbability;
  this.uuid = MaxwellForest.Helpers.randomUuid();
};

MaxwellForest.Field.punch = function(inputs, mapping) {
  var field = new MaxwellForest.Field(inputs, [], null, 0);
  field.mapping = mapping;
  return field;
};

MaxwellForest.Input = function(name, mapping, element, rect) {
  this.name = name;
  this.mapping = mapping;
  this.element = element;
  this.rect = rect;
};

MaxwellForest.Input.generate = function(selector) {
  var element = document.querySelector(selector);
  var uuid = MaxwellForest.Helpers.randomUuid();
  var input = new MaxwellForest.Input(uuid, null, element,
      MaxwellForest.Rect.fromBrowserRect(element.getBoundingClientRect()));
  return input;
};

MaxwellForest.Input.generateFromName = function(name) {
  if(document.getElementsByName(name).length > 0) {
    var element = document.getElementsByName(name)[0];
    var uuid = MaxwellForest.Helpers.randomUuid();
    var input = new MaxwellForest.Input(uuid, null, element,
        MaxwellForest.Rect.fromBrowserRect(element.getBoundingClientRect()));
    return input;
  }
};

MaxwellForest.Label = function(text, distance, position,
    correctProbability, rect, element) {
  this.text = text.trim();
  this.distance = distance;
  this.position = position;
  this.correctProbability = correctProbability;
  this.rect = rect;
  this.element = element;
};

MaxwellForest.Rect = function(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
};

MaxwellForest.Rect.fromBrowserRect = function(rect) {
  return new MaxwellForest.Rect(rect.left, rect.top, rect.width, rect.height);
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.FetchForms = {
  fetchPosition: function(rect, aboveRect, leftRect) {
    if ( MaxwellForest.Helpers.isIntersecting(aboveRect, rect)) {
      return 'above';
    } else if (MaxwellForest.Helpers.isIntersecting(leftRect, rect)) {
      return 'left';
    } else {
      return null;
    }
  },

  fetchDistance: function(rect, aboveRect, leftRect, position) {
    if (position === 'above') {
      return Math.abs(aboveRect.top + aboveRect.height - rect.top);
    } else if (position === 'left') {
      return Math.abs(leftRect.left + leftRect.width - rect.left);
    } else {
      return 0;
    }
  },

  fetchPlaceholderLabels: function(input) {
    var labels = [];
    if (input.placeholder) {
      labels.push({ text: input.placeholder.trim(), position: 'placeholder', element: input });
    }
    if (input.tagName === 'SELECT') {
      var innerText = input.querySelector('option') ?
        input.querySelector('option').innerText : '';
      labels.push({ text: innerText.trim(), position: 'placeholder', element: input });
    }
  },

  fetchLabels: function(textElements, input, rect, aboveRect, leftRect) {
    var scrollLeft = document.documentElement.scrollLeft?
                     document.documentElement.scrollLeft:document.body.scrollLeft;

    var surroundedBy = textElements.filter(function(textElement) {
      var textElementRect = textElement.getBoundingClientRect();
      var result = MaxwellForest.FetchForms.fetchPosition(textElementRect, aboveRect, leftRect) !== null &&
        MaxwellForest.Helpers.isVisible(textElement.parentNode) &&
        textElementRect.right + scrollLeft >= 0;
      return result;
    }).map(function(element) {
      var labelRect = element.getBoundingClientRect();
      var position = MaxwellForest.FetchForms.fetchPosition(labelRect, aboveRect, leftRect);
      var distance = MaxwellForest.FetchForms.fetchDistance(rect, labelRect, labelRect, position);
      return {
        text: MaxwellForest.Helpers.stripMarkerChars(element.innerText.trim()),
        element: element,
        position: position,
        distance: distance
      };
    });
    return surroundedBy.filter(function(marker) {
      return marker.text.trim() !== '';
    });
  },

  //
  // Group form fields by assuming fields run vertically and that there
  // aren't any more then 50px of space between the fields.
  //
  // This helps to figure out what form fields belong together so a login form
  // can be differentiated from a sign up form.
  //
  splitIntoForms: function(inputs) {
    var forms = [];
    var sortedInputs = MaxwellForest.Helpers.sortVertically(inputs);
    sortedInputs.forEach(function(input, index) {
      var pushedIntoForm = false;
      if (forms.length === 0) {
        forms.push([input]);
      } else {
        MaxwellForest.Helpers.flatten(forms).forEach(function(previous) {
          var currentInput = input;
          if (previous && !pushedIntoForm) {
            var previousInput = previous;
            var previousRect = previousInput.getBoundingClientRect();
            var previousBelowRect = MaxwellForest.Helpers.fetchBelowRect(previousRect, 50);
            var previousRightRect = MaxwellForest.Helpers.fetchFixedRightRect(previousRect, 50);
            var rect = currentInput.getBoundingClientRect();
            var hitsBelowRect = MaxwellForest.Helpers.isIntersecting(rect, previousBelowRect);
            var hitsRightRect = MaxwellForest.Helpers.isIntersecting(rect, previousRightRect);
            if (hitsBelowRect || hitsRightRect) {
              var formForPrevious = forms.filter(function(g) {
                return g.indexOf(previous) !== -1;
              })[0];
              formForPrevious.push(input);
              pushedIntoForm = true;
            }
          }
        });
        if (!pushedIntoForm) {
          forms.push([input]);
          pushedIntoForm = true;
        }
      }
    });
    return forms;
  },

  appendGetBoundingClientRect: function(element) {
    var getTextBoundingClientRect = function() {
      var range = document.createRange();
      range.selectNodeContents(this);
      return range.getBoundingClientRect();
    };
    element.getBoundingClientRect =
      getTextBoundingClientRect.bind(element);
    if (element.data) {
      element.innerText = element.data;
      element.text = element.data;
    }
    return element;
  },

  isRelevant: function(textElement) {
    var text = textElement.data.replace(':', '').replace(/[\s\n\r]+/g, ' ').trim();
    return MaxwellForest.MapInputs.hasMappingForLabel(text);
  },

  run: function() {
    var allElements = MaxwellForest.Helpers.extractTextNodes(document.body);
    var textElements = MaxwellForest.Helpers.toArray(allElements)
      .map(MaxwellForest.FetchForms.appendGetBoundingClientRect)
      .filter(MaxwellForest.FetchForms.isRelevant);

    var selectors = 'input, select, textarea';
    var inputs = MaxwellForest.Helpers.toArray(document.querySelectorAll(selectors)).filter(function(input) {
      return MaxwellForest.Helpers.isVisible(input) &&
        input.type !== 'submit' && input.type !== 'checkbox' &&
        input.type !== 'image' && input.type !== 'button';
    });
    inputs.forEach(MaxwellForest.Helpers.addUuid);

    var forms = MaxwellForest.FetchForms.splitIntoForms(inputs).map(function(inputs) {
      return inputs.map(function(input) {
        var rect = input.getBoundingClientRect();
        var aboveRect = MaxwellForest.Helpers.fetchAboveRect(rect);
        var leftRect = MaxwellForest.Helpers.fetchLeftRect(rect, 200);

        var labels = MaxwellForest.FetchForms.fetchLabels(textElements, input, rect, aboveRect, leftRect);
        return { input: input, labels: labels };
      });
    });

    return forms.filter(function(inputAndLabels) {
      return inputAndLabels.map(function(inputWithLabels) {
        return inputWithLabels.input;
      });
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.MarshalForms = {
  run: function(rawForms) {
    var classifications = rawForms.map(function(g) {
      var fields = g.map(function(f) {
        var i = f.input;
        var inputs = [new MaxwellForest.Input(i.mfuuid, null, i, MaxwellForest.Rect.fromBrowserRect(i.getBoundingClientRect()))];
        var labels = f.labels.map(function(l) {
          return new MaxwellForest.Label(l.text, l.distance, l.position, 0,
              l.element.getBoundingClientRect(), l.element);
        });
        return new MaxwellForest.Field(inputs, labels, null, 0);
      });
      return new MaxwellForest.Classification('unknown', 'unknown', fields);
    });
    return new MaxwellForest.Form(classifications);
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.HighlightForms = {
  colors: [
    'rebeccapurple',
    'yellowgreen',
    'violet',
    'turquoise',
    'tomato',
    'springgreen',
    'skyblue',
    'salmon',
    'royalblue',
    'powderblue',
    'plum',
    'palegreen',
    'orangered',
    'mediumturquoise',
    'lightpink',
    'lightcoral',
    'lawngreen',
    'indigo',
    'hotpink',
    'greenyellow',
    'dodgerblue',
    'deepskyblue'
  ],

  originalBorders: [],
  hasRun: false,

  pushOriginalBorder: function(element) {
    if (!MaxwellForest.HighlightForms.hasRun) {
      var originalValue = {
        element: element,
        border: element.style.border || ''
      };
      MaxwellForest.HighlightForms.originalBorders.push(originalValue);
    }
  },

  run: function(form) {
    MaxwellForest.HighlightForms.reset();
    var index = 0;
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        var color = MaxwellForest.HighlightForms.colors[index];
        field.inputs.forEach(function(input) {
          MaxwellForest.HighlightForms.pushOriginalBorder(input.element);
          input.element.style.background = color;
        });
        field.labels.forEach(function(label) {
          if (label.element && label.element.parentNode) {
            MaxwellForest.HighlightForms.pushOriginalBorder(label.element.parentNode);
            label.element.parentNode.style.background = color;
          }
        });
        index += 1;
      });
    });
    MaxwellForest.HighlightForms.hasRun = true;
  },

  reset: function() {
    MaxwellForest.HighlightForms.originalBorders.forEach(function(originalValue) {
      originalValue.element.style.border = originalValue.border;
    });
    MaxwellForest.HighlightForms.hasRun = false;
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.GroupInlineInputs = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      var horizontalFields = MaxwellForest.GroupInlineInputs.groupHorizontalFields(classification);
      horizontalFields = MaxwellForest.GroupInlineInputs.removeFieldsWithAboveLabel(horizontalFields);
      horizontalFields = MaxwellForest.GroupInlineInputs.splitOnLeftDistance(horizontalFields);
      MaxwellForest.GroupInlineInputs.mergeInlineInputs(classification, horizontalFields);
    });
  },

  removeFieldFromClassification: function(classification, field) {
    classification.fields = classification.fields.filter(function(f) { return f.uuid !== field.uuid; })
  },

  groupHorizontalFields: function(classification) {
    var horizontalFields = {};

    classification.fields.forEach(function(field, index) {
      var rect = field.inputs[0].rect;
      var key = rect.top.toString() + '-' + rect.height.toString();
      if (index > 0) {
        var previousField = classification.fields[index - 1]
        if (horizontalFields[key]) {
          horizontalFields[key].push(field);
        } else {
          horizontalFields[key] = [field];
        }
      } else {
        horizontalFields[key] = [field];
      }
    });

    return horizontalFields;
  },

  removeFieldsWithAboveLabel: function(horizontalFields) {
    Object.keys(horizontalFields).forEach(function(key) {
      var fields = horizontalFields[key];
      fields = fields.filter(function(field, index) {
        return !field.labels.some(function(label) {
          if (index !== 0) {
            var isntSameTopLabelAsLeaderField =
              fields[0].labels.map(function(l) { return l.text; }).indexOf(label.text) === -1;
            return label.position === 'above' && isntSameTopLabelAsLeaderField;
          }
        });
      });
      horizontalFields[key] = fields;
    });
    return horizontalFields;
  },

  mergeInlineInputs: function(classification, horizontalFields) {
    Object.keys(horizontalFields).forEach(function(key) {
      var fields = horizontalFields[key];
      var leaderField = fields[0];
      var correctField = classification.fields.filter(function(f) { return f.uuid === leaderField.uuid; })[0];
      if (fields.length > 1) {
        fields.forEach(function(field) {
          if (field !== leaderField) {
            correctField.inputs = correctField.inputs.concat(field.inputs);
            correctField.labels = correctField.labels.concat(field.labels);
            MaxwellForest.GroupInlineInputs.removeFieldFromClassification(classification, field);
          }
        });
      }
    });
  },

  splitOnLeftDistance: function(horizontalFields) {
    var splitFields = {};
    var currentIndex = 0;
    Object.keys(horizontalFields).forEach(function(key) {
      var fields = horizontalFields[key];
      var previousField = null;
      fields.forEach(function(field) {
        if (previousField !== null) {
          var previousRect = previousField.inputs[0].rect;
          if (previousRect.left + previousRect.width + 60 > field.inputs[0].rect.left) {
            splitFields[currentIndex.toString()].push(field);
          } else {
            currentIndex += 1;
            splitFields[currentIndex.toString()] = [field];
          }
        } else {
          currentIndex += 1;
          splitFields[currentIndex.toString()] = [field];
        }
        previousField = field;
      });
    });
    return splitFields;
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.RemoveDoubledUpLabels = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        var leftLabelsInTolerance =
          MaxwellForest.RemoveDoubledUpLabels.leftLabelsInTolerance(field);
        field.labels = field.labels.filter(function(label) {
          if (label.position === 'left') {
            return leftLabelsInTolerance.indexOf(label) !== -1;
          } else {
            return true;
          }
        });
      });
    });
  },

  leftLabelsInTolerance: function(field) {
    var tolerance = 20;
    var labels = field.labels.filter(function(label) {
      return label.position === 'left';
    }).sort(function(a, b) { return a.distance - b.distance; });
    var previousRect = null;
    labels = labels.filter(function(label) {
      if (previousRect === null) {
        previousRect = label.rect;
        return true;
      } else if (label.rect.right + tolerance > previousRect.left) {
        previousRect = label.rect;
        return true;
      } else {
        return false;
      }
    });
    return labels;
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.AddExtraLabels = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        var labelsAsText = field.labels.map(function(l) { return l.text; });
        if (labelsAsText.filter(MaxwellForest.MapInputs.hasMappingForLabel).length === 0) {
          var element = field.inputs[0].element;
          var rect = MaxwellForest.Rect.fromBrowserRect(
              element.getBoundingClientRect());
          if (element.placeholder) {
            var label = new MaxwellForest.Label(element.placeholder, 0,
                'placeholder', 0, rect, element);
            field.labels.push(label);
          } else if(element.value) {
            var text;
            if(element.tagName === 'SELECT' && element.options.length > 1) {
              text = element.options[1].innerText;
            } else {
              text = element.value;
            }

            var label = new MaxwellForest.Label(text, 0,
                'value', 0, rect, null);
            field.labels.push(label);
          }

          if (element.tagName === 'SELECT' && element.options.length > 0) {
            var text = element.options[0].innerText;
            var label = new MaxwellForest.Label(text, 0, 'placeholder', 0,
                rect, element);
            field.labels.push(label);
          }
        }
      });
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.StripNonWordLabels = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        field.labels = field.labels.filter(function(label) {
          return !label.text.trim().match(/^\W+$/);
        });
      });
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.CombineLabels = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        var allLeftLabels = field.labels.filter(function(label) {
          return label.position === 'left';
        });

        var groupedLeftLabels = MaxwellForest.CombineLabels.groupLabelsByParent(allLeftLabels);
        var allLabels = field.labels.filter(function(label) {
          return label.position !== 'left';
        });
        groupedLeftLabels.forEach(function(leftLabels) {
          if (leftLabels.length > 1) {
            var text = '';
            var right = 0;
            var sortedLabels = leftLabels.sort(MaxwellForest.CombineLabels.byRectPosition);
            sortedLabels.forEach(function(label) {
              var rect = label.rect;
              if (right === 0 || rect.left < right + 20) {
                text += label.text;
                right = rect.left + rect.width;
              }
            });
            var firstLabel = sortedLabels[0];
            var firstRect = firstLabel.rect;
            var adjustRect = new MaxwellForest.Rect(firstRect.left, firstRect.top,
                right - firstRect.left, firstRect.height);
            allLabels.push(new MaxwellForest.Label(text, firstLabel.distance,
                firstLabel.position, 0, adjustRect, firstLabel.element));
          } else {
            allLabels = allLabels.concat(leftLabels);
          }
        });
        field.labels = allLabels;
      });
    });
  },

  byRectPosition: function(a, b) {
    if (a.rect.left < b.rect.left) {
      return -1;
    } else if (a.rect.left > b.rect.left) {
      return 1;
    } else {
      return 0;
    }
  },

  groupLabelsByParent: function(leftLabels) {
    var groups = {};
    leftLabels.forEach(function(label) {
      var textNode = label.element.parentNode;
      var container = textNode.parentNode;
      if (!container.mfuuid) MaxwellForest.Helpers.addUuid(container);
      var key = container.mfuuid;
      if (groups[key]) {
        groups[key].push(label);
      } else {
        groups[key] = [label];
      }
    });

    return Object.keys(groups).map(function(key) {
      return groups[key];
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.AssignLabelsFromProbability = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      var probabilities = { above: null, left: null, placeholder: null };
      Object.keys(probabilities).forEach(function(position) {
        if (position === 'placeholder') {
          MaxwellForest.AssignLabelsFromProbability.addPlaceholder(classification,
              probabilities, position);
        } else {
          MaxwellForest.AssignLabelsFromProbability.addPosition(classification,
              probabilities, position);
        }
      });
      var correctPosition =
        MaxwellForest.AssignLabelsFromProbability.highestProbability(probabilities);
      MaxwellForest.AssignLabelsFromProbability.appendExtraLabels(classification, correctPosition);
      MaxwellForest.AssignLabelsFromProbability.assignLabelProbability(classification, probabilities);
    });
  },

  addPlaceholder: function(classification, probabilities, position) {
    var inputCount = 0;
    var placeholderCount = 0;
    classification.fields.forEach(function(field) {
      field.inputs.forEach(function(input) {
        var element = input.element;
        if (element.placeholder && element.placeholder !== '') {
          placeholderCount += 1;
        }
        inputCount += 1;
      });
      probabilities[position] = placeholderCount / inputCount;
    });
  },

  addPosition: function(classification, probabilities, position) {
    var fieldCount = classification.fields.length;
    var labelCount = 0;
    classification.fields.forEach(function(field) {
      labelCount += field.labels.filter(function(label) {
        return label.position === position;
      }).length;
    });
    probabilities[position] = labelCount / fieldCount;
  },

  highestProbability: function(probabilities) {
    var result = Object.keys(probabilities).map(function(key) {
      return { position: key, probability: probabilities[key] };
    }).sort(function(a, b) {
      return a.probability - b.probability;
    });
    result.reverse();
    return result[0].position;
  },

  appendExtraLabels: function(classification, correctPosition) {
    if (correctPosition === 'placeholder') {
      classification.fields.forEach(function(field) {
        field.inputs.forEach(function(input) {
          var element = input.element;
          var hasPlaceholders = field.labels.some(function(l) {
            return l.position === 'placeholder';
          });
          if (element.placeholder && element.placeholder !== '' && !hasPlaceholders) {
            var rect = MaxwellForest.Rect.fromBrowserRect(
                element.getBoundingClientRect());
            var label = new MaxwellForest.Label(element.placeholder, 0,
                'placeholder', 0, rect, element);
            field.labels.push(label);
          }
        });
      });
    }
  },

  assignLabelProbability: function(classification, probabilities) {
    classification.fields.forEach(function(field) {
      field.labels.forEach(function(label) {
        label.correctProbability = probabilities[label.position];
      });
    });
  }
}
;
MaxwellForest.json = [
  {
    "mapping": "year",
    "labels":[
      "Yıl",
      "Yil",
      "Yıl*",
      "[Yıl]",
      "Yıl..",
      "Doğum Yılı",
      "Doğum yılı",
      "1915",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025"
    ],
    "en":[
      "year",
      "year of birth",
      "1915",
      "2015"
    ]
  },
  {
    "mapping": "address",
    "labels":[
      "*Street",
      "Adres(*)",
      "Adres",
      "Adres Giriniz",
      "* Adres",
      "Adres *",
      "Adresiniz",
      "ADRES",
      "Adresler",
      "Adres*",
      "Address",
      "adres",
      "Adresiniz *",
      "Adres 1",
      "Adres 2",
      "Adres Satırı",
      "Adres Satırı 1",
      "Adres Satırı 2",
      "Adres Bilgisi ve Tarifi",
      "Açık Adres",
      "Adres Adı (ev",
      "Adres Adı (ev, iş vs.)",
      "Lütfen alıcının adres bilgilerini giriniz",
      "Alıcı Adresi ve Tarifi",
      "Alıcı Adresi",
      "Teslimat Adresi",
      "Teslimat Adresi *",
      "Cadde \/ Sokak \/ Bina",
      "2. Adresiniz",
      "1. Adresiniz",
      "Teslim Yerinin Adı ve Adres Tarifi",
      "Adres Seç",
      "Adres TanımıAdres",
      "75 ↵ karakter daha kullanılabilir.Ek adres",
      "Açık Adres (Mahalle, Sokak, Bina No...)",
      "Adres Detayı",
      "Adres Bilgisi",
      "Fatura Adresi",
      "Fatura Adresi*",
      "Fatura Bilgileri"
    ],
    "en":[
      "address",
      "address 1",
      "address 2",
      "address line",
      "address line 1",
      "address line 2",
      "address and directions",
      "full address",
      "home address name",
      "please recipient's address information",
      "recipient address and directions",
      "shipping address",
      "in mahallecad \/ street \/ building",
      "second address",
      "1 address",
      "where to pick up name and address of recipe",
      "select address",
      "tanımıadres address",
      "75 ↵ character more kullanılabilirek address"
    ]
  },
  {
    "mapping": "addressFirstName",
    "labels":[
      "Alıcı Adı"
    ],
    "en":[
    ]
  },
  {
    "mapping": "addressSurname",
    "labels":[
      "Alıcı Soyadı"
    ],
    "en":[
    ]
  },
  {
    "mapping": "addressRecipient",
    "labels":[
      "* Teslimat Adı",
      "* Teslimat Soyadı",
      "Alıcı Ad Soyad",
      "Alıcının Adı Soyadı",
      "Alıcı Adı Soyadı *",
      "Alıcı Adı Soyadı",
      "Kayıtlı Adresleriniz",
      "Kayıtlı Adreslerim",
      "Teslimat yapılacak kişi",
      "Teslim Alacak Kişinin Adı",
      "Teslim alacak kişi",
      "Teslim Alacak 2. Kişinin Adı",
      "Ad SoyadAdres"
    ],
    "en":[
      "delivery name",
      "delivery surname",
      "recipient name and surname",
      "recipient's name and surname",
      "registered address",
      "delivery to person",
      "delivery will take person's name",
      "person's name will take delivery of two",
      "soyadadres name"
    ]
  },
  {
    "mapping": "turkishIdNumber",
    "labels":[
      "Vergi\/Vatandaşlık numarası",
      "Vergi Numarası",
      "Vergi Numaranız",
      "Vergi No",
      "Vergi No\/Kimlik No **",
      "Vergi dairesi",
      "Vergi Dairesi",
      "Vergi Daireniz",
      "T.C.",
      "TC",
      "T.C.\/Vergi No",
      "T.C. Kimlik NumarasıAdres",
      "T.C Kimlik No",
      "T.C. Kimlik No",
      "TC Kimlik No",
      "TC Kimlik No*",
      "Tc Kimlik No",
      "TC Kimlik Numarası",
      "T.C. Kimlik No *?",
      "TC Kimlik No *",
      "T.C. Kimlik Numarası",
      "T.C. Kimlik No \/ Vergi No",
      "TC Kimlik Numaranız",
      "T.C. Kimlik Numaranız",
      "Tc No",
      "GGVergi\/Vatandaşlık numarası",
      "TC kimlik no",
      "T.CKimlik No"
    ],
    "en":[
      "tax \/ social security number",
      "tax number",
      "tax number \/ id number",
      "tax office",
      "tc",
      "tc \/ tax number",
      "tc id numarasıadres",
      "tc identification number",
      "tc identification number \/ tax number",
      "tc identification numbers",
      "tc no.",
      "id card",
      "ggverg \/ citizenship id"
    ]
  },
  {
    "mapping": "fax",
    "labels":[
      "Faks",
      "Fax"
    ],
    "en":[
      "fax"
    ]
  },
  {
    "mapping": "cvv",
    "labels":[
      "Kart CVV numarası *",
      "KART GÜVENLİK NO (CVV)",
      "CCV",
      "CCV Numarası",
      "Güvenlik Kodu",
      "Güvenlik Kodu (CCV)",
      "CV2",
      "CV2 Numarası",
      "Güvenlik Numarası (Cv2)",
      "CVC",
      "CVV",
      "CVV\/CVC",
      "CVV \/ GÜVENLİK KODU",
      "Güvenlik kodu (cvv)*",
      "Güvenlik Kodu(CVV)",
      "CVV Güvenlik Kodu",
      "CVC numarası",
      "Güvenlik Kodu (CVC No)",
      "Güvenlik Numarası (CVV)",
      "Güvenlik No ( CVV )",
      "Güvenlik No (CV2) *",
      "Güvenlik (CVV) No",
      "CVC2",
      "Cvv2",
      "Güvenlik Kodu (CVV2)",
      "Güvenlik kodu (CVV2)",
      "Güvenlik Kodu (CVC2)",
      "Kart Güvenlik Kodu(CVC)",
      "Kart Güvenlik Numarası",
      "Kartınızın arkasında yazan güvenlik kodunu giriniz.",
      "Güvenlik Kodu (CV2)",
      "CVV Güvenlik KoduBu Nedir?",
      "CVV (kredi kartınızın arkasındaki son üç hane)",
      "Kart TipiGüvenlik Numarası (Cv2)",
      "Güvenlik Kodu “",
      "Güvenlik Kodu “",
      "Güvenlik KoduE-posta",
      "Güvenlik Numarası",
      "GÜVENLİK NO",
      "Güvenlik Metni",
      "Güvenlik Numarası(Kredi kartı arkasındaki 3 haneli rakam)",
      "GÜVENLİK KODU",
      "Güvenlik Kodunuz",
      "CVC numarası"
    ],
    "en":[
      "card cvv number",
      "card cvv security number",
      "ccv",
      "ccv numbers",
      "ccv security code",
      "cv2",
      "cv2 id",
      "cv2 security number",
      "cvv",
      "cvv \/ cvv",
      "cvv \/ security code",
      "cvv security code",
      "cvv security code number",
      "cvv security number",
      "cvv2",
      "cvv2 security code",
      "card security code cvv",
      "card security number",
      "please security code by back of card",
      "security code cv2",
      "what is cvv security kodub",
      "last three digits on back of credit card cvv",
      "tipigüvenlik card number cv2",
      "security code",
      "security code",
      "security code approval",
      "security code email",
      "security number",
      "security text"
    ]
  },
  {
    "mapping": "phoneAreaCode",
    "labels":[
      "Telefon Alan Kodu"
    ],
    "en":[
      "phone area code"
    ]
  },
  {
    "mapping": "addressTitle",
    "labels":[
      "Adres Adres Adı",
      "Adres İsmi",
      "Adres Adı",
      "Adres Kısa Adı",
      "Adres Etiketi",
      "YENİ ADRESAdres Başlığı",
      "Gelecekte başvurmak için lütfen adreslere bir başlık atayınız.",
      "ADRES BAŞLIĞI",
      "Sokak",
      "Adres Başlığı",
      "Adres Başlığı *",
      "Adres başlığı",
      "Adres Başlığı*",
      "Adres Tanımı (Örn. Ev Adresim)",
      "Adres Tanımı",
      "Yazışma Unvanı",
      "Yeni adres tanımı"
    ],
    "en":[
      "address address name",
      "address name",
      "address short name",
      "address tag",
      "adresadres new title",
      "please assign a title to address for future reference",
      "title at address",
      "street",
      "address header"
    ]
  },
  {
    "mapping": "day",
    "labels":[
      "Gün"
    ],
    "en":[
      "day"
    ]
  },
  {
    "mapping": "cardNumber",
    "labels":[
      "1234 5678 9012 3456",
      "Kredi \/ Banka Kartı Numarası",
      "Kredi Kartı",
      "Kredi Kartı \/ Banka Kartı No",
      "Kredi Kartı Numarası",
      "Kredi Kart No",
      "Kredi kartı numarası",
      "KREDİ KARTI NUMARASI",
      "Kredi Kart Numarası",
      "Kredi Kartı No",
      "Kart Numaranız",
      "Kart Numarası",
      "Kart numarası",
      "Kart Numarası *",
      "Kart no",
      "Kart No",
      "*Kart No",
      "Kart Numarası*",
      "KART NO",
      "* Kart No",
      "Kart Numarasi",
      "Kartınızın ön yüzündeki alanları doldurunuz",
      "Kredikartı Numarası (CCNo)",
      "KART NUMARASI",
      "Kartın numarası",
      "Kartın numarası *",
      "xxxx",
      "****",
    ],
    "en":[
      "credit \/ debit card numbers",
      "credit card",
      "credit card \/ debit card number",
      "credit card number",
      "card number",
      "please fill out fields in front of card",
      "kredikart number ccno"
    ]
  },
  {
    "mapping": "cardExpiryMonth",
    "labels":[
      "Son Kullanma Tarihi - Ay:"
    ],
    "en":[

    ]
  },
  {
    "mapping": "firstName",
    "labels":[
      "*First Name",
      "First name",
      "Takma Ad",
      "Rumuz *",
      "İsim*",
      "İsim *",
      "İsim",
      "Ad:*"
    ],
    "en":[
      "first name",
      "nickname"
    ]
  },
  {
    "mapping": "mobileNumber",
    "labels":[
      "Cep Telefonu",
      "Cep telefonu",
      "* Cep Telefonu",
      "Cep Telefonu*",
      "Cep Telefonu *",
      "CEP TELEFONU",
      "Cep telefonu *",
      "cep telefonu",
      "Cep Telefon",
      "Cel Telefonu *",
      "Mobile",
      "Mobil No",
      "Cep Telefonunuz",
      "Cep Telefonunuz *",
      "Mobil Telefon",
      "Cep Telefonu (0)",
      "Cep Telefon No",
      "Cep Telefonu Numarası",
      "Cep Telefonu Numaranız",
      "Cep Telefon Numaranız",
      "Cep Telefonu numaranız veya e-posta adresinizi giriniz",
      "Cep TelefonuAdres",
      "* Cep TelefonuÖrnek5xxxxxxxxx (10 karakter)",
      "Cep Tel.",
      "Diğer Telefon",
      "Gsm(*)",
      "Gsm",
      "GSM",
      "GSM No",
      "Telefon (GSM)",
      "GSM0",
      "+1(___) ___ __ __"
    ],
    "en":[
      "cell phone",
      "mobile",
      "mobile number",
      "mobile phone",
      "mobile phone 0 ex 2163260210",
      "mobile phone number",
      "mobile phone number or email email",
      "mobile telefonuadres",
      "mobile telefonuörnek5xxxxxxxxx 10 characters",
      "mobile wire",
      "other phone",
      "gsm",
      "gsm phone",
      "gsm0",
      "our address for contacting you about order, please mobile phone number"
    ]
  },
  {
    "mapping": "businessPhoneNumber",
    "labels":[
      "İş Telefonunuz",
      "İş Telefonu"
    ],
    "en":[
      "business phone",
      "work phone"
    ]
  },
  {
    "mapping": "businessName",
    "labels":[
      "Şirket",
      "Firma\/Şahıs Adı",
      "Şirket Adı",
      "Firma İsmi",
      "Firma Ünvanı",
      "Firma",
      "Çalıştığınız Firma",
      "Firma Adı"
    ],
    "en":[
      "company",
      "company \/ individual name",
      "company name",
      "company title",
      "firm",
      "work company",
      "trade name"
    ]
  },
  {
    "mapping": "country",
    "labels":[
      "Ülke",
      "Ülke *",
      "Ülke*",
      "Country",
      "[Ülke]",
      "Ülke (Teslimat) *",
      "Ülke Seçiniz",
      "Ülke seçiniz.",
      "Türkiye"
    ],
    "en":[
      "country",
      "country of delivery",
      "select country",
      "turkey"
    ]
  },
  {
    "mapping": "province",
    "labels":[
      "İl\/İlçe",
      "İl \/ İlçe",
      "İl(*)",
      "İl",
      "İl*",
      "Teslimat İl *",
      "İl Seçiniz *",
      "İl Seçiniz",
      "Teslimat İli",
      "Şehir",
      "Şehir*",
      "Şehir *",
      "Sehir *",
      "şehir",
      "[Şehir]",
      "ŞEHİR",
      "Şehir \/ Eyalet",
      "Şehir (Teslimat) *",
      "Şehir Seçiniz",
      "Şehir Seçiniz *",
      "Lütfen Şehir Seçiniz",
      "Şehrinizi Seçiniz",
      "Adres Şehir Seçiniz"
    ],
    "en":[
      "city",
      "city \/ county",
      "city \/ state",
      "city delivery",
      "city of delivery",
      "choose city",
      "neighborhood",
      "please select city",
      "select city",
      "town",
      "town \/ city",
      "you choose city",
      "public address neighborhood"
    ]
  },
  {
    "mapping": "town",
    "labels":[

      "County \/ state",

      "İlçe Seçiniz *",
      "İlçe Seçiniz",
      "İlçe seçimi yapınız",
      "Ilce *",
      "İlçe \/ Semt",
      "İlçe\/Semt",
      "İlçe \/ Semt*",
      "İlçe\/Bölge",
      "İlçe(*)",
      "İlçe",
      "İlçe*",
      "İLÇE",
      "ilçe",
      "[İlçe]",
      "Teslimat İlçe \/ Semt *",
      "Semt \/ İlçe *",
      "Semt\/İlçe",
      "Fatura İlçe \/ Semt",
      "Semt",
      "Semt*",
      "semt",
      "Semt Seçiniz",
      "Teslim Edilecek Semt",
      "Semt \/ Mahalle",
      "Town \/ city",
      "Açık Adres (Mahalle",
      "ALADAĞ"
    ],
    "en":[
      "county",
      "county \/ district",
      "county \/ region",
      "county \/ state",
      "delivery town \/ district",
      "district \/ county",
      "district \/ neighborhood",
      "invoices town \/ district",
      "select neighborhood",
      "select town",
      "sign county selection",
      "province",
      "it will be delivered to district"
    ]
  },
  {
    "mapping": "postcode",
    "labels":[
      "Posta Kodu",
      "Posta kodu",
      "Postcode \/ zip",
      "Zip\/Posta Kodu",
      "Posta Kodu *"
    ],
    "en":[
      "post code",
      "postcode \/ zip",
      "zip \/ postal code"
    ]
  },
  {
    "mapping": "cardholderName",
    "labels":[
      "Kart İsim & Soyisim",
      "Kart Üzerindeki Ad \/ Soyad",
      "Kart Sahibi",
      "Kart Sahibi Adı Soyadı",
      "Kredi kartı sahibi adı soyadı",
      "Kart Sahibi Adı",
      "Kart Sahibi İsmi",
      "Adı Soyadı",
      "İsim ve Soyadınız",
      "Adınız ve Soyadınız",
      "Kart Sahibini Adı-Soyadı",
      "Kart Üzerindeki Ad Soyad",
      "Kart Üzerindeki İsim ve Soyisim",
      "Kart Sahibinin Adı Soyadı",
      "Kart Sahibinin Adı",
      "* Kart Sahibinin Adı",
      "Kart Üzerindeki İsim",
      "Kart üzerindeki isim",
      "Kartın üzerindeki isim",
      "Kartın üstündeki isim *",
      "Kart Üzerindeki Ad - Soyad",
      "Kart Üzerindeki Isim",
      "Kart üzerindeki isim soyisim",
      "Kartın üzerindeki isim...",
      "Kart Sahibi Adı, Soyadı",
      "Kart Üzerindeki Ad ve Soyad",
      "Kart Sahibi",
      "Kart sahibi",
      "Kart Üzerindeki Ad Soyad *",
      "KART ÜZERİNDEKİ İSİM",
      "Kart Sahibinin Ad ve Soyadı"
    ],
    "en":[
      "card name & surname",
      "card on name \/ surname",
      "cardholder's name, surname",
      "credit card holder's name, surname",
      "cardholder name",
      "name and surname",
      "name and surname of cardholder",
      "name and surname on card",
      "name of card holder surname",
      "name of cardholder",
      "name on card",
      "name on card - name",
      "on name card",
      "surname name on card"
    ]
  },
  {
    "mapping": "surname",
    "labels":[
      "*Last Name",
      "Soyadınızı yazınız",
      "Last name",
      "Soyad",
      "Soyad(*)",
      "Soyadı",
      "Soyadınız",
      "* Soyadınız",
      "Soyad*",
      "Soyad *",
      "Soyisim *",
      "Soyisim",
      "Soyadı *",
      "Soyadınız*",
      "Soyadınız *",
      "Soyad:",
      "Soyad \/ Ünvan",
      "Başlık(*)",
      "Başlık",
      "Title"
    ],
    "en":[
      "create surname",
      "last name",
      "surname",
      "surname \/ title",
      "title"
    ]
  },
  {
    "mapping": "cardExpiryYear",
    "labels":[
      "Son Kullanma Tarihi - Yıl",
    ],
    "en":[

    ]
  },
  {
    "mapping": "email",
    "labels":[
      "*E-mail Address",
      "* Email Address",
      "E-Posta",
      "E-posta adresinizi yazın",
      "Email",
      "Email Tekrar",
      "E-Posta Adresi",
      "E-Posta Adresiniz",
      "Email Adresiniz",
      "E-posta",
      "e-posta",
      "E-posta adresiniz",
      "E-mail",
      "E-mail *",
      "* E-POSTA",
      "E-mail adresi",
      "E-Posta*",
      "E-posta Adresiniz",
      "E-Posta *",
      "E-posta adresi",
      "E-posta Adresi",
      "E-mail adresi *",
      "E-mail Adresi *",
      "E-postanız",
      "E-POSTA",
      "E-mail Adresiniz",
      "E-mail Adresiniz *",
      "E-posta *",
      "E-posta*",
      "E-Posta adresi",
      "E-Posta adresi*",
      "E-posta adresinizi yazınız.",
      "E-posta adresinizi yazınız",
      "E-Posta veya Kullancı Adı",
      "Kullanıcı Adı veya E-posta",
      "E Posta Adresiniz",
      "Email address",
      "E-Mail",
      "E-Mail *",
      "* E-Posta",
      "Eposta Adresi",
      "E-mail Adresi",
      "E-Mail Adresiniz",
      "E-posta Adresiniz*",
      "Eposta adresi",
      "Email Adresi",
      "e-posta adresinizi girin",
      "Email Adresinizi Giriniz",
      "Mail Adresi",
      "E-posta:",
      "E-Posta:",
      "E-Posta Adresi\/Kullanıcı Adı",
      "E-Posta (Tekrar)",
      "E-posta Tekrar",
      "Email Adresiniz (tekrar)",
      "E-Posta Tekrarı",
      "E-mail Adresiniz (Tekrar)",
      "E-mail Adresiniz (Tekrar)*",
      "E-Mail Adresiniz Tekrar",
      "E-posta Adresi Tekrar",
      "E-Posta Adresi (Tekrar)",
      "e-posta adresinizi tekrar girin",
      "E-posta tekrar",
      "E-Posta Tekrar",
      "E-Posta Doğrula",
      "E-Mail veya Kullanıcı Adı",
      "E-Posta (Kullanıcı Adı) *",
      "Üye Girişi",
      "ÜYE GİRİŞİ",
      "Giriş kullanıcı adı...",
      "Üye Adı veya e-posta Adresi",
      "Kullanıcı Adınız",
      "Kullanıcı Adı (E-Posta)",
      "Kullanıcı Adı Seçin",
      "Kullanıcı Adı",
      "Kullanıcı adı",
      "Bir üye adı seçin",
      "Üye olE-posta",
      "Örnek:ahmet@hotmail.com",
      "Eposta Adresiniz",
      "Mail Adresiniz",
      "Mail Adresiniz *",
      "Mail"
    ],
    "en":[
      "email",
      "email \/ username",
      "email again",
      "email confirmed",
      "email or username",
      "email user name",
      "login",
      "login username",
      "member name or email",
      "username",
      "username email",
      "choose a user name",
      "choose a member name",
      "members olemail",
      "Örnekahmet @ hotmailcom"
    ]
  },
  {
    "mapping": "cardType",
    "labels":[
      "Kredi Kartı Tipi “",
      "Kredi Kartı Tipi “",
      "Kredi Kart Seçimi",
      "Kredi Kartı Seçimi",
      "Kredi Kartınızı Seçiniz",
      "Kredi Kartı Seçiniz",
      "Kart Türü",
      "Kart Tipi",
      "Kart tipi",
      "Kart Tipi *",
      "[Kart Tipi]",
      "Visa",
      "VISA",
      "Visa\/MasterCard",
      "Visa\/MC secimi",
      "Credit Card Type"
    ],
    "en":[
      "credit card type",
      "credit card type",
      "credit card selection",
      "choose credit card",
      "card type",
      "visa",
      "visa \/ mastercard",
      "visa \/ mc secimi"
    ]
  },
  {
    "mapping":"billingAddress",
    "labels":[
    ],
    "en":[
      "billing address",
      "billing information"
    ]
  },
  {
    "mapping": "gender",
    "labels":[
      "Cinsiyet",
      "CİNSİYET",
      "* Cinsiyet",
      "Cinsiyet*",
      "[Cinsiyet]",
      "Bebeğinizin cinsiyeti?",
      "Cinsiyetiniz",
      "Kadın",
      "Ünvan*",
      "Cinsiyet*",
      "Cinsiyet*:",
      "Cinsiyet *",
      "M",
      "k",
      "FeMale",
      "Hitap"
    ],
    "en":[
      "sex",
      "sex of baby",
      "gender",
      "woman"
    ]
  },
  {
    "mapping": "fullName",
    "labels":[
      "Ad",
      "Ad(*)",
      "Adı",
      "Adınız Soyadınız",
      "Adınız Soyadınız",
      "Adınız",
      "Adınız soyadınız",
      "* Adınız",
      "Ad *",
      "Adınız *",
      "ADINIZ",
      "SOYADINIZ",
      "Adınız*",
      "Ad*",
      "Ad:",
      "Ad \/ Şirket Ad",
      "Ad Soyad \/ Firma Adı",
      "Ad, Soyad \/ Firma Adı*",
      "Adı SoyadıAdres",
      "Ad Soyad",
      "Ad\/Soyad",
      "AD SOYAD",
      "Ad Soyad *",
      "ad soyad",
      "Ad \/ Soyad",
      "Ad soyad",
      "Ad Soyad*",
      "Karta Yazılacak İsim",
      "Adınız SoyadınızE-Posta Adresiniz",
      "Adınızı yazınız",
      "* Profil Adı",
      "Örnek:Ahmet Yılmaz",
      "Teslim Alacak Kişinin Adı, Soyadı",
      "Adı, Soyadı"
    ],
    "en":[
      "name",
      "name \/ company name",
      "name soyadıadres",
      "name surname",
      "name to be written to card",
      "name, last name email",
      "please write name",
      "profile name"
    ]
  },
  {
    "mapping": "phoneNumber",
    "labels":[
      "Kart Sahibi Tel No",
      "İrtibat Telefonu *",
      "Telefon (Sabit)",
      "* Sabit TelefonÖrnek2125198720 (10 karakter)",
      "Sabit Telefon",
      "Ev Telefon",
      "Ev Telefonunuz",
      "Ev Telefonu",
      "Ev Telefon No",
      "Telefon",
      "Telefon*",
      "Telefon *",
      "telefon",
      "Telefon (0)",
      "Telefon No",
      "Telefon0",
      "Telephone",
      "Telefon Numarası",
      "Telefon Numarası*",
      "Telefon Numaranız",
      "Telefon Numaranız (0532-111-11-11)",
      "Tel",
      "Tel 1",
      "Tel 2",
      "İrtibat Tel *",
      "Sabit Telefon Numaranız",
      "+90",
      "0(5**)*******"
    ],
    "en":[
      "cardholder telephone number",
      "contact phone",
      "fixed phone",
      "fixed telefonörnek2125198720 10 characters",
      "fixed telephony",
      "home phone",
      "home phone number",
      "phone",
      "phone 0",
      "phone number",
      "telefon0",
      "telephone",
      "telephone number",
      "telephone number 0532-111-11-11",
      "wire",
      "wire 1",
      "wire 2",
      "contact wire",
      "landline number"
    ]
  },
  {
    "mapping": "month",
    "labels":[
      "Ay seçiniz",
      "Ay",
      "[Ay]"
    ],
    "en":[
      "choose month",
      "month"
    ]
  },
  {
    "mapping": "password",
    "labels":[
      "* Password",
      "*Confirm New Password",
      "Şifrenizi giriniz",
      "Parola",
      "Şifrenizi girin",
      "Şifre",
      "Şifreniz",
      "* ŞİFRE",
      "Şifre*",
      "Parola *",
      "Parolanız",
      "Şifre *",
      "ŞİFRE",
      "Şifreniz*",
      "Password",
      "Seçtiğiniz şifreyi tekrar girin",
      "Şifrenizi Giriniz",
      "Sifre",
      "sifre",
      "Şifre:",
      "Şifre - Tekrar *",
      "Şifre (6 Karakter)",
      "Şifre Tekrar",
      "Şifre (Tekrar)",
      "Şifre (Tekrar) *",
      "Şifreniz(Tekrar)",
      "Şifreniz (Tekrar)",
      "Parola(Tekrar)",
      "Şifre Tekrarı",
      "Şifre Tekrarı *",
      "* ŞİFRE TEKRAR",
      "Şifre Tekrar*",
      "Parola (Tekrar) *",
      "Şifre(Tekrar)",
      "Şifreniz (tekrar)",
      "ŞİFRE TEKRAR",
      "Şifreyi tekrar giriniz*",
      "Şifrenizi Yeniden Giriniz",
      "Şifreyi tekrar girin",
      "Şifreyi Tekrar Girin",
      "Şifre (tekrar)",
      "Şifre tekrar",
      "Parolanız Tekrar",
      "Sifre Tekrar",
      "Şifre Onayı",
      "Şifre Onay",
      "Şifre (en az 6 en fazla 10 karakterden oluşmalıdır)*",
      "Seçtiğiniz şifreyi tekrar girinŞifreniz en az 6 en çok 12 karakter olmalıdır.",
      "Bir şifre seçin",
      "Şifrenizi yazınız.",
      "Şifrenizi yazınız",
      "Şifre Belirleyin",
      "Confirm password",
      "Şifre Doğrula *",
      "Şifre Doğrula",
      "Şifrenizi Doğrulayın",
      "Şifrenizi tekrarlayın *",
      "Şifrenizi tekrar yazın",
      "Şifre Onayı *",
      "Şifre (en az 6, en fazla 10 karakter):*",
      "Şifreyi tekrar giriniz:*"
    ],
    "en":[
      "password",
      "password - again",
      "password 6 characters",
      "password again",
      "password confirmation",
      "password must be at least 6 to 10 characters",
      "password you selected again girinşifre must be at least 6 up to 12 characters",
      "choose a password",
      "create password",
      "set password",
      "confirm password",
      "repeat password"
    ]
  },
  {
    "mapping": "dateOfBirth",
    "labels":[
      "*What is your Birthdate?",
      "Bebeğinizin doğum tarihi?",
      "Doğum Tarihi",
      "Doğum tarihi",
      "Doğum Tarihiniz",
      "Doğum tarihi*",
      "Date of birth",
      "* Doğum Tarihi",
      "Doğum Tarihi *",
      "Kullanım Süresi Ay\/Yıl",
      "Doğum Günü"
    ],
    "en":[
      "baby's birth date",
      "date of birth",
      "lifetime month \/ year"
    ]
  },
  {
    "mapping": "cardExpiry",
    "labels":[
      "Kredi Kart Son Kullanma Tarihi",
      "Kart Üzerindeki Son Kullanma Tarihi",
      "Son Kullanma",
      "Son Kullanma Tarihi",
      "Son kullanma tarihi",
      "Son Kullanım Tarihi",
      "SON KULLANMA TARİHİ",
      "Son Kullanma Tarihi*",
      "Son Kullanma Tarihi ve Güvenlik Kodu",
      "Son kullanma tarihi (Ay\/Yıl) *",
      "Son Kullanma Tarihi (Ay\/Yıl)",
      "Kartınızın Son Kullanma Tarihi",
      "Son Kullanma Tarihi (Expire Date)",
      "Geçerlilik Tarihi - Kart Tipi",
      "Geçerlilik Tarihi",
      "Son Kullanma Tarihi "
    ],
    "en":[
      "credit card expiration date",
      "card expiration date on",
      "expiration",
      "expiration date",
      "expiration date and security code",
      "expiration date month \/ year",
      "expiration date of card",
      "expiration date, expire date",
      "expiry date - card type"
    ]
  }
];
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.DefaultRemapper = {
  id: 'DefaultRemapper',

  canHandle: function(classification) {
    return true;
  },

  doRemap: function(classification) {
  }
};

MaxwellForest.FirstNameRemapper = {
  id: 'FirstNameRemapper',

  canHandle: function(classification) {
    var surnameFields = classification.fields.filter(function(f) {
      return f.mapping === 'surname' && f.inputs.length === 1;
    });

    return surnameFields.length > 0;
  },

  doRemap: function(classification) {
    classification.fields.forEach(function(field) {
      if (field.mapping === 'fullName') {
        field.mapping = 'firstName';
      }
    });
  }
};

MaxwellForest.CreditCardRemapper = {
  id: 'CreditCardRemapper',

  canHandle: function(classification) {
    return classification.identifier === 'creditcard';
  },

  doRemap: function(classification) {
    var cvvField = null;

    classification.fields.forEach(function(field) {
      if (field.mapping === 'month') {
        field.mapping = 'cardExpiryMonth';
      }
      if (field.mapping === 'year') {
        field.mapping = 'cardExpiryYear';
      }

      if (field.inputs.length >= 2 &&
          (field.mapping === 'dateOfBirth' ||
          field.mapping === 'cardExpiryMonth' ||
          field.mapping === 'cardExpiry')) {

        field.mapping = 'cardExpiry';
        if (field.inputs.length === 3) {
          cvvField = new MaxwellForest.Field([field.inputs[2]], [], null, 0);
          cvvField.mapping = "cvv";
          field.inputs = [field.inputs[0], field.inputs[1]];
        }
      }
    });

    if (cvvField) {
      classification.fields.push(cvvField);
    }

    var creditCardFields = classification.fields.filter(function(field) {
      return field.mapping === 'cardNumber';
    });
    if (creditCardFields.length === 4) {
      creditCardFields.forEach(function(field, index) {
        field.mapping = 'cardNumberPart' + (index + 1);
      });
    }
  }
};

MaxwellForest.MobilePhoneRemapper = {
  id: 'MobilePhoneRemapper',

  canHandle: function(classification) {
    var mobileNumberFields = classification.fields.filter(function(f) {
      return f.mapping === 'mobileNumber' && f.inputs.length === 1;
    });

    if(mobileNumberFields && mobileNumberFields.length > 1) {
      return true;
    }
    return false;
  },

  doRemap: function(classification) {
    var mobileNumberFields = classification.fields.filter(function(f) {
      return f.mapping === 'mobileNumber' && f.inputs.length === 1;
    });

    if(mobileNumberFields.length > 1) {
      var firstField = null;
      mobileNumberFields.forEach(function(field) {
        if(firstField === null) {
          firstField = field;
        } else {
          firstField.inputs = firstField.inputs.concat(field.inputs);
          var fieldIndex = classification.fields.indexOf(field);
          if(fieldIndex != -1) {
            classification.fields.splice(fieldIndex, 1);
          }
        }
      });
    }

  }
};


MaxwellForest.RegisterRemapper = {
  id: 'RegisterRemapper',

  canHandle: function(classification) {
    return classification.identifier === 'register';
  },

  doRemap: function(classification) {
    var dateFields = classification.fields.filter(function(f) {
      return ['day', 'month', 'year', 'dateOfBirth'].indexOf(f.mapping) !== -1;
    });
    if (dateFields.length > 0) {
      var leaderField = dateFields[0];
      leaderField.mapping = 'dateOfBirth';
      var otherDateFields = dateFields.filter(function(f) { return f !== leaderField; });
      otherDateFields.forEach(function(f) { leaderField.inputs = leaderField.inputs.concat(f.inputs); });
      classification.fields = classification.fields.filter(function(field) {
        return otherDateFields.indexOf(field) === -1;
      });
    }

    var genderFields = classification.fields.filter(function(f) {
      return f.mapping === 'gender';
    });
    if (genderFields.length === 2) {
      var firstGender = genderFields[0];
      var secondGender = genderFields[1];
      firstGender.inputs = firstGender.inputs.concat(secondGender.inputs);
      classification.fields = classification.fields.filter(function(field) {
        return field !== secondGender;
      });
    }

    classification.fields = classification.fields.filter(function(f) {
      return f.mapping !== 'cvv';
    });
  }
};

MaxwellForest.Remappers = [
  MaxwellForest.RegisterRemapper,
  MaxwellForest.CreditCardRemapper,
  MaxwellForest.MobilePhoneRemapper,
  MaxwellForest.FirstNameRemapper,
  MaxwellForest.DefaultRemapper
];

MaxwellForest.PerformRemap = {
  run: function(classification) {
    return MaxwellForest.Remappers.filter(function(remapper) {
      return remapper.canHandle(classification);
    }).forEach(function(remapper) {
      remapper.doRemap(classification);
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.MapInputs = {
  setCorrectLabelAndMapping: function(form) {
    form.classifications.forEach(function(classification) {
      var mappings = [];
      classification.fields.forEach(function(field) {
        if (!field.correctLabel) {
          var sortedLabels = field.labels.sort(function(a, b) {
            if (a.correctProbability === b.correctProbability) {
              return a.distance < b.distance ? -1 : 1;
            } else {
              return a.correctProbability > b.correctProbability ? -1 : 1;
            }
          });
          sortedLabels.forEach(function(label) {
            var text = label.text.replace( /[\s\n\r]+/g, ' ' );
            if (!field.correctLabel && text !== "") {
              var mapping = MaxwellForest.MapInputs.getMappingForLabel(text);
              if (mapping && mapping !== 'unknown') {
                mappings.push(mapping);
                field.correctLabel = label;
                field.mapping = mapping;
              }
            }
          });
        }
      });
      classification.identifier = MaxwellForest.MapInputs.identifierForMappings(mappings);

      MaxwellForest.MapInputs.remapFromIdentifier(classification);
    });
  },

  getMappingForLabel: function(originalTrString) {
    var mapping;
    var trString = MaxwellForest.MapInputs.normaliseString(originalTrString);
    MaxwellForest.json
      .map(function(mappingGroup) {
        mappingGroup.labels = mappingGroup.labels.map(MaxwellForest.MapInputs.normaliseString);
        return mappingGroup;
      })
      .filter(function(mappingGroup) {
        if(mappingGroup.labels.indexOf(trString) != -1) {
          mapping = mappingGroup.mapping;
          return true;
        }
      });
    return mapping;
  },

  normaliseString: function(trString) {
    var regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    return trString
      .toLowerCase()
      .replace(regex, '')
      .replace(/\s\s+/g, ' ')
      .trim();
  },

  hasMappingForLabel: function(trString) {
    var mapping = MaxwellForest.MapInputs.getMappingForLabel(trString);
    return (mapping && mapping !== 'unknown');
  },

  remapFromIdentifier: function(classification) {
    MaxwellForest.PerformRemap.run(classification);
  },

  identifierForMappings: function(mappings) {
    if(MaxwellForest.MapInputs.checkForCreditCard(mappings)) {
      return 'creditcard';
    } else if(MaxwellForest.MapInputs.checkForRegister(mappings)) {
      return 'register';
    } else if(MaxwellForest.MapInputs.checkForLogin(mappings)) {
      return 'login';
    } else if(MaxwellForest.MapInputs.checkForAddress(mappings)) {
      return 'address';
    }
    //Low priority matches
    if(MaxwellForest.MapInputs.checkForLowPriorityCreditCard(mappings)) {
      return 'creditcard';
    } else if(MaxwellForest.MapInputs.checkForLowPriorityAddress(mappings)){
      return 'address';
    } else if(MaxwellForest.MapInputs.checkForLowPriorityRegister(mappings)) {
      return 'register';
    } else if (MaxwellForest.MapInputs.checkForLowPriorityLogin(mappings)){
      return 'login';
    }
    return 'unknown';
  },

  checkForCreditCard: function(mappings) {
    return mappings.indexOf('cardNumber') != -1;
  },

  checkForAddress: function(mappings) {
    return mappings.indexOf('address') != -1 || mappings.indexOf('addressTitle') != -1;
  },

  checkForLogin: function(mappings) {
    return mappings.indexOf('email') != -1 && mappings.indexOf('password') != -1;
  },

  checkForRegister: function (mappings) {
    var passwordsCount = MaxwellForest.Helpers.count(mappings, 'password');
    var hasEmail = mappings.indexOf('email') != -1;
    var hasConfirmPassword = mappings.indexOf('confirmPassword') != -1;
    if((passwordsCount === 0 && hasEmail) ||
      passwordsCount >= 2 ||
      hasConfirmPassword ||
      (passwordsCount == 1 && mappings.length > 2)) {
      return true;
    }
    return false;
  },

  checkForLowPriorityRegister: function (mappings) {
    var hasFirstName = mappings.indexOf('firstName') != -1 || mappings.indexOf('fullName') != -1;
    var hasLastName = mappings.indexOf('surname') != -1;
    var hasTurkishId = mappings.indexOf('turkishIdNumber') !== -1;
    if(hasFirstName && hasLastName) {
      return true;
    }
    if (mappings.indexOf('year') != -1) {
      return true;
    }
    if (mappings.indexOf('dateOfBirth') != -1) {
      return true;
    }
    if (hasTurkishId) {
      return true;
    }

    return false;
  },

  checkForLowPriorityAddress: function (mappings) {
    return mappings.indexOf('town') != -1 || mappings.indexOf('turkishIdNumber') != -1 ||
      mappings.indexOf('country') !== -1 || mappings.indexOf('province') !== -1 ||
      mappings.indexOf('orderInstructions') != -1 || mappings.indexOf('phoneNumber') !== -1;
  },

  checkForLowPriorityCreditCard: function (mappings) {
    return mappings.indexOf('cvv') != -1 || mappings.indexOf('cardholderName') !== -1;
  },

  checkForLowPriorityLogin: function (mappings) {
    return mappings.indexOf('password') != -1;
  },

  debugFillFormWithMapping: function(form) {
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        field.inputs.forEach(function(input) {
          input.element.value = field.mapping;
        });
      });
    });
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.SerializeForm = {
  snapshot: function(obj) {
    if(obj === null || typeof(obj) !== 'object') {
      return obj;
    }

    var temp;
    try {
      temp = new obj.constructor();
    } catch (e) {
      // Return object for html elements (which cause this error).
      if (e instanceof TypeError) {
        return obj;
      } else {
        throw e;
      }
    }

    for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = MaxwellForest.SerializeForm.snapshot(obj[key]);
      }
    }

    return temp;
  },

  run: function(form) {
    form = MaxwellForest.SerializeForm.snapshot(form);
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        field.inputs.forEach(function(input) {
          var element = input.element;
          input.element = {
            tagName: element.tagName,
            name: element.name,
          };
          if (element.tagName === 'SELECT') {
            var options = MaxwellForest.Helpers.toArray(element.options);
            input.element.options = options.map(function(option) {
              return option.innerText;
            });
          }
        });
      });
    });
    return form;
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.Runner = {
  run: function() {
    var rawOutput = MaxwellForest.FetchForms.run();
    var form = MaxwellForest.MarshalForms.run(rawOutput);
    MaxwellForest.StripNonWordLabels.run(form);
    MaxwellForest.GroupInlineInputs.run(form);
    MaxwellForest.RemoveDoubledUpLabels.run(form);
    MaxwellForest.AddExtraLabels.run(form);
    MaxwellForest.CombineLabels.run(form);
    MaxwellForest.AssignLabelsFromProbability.run(form);
    MaxwellForest.MapInputs.setCorrectLabelAndMapping(form);
    return form;
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.NoopValueTransformer = {
  id: 'NoopValueTransformer',

  canHandle: function(field) {
    return true;
  },

  value: function(field) {
    return [field.value];
  },

  reverse: function(field) {
    return field.inputs.map(function(i) { return i.element.value; }).join('');
  }
};

MaxwellForest.ExpiryValueTranformer = {
  id: 'ExpiryValueTranformer',

  canHandle: function(field) {
    return field.inputs.length === 2 &&
      field.mapping === 'cardExpiry' &&
      field.value.indexOf('/') !== -1;
  },

  value: function(field) {
    return field.value.split('/');
  },

  reverse: function(field) {
    var values = field.inputs.map(function(i) { return i.element.value });
    return [values[0], values[1].substring(2, 4)].join('/');
  }
};

MaxwellForest.CreditCardValueTranformer = {
  id: 'CreditCardValueTranformer',

  canHandle: function(field) {
    return field.inputs.length === 4 &&
      field.mapping === 'cardNumber';
  },

  value: function(field) {
    return field.value.split(/(\d\d\d\d)/).filter(function(n) {
      return n !== ''
    });
  },

  reverse: function(field) {
    return field.inputs.map(function(i) { return i.element.value }).join('');
  }
};

MaxwellForest.ValueTransformers = [
  MaxwellForest.ExpiryValueTranformer,
  MaxwellForest.CreditCardValueTranformer,
  MaxwellForest.NoopValueTransformer,
];

MaxwellForest.PerformTransform = {
  run: function(field) {
    return MaxwellForest.ValueTransformers.filter(function(transformer) {
      return transformer.canHandle(field);
    })[0].value(field);
  }
}
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.DefaultFiller = {
  id: 'DefaultFiller',

  canHandle: function(field, inputs) {
    return true;
  },

  doFill: function(field, inputs, values) {
    inputs.forEach(function(input, index) {
      var value = values[index];
      MaxwellForest.Helpers.fillInput(input, value);
    });
    return;
  },
};

MaxwellForest.ZizigoPhoneFiller = {
  id: 'ZizigoPhoneFiller',

  canHandle: function(field, inputs) {
      return field.mapping === 'mobileNumber' && inputs.length === 1 &&
        location.host === 'm.zizigo.com';
    },


  doFill: function(field, inputs, values) {
    var formattedNumber = "0 (" + values[0].substring(0, 3) +") " + values[0].substring(3, 6) + " " + values[0].substring(6, 8) + " " + values[0].substring(8, 10);
    inputs[0].value = formattedNumber;
    return;
  },
};

MaxwellForest.LidyanaPhoneFiller = {
  id: 'LidyanaPhoneFiller',

  canHandle: function(field, inputs) {
      return field.mapping === 'phoneNumber' && inputs.length === 1 &&
        location.host === 'm.lidyana.com';
  },

  doFill: function(field, inputs, values) {
    var formattedNumber = "0"+values[0];
    inputs[0].value = formattedNumber;
    return;
  },
};

MaxwellForest.TolgacicekPhoneFiller = {
  id: 'TolgacicekPhoneFiller',

  canHandle: function(field, inputs) {
      return inputs.length === 1 &&
        (field.mapping === 'phoneNumber' || field.mapping === 'mobileNumber' ) &&
        (location.host === 'tolgacicek.com' || location.host === 'www.enhesapliyiz.com');
  },

  doFill: function(field, inputs, values) {
    var formattedNumber = "0"+values[0];
    MaxwellForest.Helpers.fillTextInput(inputs[0], formattedNumber);
    return;
  },
};

MaxwellForest.CardExpiryFiller = {
  id: 'CardExpiryFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'cardExpiry' && inputs.length === 2;
  },

  doFill: function(field, inputs, values) {
    if (values.length == 1) {
      values = values[0].split('/');
    }

    inputs.forEach(function(input, index) {
      var value = values[index];
      if (value.length === 2) {
        MaxwellForest.Helpers.fillMonth(input, value);
      } else if (value.length === 4) {
        MaxwellForest.Helpers.fillYear(input, value);
      }
    });
  }
};

MaxwellForest.GoldCardExpiryFiller = {
  id: 'CardExpiryFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'cardExpiry' && inputs.length === 1 &&
      location.host === 'www.gold.com.tr';
  },

  doFill: function(field, inputs, values) {
    if (values.length == 2) {
      values = [values.join('/')];
    }

    var rawValues = values[0].split('/');
    var month = rawValues[0];
    var year = rawValues[1].substring(2, 4);
    var value = month + '/' + year;
    MaxwellForest.Helpers.fillInput(inputs[0], value);
  }
};

MaxwellForest.CardExpiryMonthFiller = {
  id: 'CardExpiryMonthFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'cardExpiry' && inputs.length === 1;
  },

  doFill: function(field, inputs, values) {
    var valuesArray = values[0].split('/');
    MaxwellForest.Helpers.fillMonth(inputs[0], valuesArray[0]);
  }
};

MaxwellForest.CardExpiryInputMonthFiller = {
  id: 'CardExpiryFillerInputMonthFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'cardExpiry' &&
      inputs[0].type.toLowerCase() === 'month';
  },

  doFill: function(field, inputs, values) {
    var monthInput = inputs[0];
    var valuesArray = values[0].split('/');
    var month = valuesArray[0];
    var year = valuesArray[1];
    monthInput.value = year + '-' + month;
  }
};


MaxwellForest.YearFiller = {
  id: 'YearFiller',

  canHandle: function(field, inputs) {
    return (field.mapping === 'cardExpiryYear' || field.mapping === 'year') &&
    (inputs.length === 1);
  },

  doFill: function(field, inputs, values) {
    MaxwellForest.Helpers.fillYear(inputs[0], values[0]);
  }
};

MaxwellForest.GenderSelectFiller = {
  id: 'GenderSelectFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'gender' && inputs.length == 1 && inputs[0].tagName === 'SELECT';
  },

  doFill: function(field, inputs, values) {
    MaxwellForest.Helpers.fillGender(inputs[0], values[0]);
  }
};

MaxwellForest.GenderRadioFiller = {
  id: 'GenderRadioFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'gender' && inputs.length === 2 && inputs[0].type.toLowerCase() === 'radio';
  },

  doFill: function(field, inputs, values) {
    var maleNames = ['bay', 'erkek', 'male'];
    var femaleNames = ['bayan', 'kadın', 'kadin', 'female'];
    var useNames = values[0] === 'bay' ? maleNames : femaleNames;
    var hasCheckedInput = false;
    inputs.forEach(function(input) {
      input.checked = false;
      if (MaxwellForest.Helpers.hasJQuery() && $.prop) { // if jquery is being used
        $(input).prop('checked', false);
        $(input.parentNode).removeClass(['checked', 'ez-selected']);
      }
    });
    inputs.forEach(function(input) {
      if (useNames.indexOf(input.parentNode.innerText.toLowerCase().trim()) !== -1) {
        input.checked = true;
        hasCheckedInput = true;
      }

      if (!hasCheckedInput) {
        var femaleInput = inputs.filter(function(input) {
          return input.outerHTML.toLowerCase().indexOf('female') !== -1;
        })[0];
        if (femaleInput) {
          var maleInput = inputs.filter(function(input) { return input !== femaleInput; })[0];
        }
        if (maleInput) {
          if (values[0] === 'bay') {
            maleInput.checked = true;
            if (MaxwellForest.Helpers.hasJQuery() && $.prop) { // if jquery is being used
              $(maleInput).prop('checked', true);
              $(maleInput.parentNode).addClass('checked ez-selected');
            }
          } else {
            femaleInput.checked = true;
            if (MaxwellForest.Helpers.hasJQuery() && $.prop) { // if jquery is being used
              $(femaleInput).prop('checked', true);
              $(femaleInput.parentNode).addClass('checked ez-selected');
            }
          }
          hasCheckedInput = true;
        }
      }
    });

    var findInclusiveParentNode = function(startingElement, includeElements) {
      if (includeElements.every(function(element) { return startingElement.innerHTML.indexOf(element.outerHTML); })) {
        return startingElement;
      } else if (startingElement === document.body) {
        return startingElement;
      } else {
        return findInclusiveParentNode(startingElement.parentNode, includeElements);
      }
    };
    var parentOfInputs = findInclusiveParentNode(inputs[0].parentNode, inputs);
    if (!hasCheckedInput) {
      inputs.forEach(function(input) {
        var rect = input.getBoundingClientRect();
        var rightRect = MaxwellForest.Helpers.fetchFixedRightRect(rect, 20);
        MaxwellForest.Helpers.extractTextNodes(parentOfInputs).forEach(function(textElement) {
          MaxwellForest.FetchForms.appendGetBoundingClientRect(textElement);
          var isIntersecting = MaxwellForest.Helpers.isIntersecting(rightRect, textElement.getBoundingClientRect());
          var hasGenderText = useNames.indexOf(textElement.data.toLowerCase().trim()) !== -1;
          if (isIntersecting && hasGenderText) {
            input.checked = true;
            if (MaxwellForest.Helpers.hasJQuery() && $.prop) { // if jquery is being used
              $(input).prop('checked', true);
              $(input.parentNode).addClass('checked ez-selected');
            }
            hasCheckedInput = true;
          }
        });
      });
    }
  }
};

MaxwellForest.DateOfBirthFiller = {
  id: 'DateOfBirthFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'dateOfBirth' && inputs.length === 3;
  },

  doFill: function(field, inputs, values) {
    var valuesArray = values[0].split('/');
    inputs.forEach(function(input, index) {
      var value = valuesArray[index];
      // Append century to year for select fill.
      if (index === 0) {
        MaxwellForest.Helpers.fillInput(input, value);
      } else if (index === 1) {
        MaxwellForest.Helpers.fillMonth(input, value);
      } else if (index === 2) {
        MaxwellForest.Helpers.fillYear(input, value);
      }
    });
  }
};

MaxwellForest.VatanBirthDateFiller = {
  id: 'VatanDateOfBirthFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'dateOfBirth' && inputs.length === 1 && location.host === 'www.vatanbilgisayar.com';
  },

  doFill: function(field, inputs, values) {
    var convertedValues = values[0].split('/').join('.');
    MaxwellForest.Helpers.fillInput(inputs[0], convertedValues);
  }
};

MaxwellForest.OneInputDateOfBirthFiller = {
  id: 'OneInputDateOfBirthFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'dateOfBirth' && inputs.length === 1;
  },

  doFill: function(field, inputs, values) {
    var valuesArray = values[0].split('/');
    valuesArray.forEach(function(value, index) {
      if (index === 0) {
        MaxwellForest.Helpers.fillInput(inputs[0], value);
      } else if (index === 1) {
        MaxwellForest.Helpers.fillMonth(inputs[0], value);
      } else if (index === 2) {
        MaxwellForest.Helpers.fillYear(inputs[0], value);
      }
    });
  }
};

MaxwellForest.TwoInputPhoneNumberFiller = {
  id: 'TwoInputPhoneNumberFiller',

  canHandle: function(field, inputs) {
    if (inputs.length != 2) {
      return false;
    }
    if (field.mapping !== "phoneNumber" && field.mapping !== "mobileNumber" && field.mapping !== "businessPhoneNumber") {
      return false;
    }
    var isAllInputs = true;
    var hasInput = inputs.some(function(input) {
      if (input.tagName !== 'INPUT') {
        isAllInputs = false;
      }
    });

    return isAllInputs;
  },

  doFill: function(field, inputs, values) {
    if (location.host === 'www.divaspirlanta.com') {
      MaxwellForest.Helpers.fillInput(inputs[0], '+90');
      values = [values[0].substring(0,3), values[0].substring(3, 6), values[0].substring(6, 8), values[0].substring(8, 10)];
      MaxwellForest.Helpers.fillInput(inputs[1], '(' + values[0] + ') ' + values[1] + '-' + values[2] + '-' + values[3]);
    } else {
      values = [values[0].substring(0,3), values[0].substring(3, values[0].length)];
      inputs.forEach(function(input, index) {
        var value = values[index];
        MaxwellForest.Helpers.fillInput(input, value);
      });
    }
  }
};

MaxwellForest.PhoneNumberWithSelectFiller = {
  id: 'PhoneNumberWithSelectFiller',

  canHandle: function(field, inputs) {
    if (inputs.length != 2) {
      return false;
    }
    if (field.mapping !== "phoneNumber" && field.mapping !== "mobileNumber") {
      return false;
    }


    var hasInput = inputs.some(function(input) {
      if (input.tagName === 'INPUT') {
        return true;
      }
    });

    var hasSelect = inputs.some(function(input) {
      if (input.tagName === 'SELECT') {
        return true;
      }
    });

    return (hasInput && hasSelect);
  },

  doFill: function(field, inputs, values) {
    var selectElement;
    var inputElement;
    inputs.forEach(function(input) {
      var element = input;
      if (element.tagName === 'INPUT') {
        inputElement = element;
      } else if (element.tagName === 'SELECT') {
        selectElement = element;
      }
    });
    MaxwellForest.Helpers.fillPhoneNumberWithSelect(selectElement, inputElement, values[0]);
  },

};

MaxwellForest.SplitNameFiller = {
  id: 'SplitNameFiller',

  canHandle: function(field, inputs) {
    return field.mapping === 'fullName' && inputs.length === 2;
  },

  doFill: function(field, inputs, values) {
    var fullName = values[0];
    var names = fullName.split(/\s+/);
    var values = [names[0], names[names.length - 1]];
    inputs.forEach(function(input, index) {
      var value = values[index];
      MaxwellForest.Helpers.fillInput(input, value);
    });
  },
};

MaxwellForest.Fillers = [
  MaxwellForest.ZizigoPhoneFiller,
  MaxwellForest.LidyanaPhoneFiller,
  MaxwellForest.TolgacicekPhoneFiller,

  MaxwellForest.PhoneNumberWithSelectFiller,
  MaxwellForest.TwoInputPhoneNumberFiller,
  MaxwellForest.GenderSelectFiller,
  MaxwellForest.GenderRadioFiller,
  MaxwellForest.GoldCardExpiryFiller,
  MaxwellForest.CardExpiryInputMonthFiller,
  MaxwellForest.CardExpiryFiller,
  MaxwellForest.CardExpiryMonthFiller,
  MaxwellForest.YearFiller,
  MaxwellForest.VatanBirthDateFiller,
  MaxwellForest.DateOfBirthFiller,
  MaxwellForest.OneInputDateOfBirthFiller,
  MaxwellForest.SplitNameFiller,
  MaxwellForest.DefaultFiller
];

MaxwellForest.PerformFill = {
  run: function(field, inputs, values) {
    return MaxwellForest.Fillers.filter(function(transformer) {
      return transformer.canHandle(field, inputs);
    })[0].doFill(field, inputs, values);
  }
};
'use strict';

var MaxwellForest = MaxwellForest || {};

MaxwellForest.Exceptions = [
  {
    host: 'www.seslial.com',
    classification: 'register',
    perform: function(classification) {
      var mobileField = classification.fields.filter(function(field) {
        return field.mapping === 'mobileNumber';
      })[0];
      if (mobileField) {
        var input = MaxwellForest.Input.generate('#siparis_cep_tel_no');
        mobileField.inputs = mobileField.inputs.concat(input);
      }
    }
  },

  {
    host: 'www.1marka.com',
    classification: 'register',
    perform: function(classification) {
      if (classification.fields.length === 4 || classification.fields.length === 3) {
        classification.identifier = 'login';
      }
    }
  },

  {
    host: 'www.sanalpazar.com',
    classification: 'address',
    perform: function(classification) {
      var inputs = [
        MaxwellForest.Input.generate('#gsmphone_a'),
        MaxwellForest.Input.generate('#gsmphone_b')
      ];
      classification.fields.push(new MaxwellForest.Field.punch(inputs, 'mobileNumber'));
    }
  },

  {
    host: 'cardium.com.tr',
    classification: 'creditcard',
    perform: function(classification) {
      if (classification.fields.length == 1 &&
        classification.fields[0].mapping === 'cvv') {

        classification.fields[0].mapping = "";
        classification.identifier = "";
      }
    }
  },

  {
    host: 'cardium.com.tr',
    classification: 'register',
    perform: function(classification) {
      if (classification.fields.filter(function(field) {
        return field.mapping === 'address';
      }).length > 0) {
        classification.identifier = 'address';
      }
    }
  },

  {
    host: 'm.lidyana.com',
    classification: 'creditcard',
    perform: function(classification) {
      // cardExpiry & cardExpiryMonth
      var cardExpiry = classification.fields.filter(function(field) {
        return field.mapping === 'cardExpiry';
      })[0];
      var cardExpiryMonth = classification.fields.filter(function(field) {
        return field.mapping === 'cardExpiryMonth';
      })[0];

      cardExpiry.inputs = cardExpiry.inputs.concat(cardExpiryMonth.inputs);

      cardExpiryMonth.mapping = "";
    }
  },

  {
    host: 'www.cicekmarket.com',
    classification: 'register',
    perform: function(classification) {
      if(classification.fields.length === 1) {
        if(document.getElementsByName("password").length > 0) {
          var inputs = [
             new MaxwellForest.Input.generateFromName('password'),
          ];
          classification.fields.push(new MaxwellForest.Field.punch(inputs, 'password'));
          classification.identifier = 'login';
        }
      } else {
        classification.fields.forEach(function(field) {
          if(field.mapping === 'mobileNumber' || field.mapping === 'phoneNumber') {
            field.mapping = '';
          }
        });

        var inputs = [
           new MaxwellForest.Input.generate('#uye_operator'),
           new MaxwellForest.Input.generateFromName('uye_telefon')
        ];
        classification.fields.push(new MaxwellForest.Field.punch(inputs, 'phoneNumber'));
      }
    }
  },
  {
    host: 'www.cicekmarket.com',
    classification: 'address',
    perform: function(classification) {
      var phoneNumbers = classification.fields.filter(function(field) {
        return field.mapping === 'phoneNumber';
      });
      if (phoneNumbers && phoneNumbers.length > 0 && phoneNumbers[0].inputs.length === 3) {
         phoneNumbers[0].inputs.splice(0, 1);
      }
    }
  },

  {
    host: 'www.enhesapliyiz.com',
    classification: 'creditcard',
    perform: function(classification) {
      if(classification.fields.length === 3 &&
        classification.fields.filter(function(field) { return field.mapping === 'cardNumber';}).length === 2) {
          classification.identifier = "";
      }
    }
  },

  {
    host: 'www.supermutfak.com',
    classification: 'creditcard',
    perform: function(classification) {
      var otherFields = classification.fields.filter(function(field) {
        return field.mapping && field.mapping !== '' && field.mapping !== 'cardNumber'
      });
      if(otherFields.length === 0) {
        classification.identifier = "";
      }
    }
  },

  {
    host: 'm.bimeks.com.tr',
    classification: 'creditcard',
    perform: function(classification) {
      classification.fields = [];
      //cardNumber over 4 fields
      var inputs = [
         new MaxwellForest.Input.generate('#ctl00_ph_content_txt_KartNo1'),
         new MaxwellForest.Input.generate('#ctl00_ph_content_txt_KartNo2'),
         new MaxwellForest.Input.generate('#ctl00_ph_content_txt_KartNo3'),
         new MaxwellForest.Input.generate('#ctl00_ph_content_txt_KartNo4'),
      ];
      classification.fields.push(new MaxwellForest.Field.punch(inputs, 'cardNumber'));

      //Cvv not mapping
      var inputs = [
         new MaxwellForest.Input.generate('#ctl00_ph_content_txt_cvv'),
      ];
      classification.fields.push(new MaxwellForest.Field.punch(inputs, 'cvv'));

      //Expiry also not mapping
      var inputs = [
         new MaxwellForest.Input.generate('#ctl00_ph_content_ddl_ay'),
         new MaxwellForest.Input.generate('#ctl00_ph_content_ddl_yil'),
      ];
      classification.fields.push(new MaxwellForest.Field.punch(inputs, 'cardExpiry'));
    }
  },

  {
    host: 'www.epttavm.com',
    classification: 'register',
    perform: function(classification) {
      if(classification.fields.length === 3) {
          classification.identifier = "login";
      }
    }
  },

  {
    host: 'www.alexoyuncak.com',
    classification: 'register',
    perform: function(classification) {
      if(classification.fields.length === 7) {
        var townField;
        classification.fields.forEach(function(field) {
          if(field.mapping === 'cardholderName') {
            field.mapping = "fullName";
           } else if (field.mapping === 'province' && field.inputs.length == 2) {
             var townInput = field.inputs[1];
             field.inputs.splice(1,1);
             if(townInput) {
               console.log(townInput);
               townField = new MaxwellForest.Field.punch([townInput], 'town');
             }
          }
        });
        if(townField) {
          console.log(townField);
           classification.fields.push(townField);
        }
        classification.identifier = "address";
      }
    }
  },

  {
    host: 'www.sporburada.com',
    classification: 'register',
    perform: function(classification) {
      if(classification.fields.length === 1) {
        var element = MaxwellForest.Input.generate('#password');
        if(element) {
          classification.fields.push(new MaxwellForest.Field.punch([element], 'password'));
          classification.identifier = "login";
        }
      }
    }
  },

  {
    host: 'm.n11.com',
    classification: 'login',
    perform: function(classification) {
      if (document.title.indexOf('Üye Ol') > -1) {
        classification.identifier = 'register';
      }
    }
  },
  {
    host: 'm.babil.com',
    classification: 'register',
    perform: function(classification) {
      classification.fields.forEach(function(field) {
        if(field.mapping === 'mobileNumber' && field.inputs.length === 3) {
          field.mapping = "dateOfBirth";
        }
      });
    }
  },

  {
    host: 'www.gipastekstil.com',
    classification: 'register',
    perform: function(classification) {
      classification.fields.forEach(function(field) {
        if(field.mapping === 'cvv') {
          field.mapping = "";
        }
      });
    }
  },

  {
    host: 'www.sonteklif.com',
    classification: 'creditcard',
    perform: function(classification, form) {
      var addressMappings = [
        'addressTitle', 'firstName', 'surname',
        'province', 'town', 'address', 'phoneNumber'
      ];
      var addressFields = classification.fields.filter(function(f) {
        return addressMappings.indexOf(f.mapping) !== -1;
      });
      var addressClassification = form.classifications.filter(function(c) {
        return c.identifier === 'address';
      })[0];
      if (addressFields.length > 0 && addressClassification) {
        addressClassification.fields = addressClassification.fields
          .concat(addressFields);
      }
    }
  },

  {
    host: 'www.gold.com.tr',
    classification: 'address',
    perform: function(classification) {
      var mobileField = classification.fields.filter(function(field) {
        return field.mapping === 'mobileNumber';
      })[0];
      if (mobileField) {
        var input = MaxwellForest.Input.generate('#txtCepTel');
        mobileField.inputs.push(input);
      }
    }
  },

  {
    host: 'www.gold.com.tr',
    classification: 'creditcard',
    perform: function(classification, form) {
      var fieldsWithMappings = classification.fields.filter(function(f) {
        return f.mapping !== null && f.mapping !== undefined;
      });
      if (fieldsWithMappings.length === 1 && fieldsWithMappings[0].mapping === 'cvv') {
        classification.identifier = '';
      }
    }
  },

  {
    host: 'm.tekzen.com.tr',
    classification: 'register',
    perform: function(classification, form) {
      classification.fields.forEach(function(field) {
        if (field.inputs[0].element.id === 'phone2') {
          field.mapping = 'phoneNumber';
        }
        if (field.inputs[0].element.id === 'gsmno') {
          field.mapping = 'mobileNumber';
        }
      });
    }
  },

  {
    host: 'shop.mango.com',
    classification: 'creditcard',
    perform: function(classification, form) {
      var element = document.getElementById('SVBody:SVResumenMetodosPagoMobile:FEnvioMetodosPago:SVFormularioMSUMobile:msu_year');
      var uuid = MaxwellForest.Helpers.randomUuid();
      var input = new MaxwellForest.Input(uuid, null, element,
          MaxwellForest.Rect.fromBrowserRect(element.getBoundingClientRect()));
      classification.fields.push(new MaxwellForest.Field.punch([input], 'cardExpiryYear'));
    }
  },

  {
    host: 'm.trendyol.com',
    classification: 'address',
    perform: function(classification, form) {
      var input = MaxwellForest.Input.generate('#DistrictCityModel_SelectedDistrict');
      classification.fields.push(new MaxwellForest.Field.punch([input], 'town'));
    }
  },

  {
    host: 'www.memlekettengelsin.com',
    classification: 'register',
    perform: function(classification, form) {
      if (classification.fields.length === 1) {
        classification.identifier = '';
      }
    }
  },
  
  {
    host: 'www.memlekettengelsin.com',
    classification: 'address',
    perform: function(classification, form) {
       var otherFields = classification.fields.filter(function(field) {
        return field.mapping && field.mapping !== '' && field.mapping == 'address'
      });
      if(otherFields.length==2) {
        var address2=otherFields[1].inputs[0].element;
    	address2.value='';
		otherFields[1].mapping='';
      }
    }
  },

  {
    host: 'www.derinmor.com',
    classification: 'creditcard',
    perform: function(classification, form) {
      if (classification.fields.length === 1 && classification.fields[0].mapping === 'cvv') {
        var inputs = [
          MaxwellForest.Input.generate('#kredikarti_expiration'),
          MaxwellForest.Input.generate('#kredikarti_expiration_yr')
        ];
        classification.fields.push(new MaxwellForest.Field.punch(inputs, 'cardExpiry'));
      }
    }
  },

  {
    host: 'www.devapark.com',
    classification: 'address',
    perform: function(classification, form) {
      if (classification.fields.length === 1) {
        classification.identifier = '';
      }
    }
  },

  {
    host: 'm.avansas.com',
    classification: 'register',
    perform: function(classification, form) {
      classification.fields.forEach(function(field) {
        if (field.mapping === 'phoneNumber') {
          var inputs = [
            MaxwellForest.Input.generate('#PhoneArea'),
            MaxwellForest.Input.generate('#Phone')
          ];
          field.inputs = inputs;
        }
        if (field.inputs[0].element.id === 'MobilePhone') {
          var inputs = [
            MaxwellForest.Input.generate('#MobilePhoneArea'),
            MaxwellForest.Input.generate('#MobilePhone')
          ];
          field.inputs = inputs;
          field.mapping = 'mobileNumber';
        }
      });
    }
  },

  {
    host: 'www.tchibo.com.tr',
    classification: 'register',
    perform: function(classification) {
      var mobileField = classification.fields.filter(function(field) {
        return field.mapping === 'mobileNumber';
      })[0];
      if (mobileField) {
        var input = MaxwellForest.Input.generate('.text.telnr_2.addressFieldWithValidation.splitPhoneNumber');
        mobileField.inputs.push(input);
      }
    }
  },

  {
    host: 'www.tchibo.com.tr',
    classification: 'address',
    perform: function(classification) {
      var mobileField = classification.fields.filter(function(field) {
        return field.mapping === 'mobileNumber';
      })[0];
      if (mobileField) {
        var input = MaxwellForest.Input.generate('.text.telnr_2.addressFieldWithValidation.splitPhoneNumber');
        mobileField.inputs.push(input);
      }
    }
  },

  {
    host: 'www.vatanbilgisayar.com',
    classification: 'register',
    perform: function(classification) {
      classification.fields.filter(function(field) {
        if (field.mapping === 'mobileNumber') {
          field.mapping = '';
        }
      });
    }
  },

  {
    host: 'www.vatanbilgisayar.com',
    classification: 'register',
    perform: function(classification) {
      classification.fields.filter(function(field) {
        if (field.mapping === 'mobileNumber') {
          field.mapping = '';
        }
      });
    }
  },

  {
    host: 'www.elmasepeti.com',
    classification: 'address',
    perform: function(classification) {
      classification.fields.filter(function(field) {
        if (field.mapping === 'mobileNumber' || field.mapping === 'phoneNumber' ||
            field.mapping === 'turkishIdNumber') {
          field.mapping = '';
        }
      });
    }
  },

  {
    host: 'www.ydsshop.com',
    classification: 'address',
    perform: function(classification) {
      classification.fields.filter(function(field) {
        if (field.mapping === 'dateOfBirth' || field.mapping === 'mobileNumber' || field.mapping === 'phoneNumber') {
          field.mapping = '';
        }
      });
    }
  },

  {
    host: 'www.lgsatismerkezi.com',
    classification: 'address',
    perform: function(classification, form) {
      var hasRegister = form.classifications.filter(function(f) {
        return f.identifier === 'register' && f.fields.length > 1;
      }).length > 0;
      if (classification.fields.length > 1 && hasRegister) {
        classification.identifier = 'register';
      }
    }
  },

  {
    host: 'www.dr.com.tr',
    classification: 'address',
    perform: function(classification, form) {
      classification.fields.forEach(function(field) {
        if (field.mapping === 'phoneNumber' || field.mapping === 'mobileNumber') {
          field.mapping = '';
        }
      });
    }
  },

  {
    host: 'shopigo.com',
    classification: 'register',
    perform: function(classification) {
      if (document.querySelectorAll('#loggedincustomername').length > 0) {
        classification.identifier = '';
      } else {
        var inputs = [
          MaxwellForest.Input.generate('#registertop2password')
        ];
        classification.fields.push(new MaxwellForest.Field.punch(inputs, 'password'));
      }
    }
  },

  {
    host: 'dermokozmetik.org',
    classification: 'address',
    perform: function(classification, form) {
      var hasRegister = form.classifications.filter(function(f) {
        return f.identifier === 'register' && f.fields.length > 1;
      }).length > 0;
      if (classification.fields.length > 1 && hasRegister) {
        classification.identifier = 'register';
      }
    }
  },

];


MaxwellForest.PerformExceptions = {
  run: function(form) {
    form.classifications.forEach(function(classification) {
      MaxwellForest.Exceptions.forEach(function(exception) {
        if (exception.host === location.host && exception.classification === classification.identifier) {
          exception.perform(classification, form);
        }
      });
    });
  }
};
'use strict';

(function() {
  var logForm = function(form) {
    var labels = form.classifications.map(function(classification) {
      return classification.fields.map(function(field) {
        return field.labels.map(function(label) {
          return label.text;
        });
      });
    });
    console.log(MaxwellForest.Helpers.flatten(labels));
  };

  var findInputByName = function(form, inputName) {
    var correctInput = null;
    form.classifications.forEach(function(classification) {
      classification.fields.forEach(function(field) {
        field.inputs.forEach(function(input) {
          if (input.name === inputName) {
            correctInput = input;
          }
        });
      });
    });

    return correctInput;
  };

  var findFieldsByMapping = function(form, identifier, mapping) {
    var correctFields = [];
    form.classifications.forEach(function(classification) {
      if (classification.identifier === identifier) {
        classification.fields.forEach(function(field) {
          if (field.mapping === mapping) {
            correctFields.push(field);
          }
        });
      }
    });

    return correctFields;
  };

  var completeFill = function(form) {
    var data = { form: MaxwellForest.SerializeForm.run(form) };
    var requestAttrs = { action: 'updateStatus', status: 'fillAvailable', 'retailer_id': _REPLACE_siteData['retailer_id'], data: {} };
    _REPLACE_makeRequest(requestAttrs, function(response) {
      if (response.action === 'startFill') {
        _REPLACE_makeRequest({ action: 'startFill', 'retailer_id': _REPLACE_siteData['retailer_id'], data: data }, function(response) {
          response.classifications.forEach(function(classification) {
            classification.fields.forEach(function(field) {
              var values = MaxwellForest.PerformTransform.run(field);
              var formFields = findFieldsByMapping(form, classification.identifier, field.mapping);
              formFields.forEach(function(formField) {
                var inputs = [];
                formField.inputs.forEach(function(input) {
                  if (findInputByName(form, input.name)) {
                    inputs.push(findInputByName(form, input.name).element);
                  }
                });
                MaxwellForest.PerformFill.run(formField, inputs, values);
              });
            });
          });
        });
      }
    });
  };

  var run = function() {
    var rawOutput = MaxwellForest.FetchForms.run();
    var form = MaxwellForest.MarshalForms.run(rawOutput);
    MaxwellForest.StripNonWordLabels.run(form);
    MaxwellForest.GroupInlineInputs.run(form);
    MaxwellForest.AddExtraLabels.run(form);
    //MaxwellForest.CombineLabels.run(form);
    MaxwellForest.AssignLabelsFromProbability.run(form);
    MaxwellForest.MapInputs.setCorrectLabelAndMapping(form);
    MaxwellForest.PerformExceptions.run(form);
    completeFill(form);
    setTimeout(run, 3000);
  };
  run();
})();


(function() {
  _REPLACE_makeRequest({ action: 'updateStatus', status: 'ready' }, function(response) {});
})();
