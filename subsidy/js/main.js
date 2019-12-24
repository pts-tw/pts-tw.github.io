// Generated by LiveScript 1.3.0
(function(){
  ldc.register('who', [], function(){
    var lc, view;
    lc = {
      target: {}
    };
    view = new ldView({
      root: '[ld-scope=who]',
      handler: {
        avatar: function(arg$){
          var node;
          node = arg$.node;
          return node.style.backgroundImage = "url(" + siteroot + "assets/img/cand/img_leaderboard_" + lc.num + ".png)";
        },
        name: function(arg$){
          var node;
          node = arg$.node;
          return node.textContent = lc.target.name;
        },
        list: {
          list: function(){
            return lc.target.list;
          },
          handle: function(arg$){
            var node, data, mark, title, amount, val;
            node = arg$.node, data = arg$.data;
            mark = ld$.find(node, '[ld=mark]', 0);
            title = ld$.find(node, '[ld=title]', 0);
            amount = ld$.find(node, '[ld=amount]', 0);
            title.textContent = data.title;
            val = Math.round(data.amount / 1000000) * 1000000;
            amount.textContent = numconvert.a2c(val, {
              partial: true
            });
            return mark.style.backgroundImage = "url(" + siteroot + "assets/img/party/ic_" + data.party + ".png)";
          }
        }
      }
    });
    return ldc.action({
      show: function(name, num){
        var promise;
        promise = !lc.cache
          ? ld$.fetch(siteroot + "assets/data/who.json", {
            method: 'GET'
          }, {
            type: 'json'
          })
          : Promise.resolve(lc.cache);
        return promise.then(function(data){
          var ret;
          lc.cache = data;
          if (!(ret = data.filter(function(it){
            return it.name === name;
          })[0])) {
            return;
          }
          lc.target = ret;
          lc.num = num;
          view.render();
          return lda.ldcvmgr.toggle('who');
        });
      }
    });
  });
  ldc.register('interview', [], function(){
    var lc, view;
    lc = {
      target: {}
    };
    view = new ldView({
      root: '[ld-scope=interview]',
      handler: {
        avatar: function(arg$){
          var node;
          node = arg$.node;
          return node.setAttribute('data-name', siteroot + "assets/img/cand/interview/talk_portrait_" + lc.target.name + ".png");
        },
        name: function(arg$){
          var node;
          node = arg$.node;
          return node.textContent = lc.target.name;
        },
        title: function(arg$){
          var node;
          node = arg$.node;
          return node.textContent = lc.target.title;
        },
        brief: function(arg$){
          var node;
          node = arg$.node;
          return node.textContent = lc.target.brief;
        },
        video: function(arg$){
          var node;
          node = arg$.node;
          return node.setAttribute('src', lc.target.video) || 'about:blank';
        },
        content: function(arg$){
          var node;
          node = arg$.node;
          return node.innerHTML = (lc.target.html || '').replace(/\n/g, '');
        }
      }
    });
    return ldc.action({
      video: function(){
        return lda.ldcvmgr.get('video').then(function(){
          return iframe.setAttribute('src', 'about:blank');
        });
      },
      show: function(name){
        var promise;
        promise = !lc.cache
          ? ld$.fetch(siteroot + "assets/data/interview.json", {
            method: 'GET'
          }, {
            type: 'json'
          })
          : Promise.resolve(lc.cache);
        return promise.then(function(data){
          var ret, modal;
          lc.cache = data;
          if (!(ret = data.filter(function(it){
            return it.name === name;
          })[0])) {
            return;
          }
          lc.target = ret;
          view.render();
          lda.ldcvmgr.toggle('interview');
          modal = ld$.find(document, '.ldcvmgr[data-name=interview]', 0);
          if (modal) {
            return setTimeout(function(){
              return modal.scrollTop = 0;
            }, 100);
          }
        });
      }
    });
  });
  ldc.register('history', [], function(){
    var lc, data, list, step, view;
    lc = {
      idx: 0
    };
    data = datasrc.history;
    list = data.map(function(it){
      return it.year - 1911;
    });
    step = function(dir){
      var ref$, isEnd, x$;
      dir == null && (dir = 1);
      lc.idx = (ref$ = lc.idx + dir) > 0 ? ref$ : 0;
      isEnd = lc.idx === list.length;
      view.get('read').classList.toggle('d-none', isEnd);
      view.get('end').classList.toggle('d-none', !isEnd);
      if (!isEnd) {
        x$ = view.get('illustration');
        x$.setAttribute('src', siteroot + "assets/img/history/history_img_" + list[lc.idx] + ".png");
        x$.classList.add('d-none');
        debounce(10).then(function(){
          return view.get('illustration').classList.remove('d-none');
        });
        view.get('year').innerHTML = "民國<br>" + (data[lc.idx].year - 1911) + "年" + (lc.idx === list.length - 1 ? '<br>迄今' : '');
        return view.get('desc').textContent = data[lc.idx].desc + "";
      }
    };
    ldc.action({
      show: function(){
        lc.idx = 0;
        step(0);
        return lda.ldcvmgr.get('history').then(function(){
          return lc.idx = 0;
        });
      }
    });
    return view = new ldView({
      root: '[ld-scope=history]',
      action: {
        click: {
          prev: function(arg$){
            var node;
            node = arg$.node;
            return step(-1);
          },
          next: function(arg$){
            var node;
            node = arg$.node;
            return step(1);
          }
        }
      },
      handler: {
        illustration: function(arg$){
          var node;
          node = arg$.node;
        },
        year: function(){},
        desc: function(){}
      }
    });
  });
  ldc.register('main', ['ldcvmgr', 'history', 'interview', 'who', 'parallax', 'nav'], function(){
    var lc, update, view;
    lc = {
      vote: {}
    };
    lc.vote = {
      target: '蔡英文',
      cand: {}
    };
    update = function(){
      var list, item;
      list = view.getAll('section').map(function(it){
        return [it.getAttribute('data-value'), it.getBoundingClientRect().top];
      }).filter(function(it){
        return it[1] <= window.innerHeight;
      });
      list.sort(function(a, b){
        return b[1] - a[1];
      });
      item = list[0];
      if (!item) {
        return;
      }
      return view.getAll('hint').map(function(it){
        return it.classList.toggle('active', it.getAttribute('data-value') === item[0]);
      });
    };
    ld$.fetch('https://pts.tellstory.io/e/vote', {
      method: 'GET'
    }, {
      type: 'json'
    }).then(function(ret){
      var k, v;
      ret.map(function(it){
        var ref$, key$;
        return ((ref$ = lc.vote.cand)[key$ = it.name] || (ref$[key$] = {})).count = isNaN(+it.count)
          ? '???'
          : it.count;
      });
      lc.vote.max = Math.max.apply(null, (function(){
        var ref$, results$ = [];
        for (k in ref$ = lc.vote.cand) {
          v = ref$[k];
          results$.push(v.count);
        }
        return results$;
      }()));
      return view.render(['vote-count-total', 'vote-count', 'vote-money']);
    });
    lc.obs = new IntersectionObserver(update, {
      root: null
    });
    view = new ldView({
      root: document,
      action: {
        click: {
          vote: function(arg$){
            var node, key;
            node = arg$.node;
            key = node.getAttribute('data-value');
            lc.vote.target = {
              "song": "宋楚瑜",
              "fish": "韓國瑜",
              "tsai": "蔡英文"
            }[key];
            lc.vote.key = key;
            view.getAll('vote-ani').map(function(it){
              return it.classList.toggle('d-none', true);
            });
            view.get('vote-result').classList.remove('d-none');
            scrollto('#vote-result', 500, 0);
            ld$.fetch('https://pts.tellstory.io/e/vote', {
              method: 'POST'
            }, {
              type: 'json',
              json: {
                v: lc.vote.target
              }
            })['catch'](function(){});
            setTimeout(function(){
              return view.getAll('vote-ani').map(function(it){
                return it.classList.toggle('d-none', false);
              });
            }, 500);
            return view.render();
          },
          hint: function(arg$){
            var node, name, n;
            node = arg$.node;
            name = node.getAttribute('data-value');
            n = view.getAll('section').filter(function(it){
              return it.getAttribute('data-value') === name;
            })[0];
            if (!n) {
              return;
            }
            return scrollto(n, 500);
          }
        }
      },
      init: {
        url: function(arg$){
          var node;
          node = arg$.node;
          return node.value = window.location.href;
        },
        section: function(arg$){
          var node;
          node = arg$.node;
          return lc.obs.observe(node);
        },
        copylink: function(arg$){
          var node, c;
          node = arg$.node;
          c = new ClipboardJS(node);
          return c.on('success', function(){
            node.classList.add('tip-on');
            return setTimeout(function(){
              return node.classList.remove('tip-on');
            }, 2000);
          });
        }
      },
      handler: {
        "vote-cand": function(arg$){
          var node;
          node = arg$.node;
          return node.classList.toggle('d-none', node.getAttribute('data-value') === lc.vote.target);
        },
        "vote-target-portrait": function(arg$){
          var node;
          node = arg$.node;
          if (!lc.vote.key) {
            return;
          }
          return node.style.backgroundImage = "url(" + siteroot + "assets/img/cand/top/img_candidate_" + lc.vote.key + ".png)";
        },
        "vote-target-count": function(arg$){
          var node, ref$, key$;
          node = arg$.node;
          return node.textContent = ((ref$ = lc.vote.cand)[key$ = lc.vote.target] || (ref$[key$] = {})).count || 0;
        },
        "vote-target-name": function(arg$){
          var node;
          node = arg$.node;
          return node.textContent = lc.vote.target;
        },
        "vote-count": function(arg$){
          var node, cand, ref$, key$;
          node = arg$.node;
          cand = (ref$ = lc.vote.cand)[key$ = node.getAttribute('data-value')] || (ref$[key$] = {});
          return node.textContent = cand.count != null ? cand.count : '...';
        },
        "vote-money": function(arg$){
          var node, cand, ref$, key$, v;
          node = arg$.node;
          cand = (ref$ = lc.vote.cand)[key$ = node.getAttribute('data-value') || lc.vote.target] || (ref$[key$] = {});
          return node.textContent = cand.count != null ? cand.count >= lc.vote.max / 3 ? (v = cand.count * 30, numconvert.a2c(v, {
            partial: ['億', '萬']
          })) : 0 : '...';
        },
        "vote-count-total": function(arg$){
          var node, ret, k, v;
          node = arg$.node;
          ret = (function(){
            var ref$, results$ = [];
            for (k in ref$ = lc.vote.cand) {
              v = ref$[k];
              results$.push([k, v]);
            }
            return results$;
          }()).map(function(it){
            return it[1].count;
          }).reduce(function(a, b){
            return a + b;
          }, 0);
          return node.textContent = isNaN(ret) ? '...' : ret;
        }
      }
    });
    return ld$.find(document, '.sticky').map(function(){
      return stickybits('.sticky');
    });
  });
  return ldc.app('main');
})();