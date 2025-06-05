# TECHNICAL REPOSITORY MONITOR

## Project Description

Tecrep Monitor aims to provide users with a comprehensive tool for efficiently managing user phone lines and services, using technologies such as React, Redux, and Material-UI.

## System Requirements

- Node.js (v14.16)
- npm (v9.7.2)

## Artifactory Setup
To be able to fetch the needed dependencies from Jfrog Artifactory, you wanna make sure you follow each of the steps bellow:

1. Make sure you have a Jfrog account, contact your team for that.
2. Make sure you are authorized to fetch the needed dependencies, contact your team for that.
3. Connect with your account credentials to [Jfrog Artifactory](https://jfrog-artifactory.tools.it-factory.prod.lan), if the link is not working ask your team for the new link.
4. In the home page, you'll find a `Set Me Up` section, then search for `npm`, and click it!
5. A popup will show up with the necessary instructions, following the `General` section should be enough to make you able to fetch the dependencies. We use **basic authentication** to authenticate our npm client against the artifactory. 

## Installation

Follow these steps to set up and run Tecrep Monitor on your local environment:

1. Clone the repository:

   ```bash
   git clone <repository-url>

2. Navigate to the project directory:

   ```bash
   cd tecrep-monitor

3. Install dependencies:

   ```bash
   npm install

4. Launch the application:

   ```bash
   npm start

The application will be accessible at http://localhost:3000 using the configuration provided in webpack.config.dev.js.

## Additional Configuration

### Updating mt-react-library

If you need to update the "mt-react-library" library, follow these steps:

1. Remove the corresponding entry from package.json.


2. Unpack the npm package content into the ./local_modules/mt-react-library-<version> directory.


3. Install the new version of the library with the following command:

   ```bash
    npm install --save local_modules/mt-react-library-<version>

#### Additional Resources

https://sonarqube.steelhome.internal/dashboard?id=tecrep-monitor
https://confluence.itsf.io/display/ION/UI+-+Tecrep+monitor

## Project Components

Tecrep Monitor uses various components to build its user interface. Find a list below with the key components used in the project:

### CustomSelect Component

The `CustomSelect` component is a reusable React component designed for handling custom select input fields. It provides a dropdown select interface with options that can be customized. This component is commonly used for selecting various options or values within the application.

#### Props

- `field` (object, required): Represents the configuration for the select field. Field object should have the following format `{ id: string, label: string, values: string }`.


- `defaultValue` (string): Specifies the default value for the select field. It can be a string or boolean value.

- `onChange` (function, required): A callback function that gets called when the selected value changes. It receives an event object with the `id` and `value` properties.

#### Usage

To use the `CustomSelect` component, simply import it and include it in your React application. You need to provide the necessary props, such as `field`, `defaultValue`, and `onChange`, to customize its behavior according to your requirements.

#### Example

```javascript
import React from 'react';
import CustomSelect from './CustomSelect';

function MyComponent() {
    const handleSelectChange = (event) => {
        // Handle the selected value change here
      console.log(event.target.id, event.target.value);
    };
    
    const fieldConfig = {
        id: 'mySelectField',
      label: 'Select an Option',
      values: [
          { id: 'option1', key: 'Option 1', value: 'value1' },
        { id: 'option2', key: 'Option 2', value: 'value2' },
        // Add more options as needed
      ],
    };
    
    return (
        <div>
          <CustomSelect
            field={fieldConfig}
            defaultValue="value1"
            onChange={handleSelectChange}
          />
        </div>
    );
}

export default MyComponent;
```


## FormDialog Component

The `FormDialog` component is a reusable React component designed to display a modal dialog. It provides a customizable dialog that can be triggered by a user action, such as a button click. The dialog contains form fields, including custom selects and input fields.

### Props

- `title` (string, required): Specifies the title of the dialog.

- `headers` (array, required): An array of configuration objects for form fields, including properties like `label`, `id`, `type`, and `values`.

- `confirmProps` (object, required): Configuration for the confirmation button, including `icon` and `label`.

- `cancelProps` (object, required): Configuration for the cancel button, including `icon` and `label`.

- `onSubmit` (function): A callback function that gets called when the form is submitted. It receives the final form values as an argument.

- `children` (node): The content that triggers the dialog when clicked.

- `initialValues` (array): An array of initial values for form fields. Useful for pre-filling the form.

- `predefinedValues` (object): An object containing predefined values for form fields.

- `showAllOption` (bool): Determines whether to show an "All" option in select fields. Defaults to `true`.

### Usage

To use the `FormDialog` component, import it and include it in your React application. You need to provide the necessary props to customize its behavior according to your requirements.

### Example

```javascript
import React from 'react';
import FormDialog from './FormDialog';

function MyComponent() {
  const handleFormSubmit = (values) => {
    // Handle form submission here
    console.log('Form submitted with values:', values);
  };

  const formHeaders = [
    {
      id: 'name',
      label: 'Name',
      type: 'string',
    },
    {
      id: 'category',
      label: 'Category',
      type: 'enum',
      values: [
        { id: 'option1', key: 'Option 1', value: 'value1' },
        { id: 'option2', key: 'Option 2', value: 'value2' },
      ],
    },
  ];

  const confirmButtonProps = {
    icon: 'check',
    label: 'Confirm',
  };

  const cancelButtonProps = {
    icon: 'cancel',
    label: 'Cancel',
  };

  return (
    <div>
      <FormDialog
        title="Edit Item"
        headers={formHeaders}
        confirmProps={confirmButtonProps}
        cancelProps={cancelButtonProps}
        onSubmit={handleFormSubmit}
        initialValues={[{ name: 'Example Item', category: 'value1' }]}
      >
        <button>Edit Item</button>
      </FormDialog>
    </div>
  );
}
export default MyComponent;
```
## IconButton Component

The `IconButton` component is a React component that represents a button with an associated icon and optional text. It is commonly used to create buttons with icons that provide a visual cue for user actions.

### Props

- `icon` (object, required): The icon to be displayed on the button. This can be any React element representing an icon, such as an SVG or an icon component.

- `text` (string): Optional text that can be displayed alongside the icon as a tooltip or label.

### Usage

To use the `IconButton` component, import it and include it in your React application. Provide the `icon` and, optionally, the `text` props to customize the appearance and behavior of the button.

### Example

```javascript
import React from 'react';
import IconButton from './IconButton';
import { Heart } from '@material-ui/icons';

function LikeButton() {
  const handleLikeClick = () => {
    console.log('Like');
  };

  return (
    <IconButton
      icon={<Heart/>}
      text="Like" 
      onClick={handleLikeClick}
    />
  );
}

export default LikeButton;
```

## IconLabelButton Component

The `IconLabelButton` component is a React component that represents a button with an associated icon and label text. It is commonly used to create buttons with both icons and text for user interactions.

### Props

- `label` (string, required): The text label to be displayed on the button.

- `icon` (node): An optional icon to be displayed alongside the label. This can be any React element representing an icon, such as an SVG or an icon component.

- `onClick` (function, required): A callback function that gets called when the button is clicked.

### Usage

To use the `IconLabelButton` component, import it and include it in your React application. Provide the `label`, optionally the `icon`, and the `onClick` props to customize the appearance and behavior of the button.

### Example

```javascript
import React from 'react';
import IconLabelButton from './IconLabelButton'; 
import { Add } from '@material-ui/icons';

function AddButton() {
  const handleFormSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <IconLabelButton
      label="t('Add)" 
      icon={<Add/>} 
      onClick={handleFormSubmit}
    />
  );
}
export default AddButton;
```
## IconModalButton Component

The `IconModalButton` component is a React component that represents a button with an associated icon, a tooltip, and the ability to trigger a modal dialog when clicked. It is commonly used to create buttons that reveal additional content or actions in a modal dialog.

### Props

- `icon` (object): The icon to be displayed on the button. This can be any React element representing an icon, such as an SVG or an icon component.

- `tooltipText` (string): The text to be displayed in the tooltip when the user hovers over the button.

- `children` (node): The content to be displayed inside the modal dialog when it is opened.

### Usage

To use the `IconModalButton` component, import it and include it in your React application. Provide the `icon`, `tooltipText`, and optionally the `children` prop to customize the appearance and behavior of the button and the content of the modal dialog.

### Example

```javascript
import React from 'react';
import IconModalButton from './IconModalButton';
import { Assignment } from '@material-ui/icons';

function App() {
  const detailedObject = {
    name: 'Example Object',
    description: 'This is an example object to display detailed information.',
    dateCreated: 'October 22, 2023',
  };

  return (
    <div>
      <IconModalButton
        icon={<Assignment/>}
        tooltipText="View Details"
      >
        <div>
          <h2>Object Details</h2>
          <p><strong>Name:</strong> {detailedObject.name}</p>
          <p><strong>Description:</strong> {detailedObject.description}</p>
          <p><strong>Date Created:</strong> {detailedObject.dateCreated}</p>
        </div>
      </IconModalButton>
    </div>
  );
}

export default App;
```

## InfoGrid Component

The `InfoGrid` component is a React component designed for displaying structured information in a grid format. It is commonly used to show key information details in a visually organized manner.

### Props

- `title` (string, required): The title or heading for the information grid.

- `navigation` (string): An optional string used for navigation or as an additional description.

- `headers` (array, required): An array of configuration objects for the information grid's headers, including properties like `id` and `label`.

- `values` (object, required): An object containing the values corresponding to the headers. The keys in the `values` object should match the `id` properties in the `headers` array.

### Usage

To use the `InfoGrid` component, import it and include it in your React application. Provide the necessary `title`, `navigation`, `headers`, and `values` props to customize the content and structure of the information grid.

### Example

```javascript
import React from 'react';
import InfoGrid from './InfoGrid';

function App() {
  const gridConfig = {
    title: 'User Information',
    navigation: 'Home / Users / Details',
    headers: [
      { id: 'name', label: 'Name' },
      { id: 'email', label: 'Email Address' },
      { id: 'age', label: 'Age' },
      // Add more headers as needed
    ],
    values: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      age: 30,
      // Provide values corresponding to the headers
    },
  };

  return (
    <InfoGrid
      title={gridConfig.title}
      navigation={gridConfig.navigation}
      headers={gridConfig.headers}
      values={gridConfig.values}
    />
  );
}

export default App;
```

## TypeField Component

The `TypeField` component is a reusable React component designed for handling text input fields. It provides a customizable text input element along with a label.

### Props

- `defaultValue` (string): An optional default value to pre-fill the input field.

- `field` (object, required): Represents the configuration for the input field, including properties like `id` and `label`.

- `onChange` (function, required): A callback function that gets called when the input value changes. It receives an event object with the `id` and `value` properties.

### Usage

To use the `TypeField` component, import it and include it in your React application. Provide the necessary props, such as `defaultValue`, `field`, and `onChange`, to customize its behavior according to your requirements.

### Example

```javascript
import React, { useState } from 'react';
import TypeField from './TypeField';

function UserProfile() {
  const [profile, setProfile] = useState({
    name: 'Jean LETHIEC',
    email: 'j.lethiec@example.com',
  });

  const handleProfileChange = (event) => {
    const { id, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  return (
    <div>
      <TypeField
        defaultValue={profile.name}
        field={{ id: 'name', label: 'Name' }}
        onChange={handleProfileChange}
      />
      <TypeField
        defaultValue={profile.email}
        field={{ id: 'email', label: 'Email' }}
        onChange={handleProfileChange}
      />
    </div>
  );
}

export default UserProfile;
```
## TableFrame Component

The `TableFrame` component is a React component designed for creating a frame for tables or content that includes a title, navigation, and optional back button. It is commonly used for organizing and displaying tabular data or content.

### Props

- `title` (string): The title or heading for the table frame.

- `navigation` (string): An optional string used for navigation or as additional information.

- `backButton` (boolean): A boolean flag to determine whether to display a "Go Back" button. Defaults to `false`.

- `children` (element): The content to be displayed within the table frame.

- `actionButton` (element): An optional action button to be displayed in the header of the table frame.

- `importable` (boolean): A boolean flag to determine whether to display an import dropdown menu. Defaults to `true`.

### Usage

To use the `TableFrame` component, import it and include it in your React application. Provide the necessary props, such as `title`, `navigation`, `backButton`, `children`, `actionButton`, and `importable`, to customize the appearance and behavior of the table frame.

### Example

```javascript
import React from 'react';
import TableFrame from './TableFrame';

function App() {
  return (
    <div>
      <TableFrame
        title="User List"
        navigation="Home / Users"
        backButton={true}
        importable={true}
        actionButton={<button>Add User</button>}
      >
        {/* Your table content or other elements */}
      </TableFrame>
    </div>
  );
}

export default App;
```

## Table Component

The `Table` component is a versatile React component designed for displaying tabular data.

### Props

- `headers` (array, required): An array of header configurations that define the columns in the table.

- `rows` (array, required): An array of data rows to be displayed in the table.

- `defaultFilter` (object): An optional object representing default filter values for the table.

- `defaultPagination` (object): An optional object representing default pagination settings for the table.

- `onPageChange` (function): A callback function that gets called when the page changes. It receives an object with `size` (rows per page) and `page` (current page) properties.

- `onFilterChange` (function): A callback function that gets called when the filter criteria change. It receives the updated filter criteria.

- `isFilterable` (boolean): A boolean flag to enable or disable filtering. Defaults to `false`.

- `isControlled` (boolean): A boolean flag to indicate whether the component is controlled externally. Defaults to `false`.

- `children` (node): The content to be displayed within each row of the table.

- `onParentClick` (function): A callback function that gets called when the user clicks on a row. It receives an event and the clicked row data.

- `newRowConfig` (object): Configuration for adding a new row to the table. Includes `title`, `headers`, and `onSubmit`.

- `rowsNumber` (number): The total number of rows in the table. Useful for pagination.

- `resetFilter` (function): A function to reset the filter criteria.

- `predefinedValues` (object): An object containing predefined values for form fields.

- `showAddButton` (boolean): A boolean flag to show or hide the "Add" button. Defaults to `true`.

- `AddActionButton` (node): A custom component to use as the "Add" button.

### Usage

To use the `Table` component, import it and include it in your React application. Provide the necessary props, such as `headers`, `rows`, `defaultFilter`, `defaultPagination`, `onPageChange`, `onFilterChange`, and others, to customize the behavior and appearance of the table.

### Example

```javascript
import React from 'react';
import Table from './Table'; // Make sure to import the Table component

function App() {
  const headers = [
    { id: 'name', label: 'Name', filterable: true },
    { id: 'age', label: 'Age', filterable: true },
    { id: 'email', label: 'Email', filterable: true },
  ];

  const rows = [
    { name: 'Mohamed CHENOUF', age: 30, email: 'm.chenouf@example.com' },
    { name: 'Gianfranco FANTAPPIE', age: 25, email: 'g.fantappie@example.com' },
    // Add more rows as needed
  ];

  return (
    <div>
      <Table
        headers={headers}
        rows={rows}
        isFilterable={true}
        isPageable={true}
        showAddButton={true}
      >
        {/* Your custom content for each row */}
      </Table>
    </div>
  );
}

export default App;
```

## DefaultTable Component

The `DefaultTable` component is a flexible React component designed for displaying and managing tabular data. It provides features such as filtering, pagination, and actions like viewing details, editing, and deleting records.

### Props

- `columnHeader` (array): An array of header configurations that define the columns in the table.

- `entity` (string): The name of the entity being displayed in the table.

- `detailLink` (string): The link to the detail view of a record. If provided, a "View Details" button will be shown for each row.

- `showDetailsButton` (boolean): A boolean flag to enable or disable the "View Details" button. Defaults to `false`.

- `showEditButton` (boolean): A boolean flag to enable or disable the "Edit" button. Defaults to `false`.

- `showDeleteButton` (boolean): A boolean flag to enable or disable the "Delete" button. Defaults to `false`.

- `isFilterable` (boolean): A boolean flag to enable or disable filtering. Defaults to `true`.

- `predefinedValues` (object): An object containing predefined values for the specified entity. It can be useful when we don't want to retrieve all the default rows of an entity but only the rows that meet a certain property.

- `controlled` (boolean): A boolean flag to indicate whether the table should count with pagination. Defaults to `true`.

- `showAddButton` (boolean): A boolean flag to show or hide the "Add" button. Defaults to `true`.

- `overrideRows` (array): An array of rows to override the default rows. Useful when we have a page with multiple tables and want to manage API calls from the top-level component.

- `hasRerendered` (function): A callback function that gets called when the table is re-rendered. Useful when working with tables that receive their data from a parent component and need to know if any action has been performed.

- `AddActionButton` (node): A custom component to use as the "Add" button.

### Usage

To use the `DefaultTable` component, import it and include it in your React application. Provide the necessary props, such as `columnHeader`, `entity`, and others, to customize the behavior and appearance of the table. You can enable or disable specific buttons and actions as needed.

### Example

```javascript
import React from 'react';
import DefaultTable from './DefaultTable'; // Make sure to import the DefaultTable component

function App() {
  const columnHeader = [
    { id: 'name', label: 'Name', filterable: true },
    { id: 'age', label: 'Age', filterable: true },
    { id: 'email', label: 'Email', filterable: true },
  ];

  return (
    <div>
      <DefaultTable
        columnHeader={columnHeader}
        entity="Users"
        showDetailsButton={true}
        showEditButton={true}
        showDeleteButton={true}
        isFilterable={true}
        showAddButton={true}
      />
    </div>
  );
}

export default App;
```
## Custom Hooks

The Tecrep Monitor application uses custom React hooks to manage specific functionalities. These custom hooks help organize and reuse code logic across different components. Below are some of the custom hooks used in the project:

### useTranslation Hook

The `useTranslation` hook is a custom hook that provides internationalization (i18n) and localization (l10n) support for the application. It allows components to easily access translated strings and switch between different language locales using the `react-intl` library.

#### Usage

To use the `useTranslation` hook, import it into your component and call it to access translation functions. For example:

```javascript
import React from 'react';
import { useTranslation } from './hooks/useTranslation';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome_message')}</h1>
      <p>Current Language: {i18n}</p>
      <button onClick={() => setLocale('en')}>Switch to English</button>
      <button onClick={() => setLocale('fr')}>Switch to French</button>
    </div>
  );
}

export default MyComponent;
```


### useTableActions Hook

The `useTableActions` hook is a custom hook designed for managing data tables efficiently. It simplifies common tasks such as data fetching, filtering, pagination, and CRUD (Create, Read, Update, Delete) operations for tables.

#### Usage

To use the `useTableActions` hook, import it into your component and call it to access data and actions for your data table. For example:

```javascript
import React from 'react';
import { useTableActions } from './hooks/useTableActions';

function UsersTable() {
  const {
    rows,
    filter,
    addItem,
    deleteItem,
    updateItem,
    handleFilter,
    defaultPagination,
    handlePagination,
    rowsNumber,
    resetFilter,
    error,
    resetError,
    loading,
  } = useTableActions('users', predefinedValues, controlled, overrideRows, hasRerendered);

  // Use the retrieved data and actions in your table component
  // ...

  return (
    <div>
      {/* Your table component */}
    </div>
  );
}

export default UsersTable;
```

The `useTableActions` hook provides a set of functions to manage your data table:

- `rows`: An array of data rows to display in the table.
- `filter`: The current filter settings applied to the table.
- `addItem`: Function to add a new item to the table.
- `deleteItem`: Function to delete an item from the table.
- `updateItem`: Function to update an item in the table.
- `handleFilter`: Function to apply filtering to the table.
- `defaultPagination`: The default pagination settings for the table.
- `handlePagination`: Function to handle pagination changes.
- `rowsNumber`: The total number of rows in the table.
- `resetFilter`: Function to reset the table filter.
- `error`: An error message, if any, related to table actions.
- `resetError`: Function to reset the error message.
- `loading`: Indicates whether data is currently being fetched or updated.

These functions simplify the management of data tables within your application and provide a consistent interface for common table operations.

Furthermore, this custom hook enhances the maintainability and reusability of your data table components in the TECREP MONITOR application.

### Stepper Context and Hook
The StepperContext and useStepper hook are designed to streamline the management of a stepper component's state in your React application.

### Usage
To utilize the StepperContext and useStepper hook, follow these steps:

1. Import the necessary components and hook:
```javascript
import React from 'react';
import { StepperProvider, useStepper } from './Stepper'; // Replace './Stepper' with the correct path
````
2. Wrap your component or application with the StepperProvider. This enables your components to access the stepper context and its functionality. For instance:
```javascript
function App() {
  return (
    <StepperProvider>
      {/* Your application components */}
    </StepperProvider>
  );
}
```
3. Inside your component, you can access the stepper context and its functions using the useStepper hook:

```javascript
function YourComponent() {
  const {
    open,
    page,
    width,
    setWidth,
    error,
    setError,
    handleClose,
    handleOpen,
    nextPage,
    previousPage,
  } = useStepper();

  // Use the context and functions as needed in your component
  // ...
}
```

Functions and Values
The ``StepperProvider`` and ``useStepper`` hook provide the following functions and values for managing the stepper component:

- ``open``: A boolean indicating whether the dialog is open or closed.
- ``page``: The current page number in the stepper.
- ``width``: The width setting for the stepper.
- ``setWidth``: Function to set the stepper's width.
- ``error``: An error message related to stepper actions, if any.
- ``setError``: Function to set an error message.
- ``handleClose``: Function to close the dialog and reset its state.
- ``handleOpen``: Function to open the dialog.
- ``nextPage``: Function to navigate to the next page.
- ``previousPage``: Function to navigate to the previous page.

These functions simplify the management of your stepper component, providing a consistent interface for common stepper operations. By using the ``StepperContext`` and ``useStepper`` hook, you can enhance the maintainability and reusability of your stepper components in your application.
## Keycloak Permissions Setup
To control access to each menu item you can define dedicated permissions and map them to Keycloak roles. Below is an example of four permissions:

- `NUMBER_READ` – access to the **Numbers** section
- `NUMBER_RANGE_READ` – access to the **Range Numbers** section
- `IP_ADDRESS_READ` – access to the **IP Addresses** section
- `RESOURCE_CONF_READ` – access to the **Resources Admin** section

In Keycloak create one role per permission (for instance `NUMBERS_VIEWER`, `RANGE_VIEWER`, and so on) and assign the corresponding permission scope to the role. A user that has all four roles will be able to navigate to all pages.
