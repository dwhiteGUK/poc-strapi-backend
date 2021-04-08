'use strict';

/**
 * drag-n-drop.js controller
 *
 * @description: A set of functions called "actions" of the `drag-n-drop` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Send 200 `ok`
    ctx.send({
      message: 'ok',
      data: entities
    });
  }
};
