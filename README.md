# backend-v2

## Steps to run:
* ``npm install``
* Install Redis locally (for development).
  * Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04
  * Mac: https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298
* Run Redis Server in background.
* Instal Mongodb locally (for development).
* Run Mongodb in background.
* Create ``.env`` file in project's root directory.
  * Add ``MONGO_HOST_URL=your_url_here``. It can be ``localhost:27017`` or ``HOST url``.
* Run Node.js server: ``node index.js``. Server will listen on port **3000**.
