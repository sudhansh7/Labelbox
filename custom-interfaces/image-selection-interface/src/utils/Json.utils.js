export default class {

  /**
   * dp stands for double parse - takes a string and returns object
   *
   * @static
   * @param {String} string
   * @returns
   */
  static dp(string) {
    try {
      JSON.parse(string);
      JSON.parse(JSON.parse(string));
    } catch(err) {
      throw new Error(err);
    }

    return JSON.parse(JSON.parse(string));
  }

  /**
   * ds stands for double stringify - takes an object and returns it stringified twice
   *
   * @static
   * @param {Object} obj
   * @returns
   */
  static ds(obj) {
    try {
      JSON.stringify(obj);
      JSON.stringify(JSON.stringify(obj));
    } catch(err) {
      throw new Error(err);
    }

    return JSON.stringify(JSON.stringify(obj));
  }
}