### About

Apiboy is a javascript library created to simplify working with REST api by providing a set of features and utilities:

* fetch methods with relative url
* CRUD api model
* canceling repeatable requests
* default middleware
* custom middleware


### How to use it


fetch methods with relative url


```js
import apiboy from 'apiboy'

// Configure apiboy on init
apiboy.setConfig('https://your.api.url.com/')

// Now you can do
apiboy.get('someurlget')
apiboy.post('someurlpost')
apiboy.put('someurlput')
apiboy.del('someurldelete')

// Which will be the same as
fetch('https://your.api.url.com/someurlget', { method: 'GET' })
fetch('https://your.api.url.com/someurlpost', { method: 'POST' })
fetch('https://your.api.url.com/someurlput', { method: 'PUT' })
fetch('https://your.api.url.com/someurldelete', { method: 'DELETE' })
```


CRUD api Model


```js
import apiboy from 'apiboy'

// Configure apiboy on init
// NOTE! config can't be updated after that
apiboy.setConfig('https://your.api.url.com/')

// Make item api
const itemApi = new apiboy.RequestModel('item')

// Now you can do
let item = { id: 2, value: 'test' }
itemApi.all()
itemApi.all({active: true})  // some filters
itemApi.get(item)
itemApi.add(item)
itemApi.update(item)
itemApi.delete(item)

// Which will be the same as
fetch('https://your.api.url.com/item', { method: 'GET' })
fetch('https://your.api.url.com/item?active=true', { method: 'GET' })
fetch('https://your.api.url.com/item/2', { method: 'GET' })
fetch('https://your.api.url.com/item', { method: 'POST', body: JSON.stringify(item) })
fetch('https://your.api.url.com/item/2', { method: 'PUT', body: JSON.stringify(item) })
fetch('https://your.api.url.com/item/2', { method: 'DELETE', body: JSON.stringify(item) })
```


Cancel repeatable GET requests!


```js
import apiboy from 'apiboy'

// Cancel all repeatable get requests by default by providing second argument in setConfig
apiboy.setConfig('https://your.api.url.com/', true)


apiboy.get('someurl') // This promise will be rejected with { isCanceled: true, error: '{key} request is canceled by the next request' }
apiboy.get('someurl') // This promise will be rejected with { isCanceled: true, error: '{key} request is canceled by the next request' }
apiboy.get('someurl') // works well

// Or dont by specifying third argument
apiboy.get('someurl', null, false) // works well
apiboy.get('someurl', null, false) // works well
apiboy.get('someurl', null, false) // works well
```


Default Middleware


Apiboy has default middleware for parsing responses, which will give you:

* response.json() on success
* 'Server Error, 500' message on 500
* 'Server Error, 404' message on 404
* Error message received from server or 'Server Error' for other error codes


Custom Middleware:


* request

Add request middleware to parse url and config before sending request


```js
import apiboy from 'apiboy'

apiboy.setConfig('https://your.api.url.com/')

// for showcase purposes
let mobile = true

// Set custom middleware. Can be done only once
apiboy.setMiddleware({
  requests: [requestMiddlewareOne, requestMiddlewareOne],
  responses: []
})

function requestMiddlewareOne (url, config) {
  // Do anything with url and params
  let urlToGo = url
  let configToSend = {...config}
  if (config.method !== 'GET' && mobile) {
    urlToGo = url + '/mobile/'
    config.mode = 'cors'
  }

  // must return an array with url and config
  return [url, config]
}

function requestMiddlewareTwo (url, config) {
  // Do anything with url and params
  let headers = new Headers()

  // must return an array with url and config
  return [url, Object.assign({ headers: headers }, config)]
}

// And after each request like
apiboy.post('someurl')
apiboy.delete('someurl')
apiboy.get('someurl')

// You'll get
fetch('https://your.api.url.com/someurl/mobile/', { method: 'POST', mode: 'cors', headers: HeadersObject })
fetch('https://your.api.url.com/someurl/mobile/', { method: 'DELETE', mode: 'cors', headers: HeadersObject })
fetch('https://your.api.url.com/someurl/mobile/', { headers: HeadersObject })
```


* response

Add response middleware to parse url and config before sending request


```js
import apiboy from 'apiboy'

apiboy.setConfig('https://your.api.url.com/')

// for showcase purposes
let user = { isAuthenticated: false }

// Set custom middleware. Can be done only once
apiboy.setMiddleware({
  requests: [],
  responses: [responseMiddlewareOne]
})

function responseMiddlewareOne (promise) {
  // Do anything with promise response from server and return promise

  return promise
    .then(response => {
        if (user.isAuthenticated) {
          return {
            data: response.authenticated
          }
        }

        return response.defaults
      })
}

function responseMiddlewareOne (promise) {
  // Do anything with promise response from server and return promise

  return promise
    .then(
      response => response,
      error => {
        if (error.code === 403) {
          return {
            error: 'User is not authorized'
          }
        }
      }
    )
}

// And after request like
apiboy.post('someurl')
apiboy.delete('someurl')
apiboy.get('someurl')

// If it returns error with 403 code, you'll get Promise that will be resolved to
// { error: 'User is not authorized' }
```


Make absolute requests with abs to use middleware provided


```js
import apiboy from 'apiboy'
import { responseMiddlewareOne } from 'responseMiddlewareOne'

// Configure apiboy on init
apiboy.setConfig('https://your.api.url.com/')

// Set custom middleware. Can be done only once
apiboy.setMiddleware({
  requests: [],
  responses: [responseMiddlewareOne]
})


apiboy.abs('http://some.abs.url.com')

// all the request and response middleware will be executed
```




### TODO

* offline support
* write more detailed README
* document code
* write tests for canceled requests
