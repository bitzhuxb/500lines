// Generated by LiveScript 1.3.0
(function(){
  var ref$, table, thead, tbody, tr, th, td, input, div, button, SheetDefault, SheetInit, Table, Row, Cell, slice$ = [].slice;
  ref$ = React.DOM, table = ref$.table, thead = ref$.thead, tbody = ref$.tbody, tr = ref$.tr, th = ref$.th, td = ref$.td, input = ref$.input, div = ref$.div, button = ref$.button;
  SheetDefault = {
    A1: 1874,
    B1: '+',
    C1: 2046,
    D1: '⇒',
    E1: '=A1+C1'
  };
  SheetInit = (function(){
    try {
      return JSON.parse(localStorage.getItem(''));
    } catch (e$) {}
  }()) || SheetDefault;
  Table = React.createClass({
    getDefaultProps: function(){
      return {
        Cols: ["A", "B", "C", "D", "E", "F", "G", "H"],
        Rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      };
    },
    getInitialState: function(){
      return {
        sheet: SheetInit,
        vals: {},
        errs: {}
      };
    },
    render: function(){
      var ref$, Cols, Rows, col, row;
      ref$ = this.props, Cols = ref$.Cols, Rows = ref$.Rows;
      return table({}, thead({}, tr.apply(null, [
        {}, th({}, button({
          type: 'button',
          onClick: bind$(this, 'reset')
        }, '↻'))
      ].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = Cols).length; i$ < len$; ++i$) {
          col = ref$[i$];
          results$.push(th({}, col));
        }
        return results$;
      }())))), tbody.apply(null, [{}].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = Rows).length; i$ < len$; ++i$) {
          row = ref$[i$];
          results$.push(Row(import$({
            Cols: Cols,
            row: row,
            onChange: bind$(this, 'onChange')
          }, this.state)));
        }
        return results$;
      }.call(this)))));
    },
    reset: function(){
      return this.calc(SheetDefault);
    },
    componentDidMount: function(){
      return this.calc(this.state.sheet);
    },
    calc: function(sheet){
      var worker, ref$, timeout, this$ = this;
      worker = (ref$ = this.state).worker || (ref$.worker = this.props.worker);
      timeout = setTimeout(function(){
        worker.terminate();
        return this$.setState({
          worker: new Worker('worker.js')
        });
      }, 99);
      worker.onmessage = function(arg$){
        var ref$, errs, vals;
        ref$ = arg$.data, errs = ref$[0], vals = ref$[1];
        clearTimeout(timeout);
        localStorage.setItem('', JSON.stringify(sheet));
        return this$.setState({
          sheet: sheet,
          errs: errs,
          vals: vals
        });
      };
      return worker.postMessage(sheet);
    },
    onChange: function(arg$){
      var ref$, id, value, sheet;
      ref$ = arg$.target, id = ref$.id, value = ref$.value;
      sheet = import$({}, this.state.sheet);
      return this.calc((sheet[id + ""] = value, sheet));
    }
  });
  Row = React.createClass({
    render: function(){
      var ref$, Cols, sheet, vals, errs, row, onChange;
      ref$ = this.props, Cols = ref$.Cols, sheet = ref$.sheet, vals = ref$.vals, errs = ref$.errs, row = ref$.row, onChange = ref$.onChange;
      return tr.apply(null, [{}, th({}, row)].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = Cols).length; i$ < len$; ++i$) {
          results$.push((fn$.call(this, ref$[i$])));
        }
        return results$;
        function fn$(col){
          var id, onKeyDown;
          id = col + row;
          onKeyDown = partialize$.apply(this, [bind$(this, 'onKeyDown'), [void 8, col, row], [0]]);
          return Cell({
            id: id,
            onChange: onChange,
            onKeyDown: onKeyDown,
            txt: sheet[id],
            err: errs[id],
            val: vals[id]
          });
        }
      }.call(this))));
    },
    onKeyDown: function(arg$, col, row){
      var target, key, direction, cell;
      target = arg$.target, key = arg$.key;
      switch (false) {
      case key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'Enter':
        direction = key === 'ArrowUp'
          ? -1
          : +1;
        cell = document.querySelector("#" + col + (row + direction));
        return cell != null ? cell.focus() : void 8;
      }
    }
  });
  Cell = React.createClass({
    render: function(){
      var ref$, id, txt, err, val, onChange, onKeyDown;
      ref$ = this.props, id = ref$.id, txt = ref$.txt, err = ref$.err, val = ref$.val, onChange = ref$.onChange, onKeyDown = ref$.onKeyDown;
      return td({
        className: (txt != null ? txt[0] : void 8) === '=' ? 'formula' : ''
      }, input({
        id: id,
        type: 'text',
        value: txt,
        onChange: onChange,
        onKeyDown: onKeyDown
      }), div({
        className: err
          ? 'error'
          : val != null && val[0] ? 'text' : ''
      }, err || val));
    }
  });
  window.init = function(){
    var worker;
    worker = new Worker('worker.js');
    worker.onmessage = function(){
      return React.renderComponent(Table({
        worker: worker
      }), document.body);
    };
    return worker.postMessage(null);
  };
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function partialize$(f, args, where){
    var context = this;
    return function(){
      var params = slice$.call(arguments), i,
          len = params.length, wlen = where.length,
          ta = args ? args.concat() : [], tw = where ? where.concat() : [];
      for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
      return len < wlen && len ?
        partialize$.apply(context, [f, ta, tw]) : f.apply(context, ta);
    };
  }
}).call(this);
