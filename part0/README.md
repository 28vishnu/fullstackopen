Exercise 0.4: New Note Diagram (Traditional App)

This diagram illustrates the sequence of HTTP requests and events that occur when a user submits a new note on the traditional notes page.

sequenceDiagram
    participant browser
    participant server

    Note over browser: User types a new note in the text box and clicks "Save"

    browser->>server: POST [https://studies.cs.helsinki.fi/exampleapp/new_note](https://studies.cs.helsinki.fi/exampleapp/new_note)
    activate server
    Note over server: Server extracts the text, creates a note object, and adds it to the notes array
    server-->>browser: HTTP Status 302 (Redirect to /notes)
    deactivate server

    Note over browser: The 302 Redirect forces the browser to completely reload the notes page

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/notes](https://studies.cs.helsinki.fi/exampleapp/notes)
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/main.css](https://studies.cs.helsinki.fi/exampleapp/main.css)
    activate server
    server-->>browser: the CSS file
    deactivate server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/main.js](https://studies.cs.helsinki.fi/exampleapp/main.js)
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/data.json](https://studies.cs.helsinki.fi/exampleapp/data.json)
    activate server
    server-->>browser: [{ "content": "My traditional note", "date": "2026-06-17" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function to render all notes onto the page


Exercise 0.5: Single Page App Diagram

This diagram shows the sequence of requests when a user first visits the Single Page App (SPA) version of the notes tool.

sequenceDiagram
    participant browser
    participant server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/spa](https://studies.cs.helsinki.fi/exampleapp/spa)
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/main.css](https://studies.cs.helsinki.fi/exampleapp/main.css)
    activate server
    server-->>browser: the CSS file
    deactivate server

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/spa.js](https://studies.cs.helsinki.fi/exampleapp/spa.js)
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser executes the spa.js script, which initiates a request for JSON data

    browser->>server: GET [https://studies.cs.helsinki.fi/exampleapp/data.json](https://studies.cs.helsinki.fi/exampleapp/data.json)
    activate server
    server-->>browser: [{ "content": "SPA Load Test", "date": "2026-06-17" }, ... ]
    deactivate server

    Note right of browser: The browser processes the data and uses JavaScript to draw the list on the screen


Exercise 0.6: New Note in Single Page App Diagram

This diagram details what happens when a user creates a new note in the SPA. Notice that there is only one background HTTP POST request, and no screen reloads are needed.

sequenceDiagram
    participant browser
    participant server

    Note over browser: User types a note in the input field and clicks "Save"
    Note right of browser: Local JavaScript intercepts the submit event to stop page reloads (e.preventDefault())
    Note right of browser: JavaScript immediately adds the note to the local list and updates the DOM

    browser->>server: POST [https://studies.cs.helsinki.fi/exampleapp/new_note_spa](https://studies.cs.helsinki.fi/exampleapp/new_note_spa)
    activate server
    Note over server: Server receives the note JSON data and updates the array
    server-->>browser: HTTP Status 201 (Created)
    deactivate server

    Note right of browser: The browser receives the confirmation. No page redirect or full reload occurs!
