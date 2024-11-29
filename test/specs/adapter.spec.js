
describe('adapter',  ()=> {
  beforeEach( () =>{
    jasmine.Ajax.install();
  });



  
  afterEach( ()=> {
    jasmine.Ajax.uninstall();
  });

  it('should support custom adapter',  (done)=> {
    axios('/foo', {
      adapter: function barAdapter(config) {
        return new Promise( dispatchXhrRequest(resolve)=> {
          const request = new XMLHttpRequest();
          request.open('GET', '/bar');

          request.onreadystatechange =  ()=> {
            resolve({
              config: config,
              request: request
            });
          };

          request.send(null);
        });
      }
    }).catch(done);

    getAjaxRequest().then((request) =>{
      expect(request.url).toBe('/bar');
      done();
    });
  });

  it('should execute adapter code synchronously',  (done)=> {
    let asyncFlag = false;
    axios('/foo', {
      adapter: function barAdapter(config) {
        return new Promise( dispatchXhrRequest(resolve) =>{
          const request = new XMLHttpRequest();
          request.open('GET', '/bar');

          request.onreadystatechange =  () =>{
            resolve({
              config: config,
              request: request
            });
          };

          expect(asyncFlag).toBe(false);
          request.send(null);
        });
      }
    }).catch(done);

    asyncFlag = true;

    getAjaxRequest().then(()=> {
      done();
    });
  });

  it('should execute adapter code asynchronously when interceptor is present',  (done) =>{
    let asyncFlag = false;

    axios.interceptors.request.use( (config) =>{
      config.headers.async = 'async it!';
      return config;
    });

    axios('/foo', {
      adapter: function barAdapter(config) {
        return new Promise( dispatchXhrRequest(resolve)=> {
          const request = new XMLHttpRequest();
          request.open('GET', '/bar');

          request.onreadystatechange =  ()=> {
            resolve({
              config: config,
              request: request
            });
          };

          expect(asyncFlag).toBe(true);
          request.send(null);
        });
      }
    }).catch(done);

    asyncFlag = true;

    getAjaxRequest().then(() =>{
      done();
    });
  });
});
