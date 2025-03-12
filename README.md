# Full-Stack Open 
## _Course _ Materials _
-------
## part0
#### Exercise 0.4 - Sequence diagram between client vs. server 
When opening the page (context):
* Page (*https://studies.cs.helsinki.fi/exampleapp/notes*) is opened with GET request ==>>
```<<== Server returns the document with 200 (OK) status code```
* document **<head>** contains the CSS (*exampleapp/main.css*) and Javascript file (*exampleapp/main.js*)
* document initiates the server ==>>
``` <<== Server returns the CSS and JS files with 200 (OK) status code```
* main.js initiates the XMLHttpRequest to get the JSON (*exampleapp/data.json*) ==>> 
```<<== Server returns the JSON with 200 (OK) status code```
* JSON content is dynamically rendered to the page into DOM elements within the callback function

When submitting to the page:
* Form content is sent to (*https://studies.cs.helsinki.fi/exampleapp/new_note*) using the POST method. 
   * The payload (form data) is in the input-tag's content with the name attribute, 'note'.
 * ```<<== Server returns the document with 302 (Redirect) status code```
 * Page is re-rendered with the new note appended to the JSON 

#### Exercise 0.5 - Sequence diagram in a single page app
When opening the page:
* Page (*https://studies.cs.helsinki.fi/exampleapp/spa*) is opened with GET request ==>>
```<<== Server returns the document with 200 (OK) status code```
* document **<head>** contains the CSS (*/exampleapp/main.css*) and Javascript file (*/exampleapp/spa.js*)
* document initiates the server ==>>
``` <<== Server returns the CSS and JS files with 200 (OK) status code```
* main.js initiates the XMLHttpRequest to get the JSON (*exampleapp/data.json*) ==>> 
```<<== Server returns the JSON with 200 (OK) status code```
* JSON content is dynamically rendered to the page into DOM elements within the callback function

#### Exercise 0.6
When submitting to the page:
* Form content is sent to (https://studies.cs.helsinki.fi/exampleapp/new_note_spa) using the POST method. 
* Unlike previously:
   * The note is added to an array and dynamically added to the page 
   * The payload (form data) is then JSON-stringified and sent to the server.
 * ```<<== Server returns the document with 201 (Created) status code```
 * Page is not reloaded due to ```
    ```
    e.preventDefault()
    ```
    ...in the form.onsubmit() method but the response is logged to the console 

