# College Attendance Management Tool

This project is an open-source tool for managing a college's attendance. It can handle most types of requirements, such as a variety of classes.

## Technology Stack

- Frontend: Static vanilla HTML and CSS with occasional Tailwind
- Backend: Node.js with the Express framework

## Running the Application

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Backend Directory Structure

The backend directory contains the following structure:

```
├── backend
│   ├── apiEndPoints
│   │   ├── admin_api.js
│   │   ├── student_api.js
│   │   └── teacher_api.js
│   ├── auth
│   │   └── auth.js
│   ├── db-helpers
│   │   ├── const-local.js
│   │   └── main.js
│   ├── htmlHandlers
│   │   └── admin.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── utils
│       └── email.js
```

A file named `const-local.js` is expected to be in the `db-helpers` directory. 

```js
const host = '<your-host-key>';
const port = 8080; //add your port
const password = '<your password>';
const database = '<db name>';
const user = '<user_name>';
const ssl = false; //usually set true for cloud based
const emailKey = "<The email key from which the emails are sent>";
```

You must also excute the database/ddl.sql file onto your postgrese instance.

1. Navigate to the backend directory:
    ```sh
    cd backend/
    ```
2. Install the necessary dependencies:
    ```sh
    npm install
    ```
3. Start the application:
    ```sh
    node index.js
    ```
4. Create a new admin user, with the secret key '1234'