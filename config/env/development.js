/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

export default {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  port: 3000,

  connections: {
    mongo: {
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017
    }
  },

  session: {
    adapter: 'mongo',
    host: 'localhost',
    port: 27017,
    db: 'sails',
    collection: 'sessions'
  }

};
