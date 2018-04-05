export function getQueryParam(name: string) {
  const queryString: {[queryparam: string]: any} = {};
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof queryString[pair[0]] === "undefined") {
      queryString[pair[0]] = pair[1];
    } else if (typeof queryString[pair[0]] === "string") {
      var arr = [ queryString[pair[0]], pair[1] ];
      queryString[pair[0]] = arr;
    } else {
      queryString[pair[0]].push(pair[1]);
    }
  }
  return queryString[name];
};
