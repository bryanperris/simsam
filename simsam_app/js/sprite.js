// Generated by CoffeeScript 1.6.1
(function() {
  var Action, CloneAction, DeleteAction, GenericSprite, Interaction, OverlapInteraction, Rule, SpriteFactory, TransformAction,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GenericSprite = (function(_super) {

    __extends(GenericSprite, _super);

    function GenericSprite(spriteId) {
      var sWidth, shapeParams;
      this.spriteId = spriteId;
      this.stateTranspose = false;
      this.stateRecording = false;
      this.stateRandom = false;
      this.randomRange = 15;
      this.ruleTempObject = null;
      this.tempRandom = false;
      this.tempRandomRange = 15;
      this.prepObj = null;
      sWidth = this.spriteType * 5;
      shapeParams = {
        height: this.imageObj.clientHeight,
        width: this.imageObj.clientWidth,
        fill: "rgb(0,255,0)",
        stroke: "rgb(0,0,0)",
        cornerSize: 20
      };
      GenericSprite.__super__.constructor.call(this, this.imageObj, shapeParams);
    }

    GenericSprite.prototype.isRandom = function() {
      var action;
      if (this._rules.length && this._rules[0] !== void 0) {
        action = this._rules[0].action;
        return action.stateRandom;
      }
      return this.stateRandom;
    };

    GenericSprite.prototype.showRandom = function() {
      if (this.stateTranspose) {
        return this.tempRandom;
      }
      return this.isRandom();
    };

    GenericSprite.prototype.setRandom = function(value) {
      var action;
      if (this.stateTranspose) {
        this.tempRandom = value;
        return;
      }
      this.stateRandom = value;
      if (this._rules.length) {
        action = this._rules[0].action;
        return action.stateRandom = value;
      }
    };

    GenericSprite.prototype.setRandomRange = function(range) {
      if (this.stateTranspose) {
        this.tempRandomRange = range;
        return;
      }
      return this.randomRange = range;
    };

    GenericSprite.prototype.isEditing = function() {
      return this.stateRecording;
    };

    GenericSprite.prototype.interactionEvent = function(obj) {
      var surviveObj;
      if (this.stateTranspose) {
        console.log("Error: interactionEvent called during Transpose");
        return;
      }
      console.log('Received interaction between ' + this + ' and ' + obj);
      this.stateRecording = false;
      this.ruleTempObject = obj;
      surviveObj = this;
      return uiInteractionChoose(this, function(choice) {
        return surviveObj.interactionCallback(choice);
      });
    };

    GenericSprite.prototype.interactionCallback = function(choice) {
      var r;
      console.log('Received interaction callback ' + choice);
      if (choice === 'transpose') {
        this.stateTranspose = true;
        this.initState = getObjectState(this);
        return this.stateRecording = false;
      } else if (choice === 'close') {
        this.stateTranspose = false;
        this.stateRecording = false;
        return this.showNormal();
      } else if (choice === 'clone') {
        r = new OverlapInteraction(this.ruleTempObject);
        r.addClone();
        this.addIRule(r, this.ruleTempObject.spriteType);
        this.stateTranspose = false;
        this.stateRecording = false;
        return this.showNormal();
      } else if (choice === 'delete') {
        r = new OverlapInteraction(this.ruleTempObject);
        r.addDelete();
        this.addIRule(r, this.ruleTempObject.spriteType);
        this.stateRecording = false;
        this.stateTranspose = false;
        return this.showNormal();
      }
    };

    GenericSprite.prototype.applyRules = function(environment) {
      var rule, _i, _len, _ref, _results;
      this.saveToJSON();
      console.log('--Regular Rules');
      _ref = this._rules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule === void 0) {
          continue;
        }
        console.log('applying rule' + rule);
        _results.push(rule.act(this, environment));
      }
      return _results;
    };

    GenericSprite.prototype.prepIRules = function(environment) {
      var rule, _i, _len, _ref, _results;
      _ref = this._irules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule === void 0) {
          continue;
        }
        _results.push(this.prepObj = rule.prep(this, environment));
      }
      return _results;
    };

    GenericSprite.prototype.applyIRules = function(environment) {
      var rule, _i, _len, _ref, _results;
      console.log('--Interaction Rules');
      _ref = this._irules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule === void 0) {
          continue;
        }
        console.log('Applying an iRule');
        _results.push(rule.act(this, environment));
      }
      return _results;
    };

    GenericSprite.prototype.addRule = function(rule) {
      this._rules[0] = rule;
      rule.action.stateRandom = this.stateRandom;
      return this._rules.length - 1;
    };

    GenericSprite.prototype.setRule = function(index, rule) {
      return this._rules[index] = rule;
    };

    GenericSprite.prototype.addIRule = function(rule, index) {
      this._irules[index] = rule;
      return this._irules.length - 1;
    };

    GenericSprite.prototype.addSimpleClone = function() {
      var r;
      r = new Rule();
      r.setActionType('clone');
      return this.setRule(1, r);
    };

    GenericSprite.prototype.removeClone = function() {
      return delete this._rules[1];
    };

    GenericSprite.prototype.isClone = function() {
      if (this._rules[1] !== void 0) {
        return true;
      }
      return false;
    };

    GenericSprite.prototype.learningToggle = function() {
      var endState, r;
      if (this.stateTranspose) {
        this.stateTranspose = false;
        this.showNormal();
        endState = getObjectState(this);
        r = new OverlapInteraction(this.ruleTempObject);
        r.setActionType('transform');
        r.addTransform(this.initState, endState);
        if (this.tempRandom) {
          r.addRandom(this.tempRandomRange);
          this.tempRandom = false;
        }
        this.addIRule(r, this.ruleTempObject.spriteType);
        return;
      }
      if (!this.stateRecording) {
        this.initState = getObjectState(this);
        this.showLearning();
        return this.stateRecording = true;
      } else {
        endState = getObjectState(this);
        this.showNormal();
        r = new Rule(this.spriteType);
        r.setActionType('transform');
        r.addTransform(this.initState, endState);
        if (this.isRandom()) {
          r.addRandom(this.randomRange);
        }
        this.addRule(r);
        return this.stateRecording = false;
      }
    };

    GenericSprite.prototype.showLearning = function() {
      this.set({
        borderColor: "red",
        cornerColor: "red"
      });
      return canvas.renderAll();
    };

    GenericSprite.prototype.showNormal = function() {
      this.set({
        borderColor: "rgb(210,210,255)",
        cornerColor: "rgb(210,210,255)"
      });
      return canvas.renderAll();
    };

    GenericSprite.prototype.trueIntersectsWithObject = function(obj) {
      if (this.intersectsWithObject(obj)) {
        return true;
      }
      if (this.isContainedWithinObject(obj)) {
        return true;
      }
      if (obj.isContainedWithinObject(this)) {
        return true;
      }
      return false;
    };

    GenericSprite.prototype.removeFromList = function() {
      var idx;
      idx = spriteList.indexOf(this);
      if (idx >= 0) {
        console.log('splicing ' + idx);
        return spriteList.splice(idx, 1);
      }
    };

    GenericSprite.prototype.saveToJSON = function() {
      var fabricJSON, jsonObj;
      jsonObj = {};
      fabricJSON = JSON.stringify(this.toJSON());
      jsonObj['fabric'] = fabricJSON;
      jsonObj['stateTranspose'] = this.stateTranspose;
      jsonObj['stateRecording'] = this.stateRecording;
      jsonObj['stateRandom'] = this.stateRandom;
      jsonObj['randomRange'] = this.randomRange;
      jsonObj['ruleTempObject'] = 'XXX';
      jsonObj['tempRandom'] = this.tempRandom;
      jsonObj['tempRandomRange'] = this.tempRandomRange;
      jsonObj['spriteType'] = this.spriteType;
      this.ruleTempObject = null;
      this.tempRandomRange = 15;
      this.prepObj = null;
      console.log(jsonObj);
      console.log("L: " + this.getLeft() + " T: " + this.getTop());
      return jsonObj;
    };

    GenericSprite.prototype.restoreFromJSON = function(json) {
      var fabricObj;
      fabricObj = JSON.parse(json['fabric']);
      this.constructor.fromObject(fabricObj);
      this._initConfig(fabricObj);
      canvas.add(this);
      console.log("Rest L: " + this.getLeft() + " T: " + this.getTop());
      this.stateTranspose = false;
      this.stateRecording = false;
      this.stateRandom = json['stateRandom'];
      this.randomRange = json['randomRange'];
      this.spriteType = json['spriteType'];
      return this.setCoords();
    };

    return GenericSprite;

  })(fabric.Image);

  SpriteFactory = function(spriteType, imageObj) {
    var Sprite;
    console.log("sprite factory" + spriteType + imageObj);
    Sprite = (function(_super) {

      __extends(Sprite, _super);

      console.log("class sprite");

      Sprite.prototype.spriteType = spriteType;

      Sprite.prototype.imageObj = imageObj;

      Sprite.prototype._rules = [];

      Sprite.prototype._irules = [];

      Sprite.prototype._count = 0;

      function Sprite(spriteType) {
        Sprite.prototype._count = Sprite.prototype._count + 1;
        Sprite.__super__.constructor.call(this, spriteType);
      }

      Sprite.addClassRule = function(rule, idx) {
        if (idx === void 0) {
          idx = 0;
        }
        return Sprite.prototype._rules[idx] = rule;
      };

      Sprite.addClassIRule = function(rule, idx) {
        if (idx === void 0) {
          idx = 0;
        }
        return Sprite.prototype._irules[idx] = rule;
      };

      return Sprite;

    })(GenericSprite);
    return Sprite;
  };

  Rule = (function() {

    function Rule(spriteType) {
      this.spriteType = spriteType;
      this.action = null;
      this.type = '';
    }

    Rule.prototype.act = function(sprite, environment) {
      console.log('Rule[' + this.name + '].act: ' + sprite.spriteType);
      if (this.action !== null) {
        return this.action.act(sprite);
      }
    };

    Rule.prototype.prep = function(sprite, environment) {};

    Rule.prototype.setActionType = function(type) {
      var actClass;
      this.type = type;
      actClass = (function() {
        switch (type) {
          case 'transform':
            return TransformAction;
          case 'clone':
            return CloneAction;
          case 'delete':
            return DeleteAction;
        }
      })();
      return this.action = new actClass();
    };

    Rule.prototype.addTransform = function(start, end) {
      if (this.type !== 'transform') {
        console.log('Error: addTransform called on other type of Rule');
      }
      this.action = new TransformAction();
      return this.action.setTransformDelta(start, end);
    };

    Rule.prototype.addRandom = function(range) {
      this.action.randomRange = range;
      return this.action.stateRandom = true;
    };

    Rule.prototype.addClone = function() {
      this.type = 'clone';
      return this.action = new CloneAction();
    };

    Rule.prototype.addDelete = function() {
      this.type = 'delete';
      return this.action = new DeleteAction();
    };

    Rule.prototype.toJSON = function() {
      var object;
      object = {};
      object.type = 'default';
      object.action = this.action.toJSON();
      return object;
    };

    Rule.createFromData = function(data) {
      var act, actClass, actionObj, className, obj;
      className = '';
      className = (function() {
        switch (data.type) {
          case 'overlap':
            return OverlapInteraction;
          case 'interaction':
            return Interaction;
          case 'default':
            return Rule;
        }
      })();
      if (data.type === 'default') {
        obj = new className;
      } else {
        obj = new className(data.targetType);
      }
      actionObj = data.action;
      actClass = (function() {
        switch (actionObj.type) {
          case 'transform':
            return TransformAction;
          case 'clone':
            return CloneAction;
          case 'delete':
            return DeleteAction;
        }
      })();
      act = new actClass;
      act.restoreFromJSON(actionObj);
      obj.action = act;
      return obj;
    };

    return Rule;

  })();

  Interaction = (function(_super) {

    __extends(Interaction, _super);

    function Interaction(target) {
      if (typeof target === 'object') {
        console.log('Interaction: New ' + target.spriteType);
        this.targetType = target.spriteType;
      } else {
        this.targetType = target;
      }
    }

    Interaction.prototype.setEnvironment = function(requiredEnvironment) {
      this.requiredEnvironment = requiredEnvironment;
    };

    Interaction.prototype.act = function(sprite, environment) {
      var minCount, shouldAct, spriteType, _ref;
      shouldAct = true;
      _ref = this.requiredEnvironment;
      for (spriteType in _ref) {
        minCount = _ref[spriteType];
        if (!(spriteType in environment)) {
          shouldAct = false;
        } else if (environment[spriteType] < minCount) {
          shouldAct = false;
        }
      }
      if (shouldAct) {
        return sprite.applyTransform(this.transform);
      }
    };

    Interaction.prototype.toJSON = function() {
      var obj;
      obj = Interaction.__super__.toJSON.apply(this, arguments);
      obj.type = 'interaction';
      obj.targetType = this.targetType;
      return obj;
    };

    return Interaction;

  })(Rule);

  OverlapInteraction = (function(_super) {

    __extends(OverlapInteraction, _super);

    function OverlapInteraction() {
      return OverlapInteraction.__super__.constructor.apply(this, arguments);
    }

    OverlapInteraction.prototype.setEnvironment = function(requiredEnvironment) {
      this.requiredEnvironment = requiredEnvironment;
    };

    OverlapInteraction.prototype.prep = function(sprite, environment) {
      return this.actOn(sprite);
    };

    OverlapInteraction.prototype.actOn = function(sprite) {
      var obj, objects, _i, _len;
      objects = canvas.getObjects();
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        obj = objects[_i];
        if (obj === sprite) {
          continue;
        }
        if (!(obj instanceof GenericSprite)) {
          continue;
        }
        if (obj.spriteType !== this.targetType) {
          continue;
        }
        if (obj.trueIntersectsWithObject(sprite)) {
          return obj;
        }
      }
      return false;
    };

    OverlapInteraction.prototype.act = function(sprite, environment) {
      var obj;
      obj = sprite.prepObj;
      if (obj === false) {
        return false;
      }
      this.action.act(sprite);
      return sprite.prepObj = null;
    };

    OverlapInteraction.prototype.addClone = function() {
      OverlapInteraction.__super__.addClone.apply(this, arguments);
      return this.action.spawnWait = 1;
    };

    OverlapInteraction.prototype.toJSON = function() {
      var obj;
      obj = OverlapInteraction.__super__.toJSON.apply(this, arguments);
      obj.type = 'overlap';
      obj.targetType = this.targetType;
      return obj;
    };

    return OverlapInteraction;

  })(Interaction);

  Action = (function() {

    function Action() {}

    Action.prototype.act = function(sprite) {
      return console.log("Action is an abstract class, don't use it.");
    };

    Action.prototype.restoreFromJSON = function(data) {};

    return Action;

  })();

  DeleteAction = (function(_super) {

    __extends(DeleteAction, _super);

    function DeleteAction() {
      return DeleteAction.__super__.constructor.apply(this, arguments);
    }

    DeleteAction.prototype.act = function(sprite) {
      console.log('DeleteAction: act');
      return spriteDeleteList.push(sprite);
    };

    DeleteAction.prototype.toJSON = function() {
      var object;
      object = {};
      object.type = 'delete';
      return object;
    };

    return DeleteAction;

  })(Action);

  CloneAction = (function(_super) {

    __extends(CloneAction, _super);

    function CloneAction() {
      this.spawnWait = 2;
    }

    CloneAction.prototype.act = function(sprite) {
      var newSprite;
      console.log('act: CloneAction (spawnWait: ' + this.spawnWait + ')');
      if ((Math.random() * this.spawnWait) > 1) {
        return;
      }
      if (window.spriteTypeList[sprite.spriteType].prototype._count >= window.maxSprites) {
        return;
      }
      newSprite = new window.spriteTypeList[sprite.spriteType];
      spriteList.push(newSprite);
      newSprite.setTop(sprite.getTop() + Math.random() * 20 - 10);
      newSprite.setLeft(sprite.getLeft() + Math.random() * 20 - 10);
      canvas.add(newSprite);
      return canvas.renderAll();
    };

    CloneAction.prototype.toJSON = function() {
      var object;
      object = {};
      object.type = 'clone';
      object.spawnWait = this.spawnWait;
      return object;
    };

    CloneAction.prototype.restoreFromJSON = function(data) {
      CloneAction.__super__.restoreFromJSON.call(this);
      return this.spawnWait = data.spawnWait;
    };

    return CloneAction;

  })(Action);

  TransformAction = (function(_super) {

    __extends(TransformAction, _super);

    function TransformAction() {
      this.transform = {
        dx: 0,
        dy: 0,
        dr: 0,
        dxScale: 1,
        dyScale: 1
      };
      this.stateRandom = false;
      this.randomRange = 15;
    }

    TransformAction.prototype.setTransformDelta = function(start, end) {
      var dx, dy, rad, x, y;
      dx = end.left - start.left;
      dy = end.top - start.top;
      rad = start.angle * Math.PI / 180;
      x = dx * Math.cos(-rad) - dy * Math.sin(-rad);
      y = -dx * Math.sin(rad) + dy * Math.cos(rad);
      this.transform.dxScale = end.width - start.width;
      this.transform.dyScale = end.height - start.height;
      this.transform.dx = x;
      this.transform.dy = y;
      return this.transform.dr = end.angle - start.angle;
    };

    TransformAction.prototype.act = function(sprite) {
      var dx, dy, range, rawAngle, theta;
      console.log('TransformAction: ' + sprite.spriteType);
      rawAngle = sprite.getAngle();
      if (this.stateRandom) {
        range = this.randomRange / 180;
        theta = (sprite.getAngle() + this.transform.dr) * Math.PI / 180 + (Math.random() * range - range / 2) * (2 * Math.PI);
      } else {
        theta = (sprite.getAngle() + this.transform.dr) * Math.PI / 180;
      }
      if (isNaN(theta)) {
        theta = 0;
      }
      dx = this.transform.dx * Math.cos(theta) - this.transform.dy * Math.sin(theta);
      dy = this.transform.dx * Math.sin(theta) + this.transform.dy * Math.cos(theta);
      sprite.set({
        left: sprite.getLeft() + dx,
        top: sprite.getTop() + dy,
        angle: sprite.getAngle() - this.transform.dr,
        width: sprite.width + this.transform.dxScale,
        height: sprite.height + this.transform.dyScale
      });
      sprite.setAngle(theta * 180 / Math.PI);
      return sprite.setCoords();
    };

    TransformAction.prototype.toJSON = function() {
      var object;
      object = {};
      object.type = 'transform';
      object.stateRandom = this.stateRandom;
      object.randomRange = this.randomRange;
      object.transform = this.transform;
      return object;
    };

    TransformAction.prototype.restoreFromJSON = function(data) {
      this.stateRandom = data.stateRandom;
      this.randomRange = data.randomRange;
      return this.transform = data.transform;
    };

    return TransformAction;

  })(Action);

  window.spriteList = [];

  window.spriteTypeList = [];

  window.spriteDeleteList = [];

  window.tick = function() {
    var sprite, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    for (_i = 0, _len = spriteList.length; _i < _len; _i++) {
      sprite = spriteList[_i];
      sprite.applyRules();
    }
    for (_j = 0, _len1 = spriteList.length; _j < _len1; _j++) {
      sprite = spriteList[_j];
      sprite.prepIRules();
    }
    for (_k = 0, _len2 = spriteList.length; _k < _len2; _k++) {
      sprite = spriteList[_k];
      sprite.applyIRules();
    }
    for (_l = 0, _len3 = spriteDeleteList.length; _l < _len3; _l++) {
      sprite = spriteDeleteList[_l];
      sprite.removeFromList();
      sprite.remove();
    }
    canvas.renderAll.bind(canvas);
    return canvas.renderAll();
  };

  window.loadSpriteTypes = function() {
    var spriteTypeList;
    window.maxSprites = 25;
    console.log("loading sprite types");
    spriteTypeList = [];
    return $("#sprite_drawer > img").each(function(i, sprite) {
      console.log("loading sprite type" + i);
      window.spriteTypeList.push(SpriteFactory(i, sprite));
      return $(sprite).draggable({
        revert: false,
        helper: "clone",
        cursorAt: {
          top: 0,
          left: 0
        },
        start: function(e, ui) {
          return $(ui.helper).addClass("ui-draggable-helper");
        },
        stop: function(ev, ui) {
          var newSprite;
          if (pointWithinElement(ev.pageX, ev.pageY, $('#trash_menu_button')) || pointWithinElement(ev.pageX, ev.pageY, $('#trash'))) {
            deleteImageFully(i, this);
            return;
          }
          console.log(i);
          if (window.spriteTypeList[i].prototype._count >= maxSprites) {
            return;
          }
          newSprite = new window.spriteTypeList[i];
          spriteList.push(newSprite);
          newSprite.setTop(ev.pageY);
          newSprite.setLeft(ev.pageX);
          canvas.add(newSprite);
          return canvas.renderAll();
        }
      });
    });
  };

  window.saveSprites = function() {
    var masterObj, obj, objects, oneType, rule, ruleJSON, string, type, typeObjects, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    masterObj = {};
    typeObjects = [];
    for (_i = 0, _len = spriteTypeList.length; _i < _len; _i++) {
      type = spriteTypeList[_i];
      oneType = {};
      oneType.type = type.prototype.spriteType;
      oneType.imageObj = type.prototype.imageObj.src;
      oneType.count = type.prototype._count;
      oneType.rules = [];
      _ref = type.prototype._rules;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        rule = _ref[_j];
        if (rule === void 0) {
          continue;
        }
        ruleJSON = rule.toJSON();
        oneType.rules.push(ruleJSON);
      }
      oneType.irules = [];
      _ref1 = type.prototype._irules;
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        rule = _ref1[_k];
        if (rule === void 0) {
          continue;
        }
        console.log('adding irule to json');
        ruleJSON = rule.toJSON();
        oneType.irules.push(ruleJSON);
      }
      typeObjects.push(oneType);
    }
    masterObj.classObjects = typeObjects;
    objects = [];
    for (_l = 0, _len3 = spriteList.length; _l < _len3; _l++) {
      obj = spriteList[_l];
      objects.push(obj.saveToJSON());
    }
    masterObj.objects = objects;
    string = JSON.stringify(masterObj);
    $('#data').html(string);
    console.log(typeObjects);
    return string;
  };

  window.loadSprites = function(dataString) {
    var imageObjects, img, imgSrc, inObject, iruleData, newSprite, obj, rule, ruleData, sprite, tmpList, typeFactory, typeObj, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4;
    tmpList = [];
    window.spriteTypeList = [];
    _ref = window.spriteList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sprite = _ref[_i];
      tmpList.push(sprite);
    }
    for (_j = 0, _len1 = tmpList.length; _j < _len1; _j++) {
      sprite = tmpList[_j];
      sprite.removeFromList();
      sprite.remove();
    }
    canvas.renderAll();
    inObject = JSON.parse(dataString);
    imageObjects = [];
    $("#sprite_drawer > img").each(function(i, sprite) {
      return imageObjects.push(this);
    });
    _ref1 = inObject.classObjects;
    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
      typeObj = _ref1[_k];
      imgSrc = typeObj.imageObj;
      for (_l = 0, _len3 = imageObjects.length; _l < _len3; _l++) {
        img = imageObjects[_l];
        if (imgSrc === img.src) {
          typeObj.raw = img;
          break;
        }
      }
      typeFactory = SpriteFactory(typeObj.type, typeObj.raw);
      _ref2 = typeObj.rules;
      for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
        ruleData = _ref2[_m];
        rule = Rule.createFromData(ruleData);
        typeFactory.addClassRule(rule);
      }
      _ref3 = typeObj.irules;
      for (_n = 0, _len5 = _ref3.length; _n < _len5; _n++) {
        iruleData = _ref3[_n];
        rule = Rule.createFromData(iruleData);
        typeFactory.addClassIRule(rule, iruleData.targetType);
      }
      window.spriteTypeList.push(typeFactory);
    }
    _ref4 = inObject.objects;
    for (_o = 0, _len6 = _ref4.length; _o < _len6; _o++) {
      obj = _ref4[_o];
      newSprite = new window.spriteTypeList[obj.spriteType];
      newSprite.restoreFromJSON(obj);
      window.spriteList.push(newSprite);
    }
    return canvas.renderAll();
  };

}).call(this);
