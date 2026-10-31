
# Fusio Form

This repository contains the Fusio Form app, a small Angular app which renders forms configured at your
[Fusio](https://www.fusio-project.org) instance. Fusio is an open source API management platform which allows you to
build and manage APIs.

Most API operations are called by machines, but sometimes you need data that a human enters by hand, i.e. a support
request, a feedback message, an order correction or the data of a new customer. Instead of building a custom frontend
for each of these cases, you configure a form at the Fusio backend, and the consumers of your API can use this app to
fill in the form and submit the data directly to your API operation.

## Features

* Lists all forms of your Fusio instance
* Renders a form automatically from the JSON Schema of the operation's request body
* Optional UI Schema to control the layout of a form, i.e. groups, columns or tabs
* Bootstrap based controls for text, numbers, booleans, enums, dates, nested objects and arrays
* Client side validation against the JSON Schema before submitting the data
* Login, registration and password reset for your users
* Account area where users can manage their account

## How it works

The following diagram shows the flow from configuring a form to submitting data:

```
 Fusio Backend (admin)                Fusio Form app (consumer)               Your API
 ─────────────────────                ─────────────────────────               ────────
 1. Create a schema
 2. Create an operation
    using the schema as
    incoming payload
 3. Create a form which    ───────►  4. User logs in and selects
    references the                      the form from the list
    operation
                                     5. The app renders the form
                                        based on the JSON Schema
                                        (and optional UI Schema)
                                     6. User fills in and submits  ───────►  7. The operation receives
                                        the form                                the data and executes
                                                                                its action
```

### 1. Create a schema

Create a [schema](https://docs.fusio-project.org/docs/backend/api/schema) which describes the data that the user
should enter. Every property of the schema becomes a field of the form, i.e. a `string` property is rendered as text
input, an `integer` as number input, a `boolean` as checkbox and an `array` as a list where the user can add and remove
entries. Required properties are marked with an asterisk.

You can use the following schema features to improve the form:

| Schema feature                              | Result in the form                                       |
|---------------------------------------------|----------------------------------------------------------|
| `description`                               | Help text below the field                                |
| `enum`                                      | Select box with the provided values                      |
| `format: date`, `date-time`, `time`         | Date and time picker                                     |
| `format: email`, `uri`                      | Email and URL input                                      |
| `minimum`, `maximum`, `maxLength`           | Input restrictions and validation                        |
| Nested objects and references               | Grouped fields                                           |

### 2. Create an operation

Create an [operation](https://docs.fusio-project.org/docs/backend/api/operation) which receives the data, i.e. a
`POST /messages` operation. Use the schema from the previous step as incoming payload and assign an action which
handles the data, i.e. an action which inserts the data into a database table or sends a mail.

Users of the form app are authenticated, so the user needs access to the operation. Either make the operation public
or assign its scope to the role of your users.

### 3. Create a form

At the Fusio backend, go to **Form** and create a new form:

| Field     | Description                                                                                |
|-----------|--------------------------------------------------------------------------------------------|
| Name      | The name of the form, which is shown to the user in the list of forms                      |
| Operation | The operation which receives the submitted data                                            |
| UI Schema | Optional a [UI Schema](https://jsonforms.io/docs/uischema) to customize the layout          |

Fusio provides the form to the app through the [Consumer API](https://www.fusio-project.org/api/consumer). Fusio adds
the JSON Schema of the operation's incoming payload, the URL and the HTTP method of the operation, so the app knows how
to render the form and where to send the data.

### 4. Use the form

Your users open the app, log in and see a list of all available forms. After selecting a form, the app renders the
fields, validates the input and sends the data to the configured operation.

## UI Schema

If you leave the UI Schema empty, the app generates a layout which shows all fields of the schema in a vertical list.
If you need more control, you can provide a [UI Schema](https://jsonforms.io/docs/uischema) at the form, i.e. to show
two fields next to each other and render the content as textarea:

```json
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "HorizontalLayout",
      "elements": [
        { "type": "Control", "scope": "#/properties/sender_id" },
        { "type": "Control", "scope": "#/properties/receiver_id" }
      ]
    },
    {
      "type": "Control",
      "scope": "#/properties/content",
      "options": { "multi": true }
    },
    {
      "type": "Group",
      "label": "Additional",
      "elements": [
        { "type": "Control", "scope": "#/properties/is_read" },
        { "type": "Control", "scope": "#/properties/tags" }
      ]
    }
  ]
}
```

The app supports the following UI Schema elements:

| Element            | Description                                                     |
|--------------------|-----------------------------------------------------------------|
| `VerticalLayout`   | Renders the elements below each other                           |
| `HorizontalLayout` | Renders the elements next to each other in columns              |
| `Group`            | Renders the elements in a box with a label                      |
| `Categorization`   | Renders every `Category` as a tab                               |
| `Label`            | Renders a static text                                           |
| `Control`          | Renders the field of the property referenced by `scope`         |

You can also use [rules](https://jsonforms.io/docs/uischema/rules) to show, hide or disable elements based on the
values of other fields.

## Installation

### Marketplace

The easiest way is to install the app through the marketplace of your Fusio backend, or through the CLI:

```
php bin/fusio marketplace:install app form
```

The app is then available under the `/apps/form/` path of your Fusio instance, i.e. `https://api.acme.com/apps/form/`.

### Docker

You can also run the app as standalone container, i.e. on a different domain than your Fusio instance:

```yaml
services:
  form:
    image: fusio/apps-form
    environment:
      API_URL: "https://api.acme.com"
    ports:
      - "8080:80"
```

| Variable  | Description                                                              |
|-----------|--------------------------------------------------------------------------|
| `API_URL` | The base URL of your Fusio instance                                      |
| `APP_KEY` | Optional the app key of a Fusio app, which is needed for social login    |

## Development

To run the app locally, you need [Node.js](https://nodejs.org/) 22 or higher:

```
npm install
npm start
```

The app reads the URL of your Fusio instance from the `FUSIO_URL` variable at `src/index.html`. For local development,
replace the `${API_URL}` placeholder with the URL of your Fusio instance, i.e. `http://localhost:8080`.

To create a production build, run:

```
npm run build
```

The build is written to `dist/form/browser` and expects to be served under the `/apps/form/` path.

### Renderers

The forms are rendered with [JSON Forms](https://jsonforms.io/) and a custom set of Bootstrap renderers, which you can
find at `src/app/form/renderer`. Every renderer has a tester which decides for which part of the schema the renderer is
used. To support a new type of field, add a renderer and register it at `src/app/form/renderer/index.ts`.

## Customizing

The app is built with Angular and the [Fusio Angular SDK](https://github.com/apioo/fusio-sdk-javascript-angular). You
can fork this repository to adjust the design to your corporate identity or to integrate the forms into your existing
Angular app. If you use a different framework, you can use the [Consumer API](https://www.fusio-project.org/api/consumer)
of Fusio to build your own form renderer.

## License

This project is licensed under the MIT License, see the [LICENSE](./LICENSE) file.
