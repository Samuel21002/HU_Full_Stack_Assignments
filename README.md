# Full-Stack Open 
## _Course _ Materials _
-------
## part0
#### Exercise 0.4 - Sequence diagram between client vs. server
When opening the page:
* Page (https://studies.cs.helsinki.fi/exampleapp/notes) is opened with GET request ==>>
```<<== Server returns the document with 200 status code```
* document **<head>** contains the CSS (*main.css*) and Javascript file (*main.js*)
* document initiates the server ==>>
``` <<== Server returns the CSS and JS files with 200 status code```
* main.js initiates the XMLHttpRequest to the endpoint (https://studies.cs.helsinki.fi/exampleapp/main.js) to get the JSON (data.json) ==>> 
```<<== Server returns the JSON with 200 status code```
* JSON content is dynamically rendered to the page into DOM elements within the callback function

When submitting to the page:
* Form content is sent to (https://studies.cs.helsinki.fi/exampleapp/new_note) using the POST method. 
   * The payload (form data) is in the input-tag's content with the name attribute, 'note'.
 * ```<<== Server returns the document with 302 status code```
 * Page is re-rendered with the new note appended to the JSON 
