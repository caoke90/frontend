export function hget(result, path, def) {
  result = result || {};
  (path || '').split('.').forEach(function (key) {
    if (key && (typeof result !== 'undefined')) {
      result = result[key];
    }
  });
  if (typeof result === 'undefined') {
    return def;
  } else {
    return result;
  }
}

export function hset(result, path, value) {
  if (typeof value === 'undefined') {
    for (var k in path) {
      this[k] = path[k];
    }
  } else {
    path = String(path || '').trim();
    if (path) {
      var paths = path.split('.');
      var last = paths.pop();
      var data = result || {};
      paths.forEach(function (key) {
        var type = typeof data[key];
        if (type === 'object') {
          data = data[key];
        } else if (type === 'undefined') {
          data = data[key] = {};
        } else {
          console.error('forbidden to set property[' + key + '] of [' + type + '] data');
        }
      });
      data[last] = value;
    }
  }
  return result;
}
