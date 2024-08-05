# El Professor

El Professor is a web-based application designed to manage university lessons, students, and professors efficiently. The application provides functionalities for scheduling classes, managing student debts, and tracking payments.
Table of Contents

    Features
    Tech Stack
    Installation
    Usage
    API Endpoints
    Contributing
    License

# Features

    User Authentication: Secure login and logout functionalities for the admin.
    Dashboard: Overview of total lessons, hours taught, student count, revenue goals, and unpaid debts.
    Student Management: Add, edit, view, and delete student information.
    Professor Management: Manage professor information.
    Class Scheduling: Schedule, edit, and view university classes.
    Payment Tracking: Track student payments and manage their debts.
    Responsive Design: Accessible on both desktop and mobile devices.

# Tech Stack

    Frontend:
        React.js
        React Router
        Axios
        Bootstrap
    Backend:
        Node.js
        Express.js
        MongoDB (Mongoose)
    Others:
        Chart.js for data visualization
        CSS for styling

# Installation
Prerequisites

    Node.js and npm installed on your local machine
    MongoDB installed and running

# Steps

    Clone the repository:

    bash

```git clone https://github.com/your-username/el-professor.git```
```cd el-professor```

# Install backend dependencies:

bash

```cd backend```
```npm install```

# Install frontend dependencies:

bash

```cd ../frontend ```
``` npm install ```

# Set up environment variables:
Create a .env file in the backend directory and add the following:

env

```MONGO_URI=mongodb://localhost:27017/el-professor```
```PORT=5000```

# Run the backend server:

bash

```cd backend```
```node index.js```

# Run the frontend development server:

bash

    cd ../frontend
    npm start

Usage

    Login: Access the application via http://localhost:3000 and log in using admin credentials.
    Dashboard: View the dashboard for an overview of lessons, hours, student count, and financial goals.
    Manage Students: Navigate to the Students page to add, edit, or delete student information. Track and update student payments.
    Manage Professors: Navigate to the Professors page to manage professor information.
    Schedule Classes: Use the Calendar page to schedule new classes and manage existing ones.

API Endpoints
Authentication

    POST /api/auth/login: Login a user.
    POST /api/auth/logout: Logout a user.

Students

    GET /api/students: Get all students.
    POST /api/students: Create a new student.
    PUT /api/students/:id: Update student information.
    DELETE /api/students/:id: Delete a student.

Professors

    GET /api/professors: Get all professors.
    POST /api/professors: Create a new professor.
    PUT /api/professors/:id: Update professor information.
    DELETE /api/professors/:id: Delete a professor.

Classes

    GET /api/classes: Get all classes.
    POST /api/classes: Create a new class.
    PUT /api/classes/:id: Update class information.
    DELETE /api/classes/:id: Delete a class.

Contributing

    Fork the repository.
    Create a new branch:

    bash

git checkout -b feature-name

Make your changes and commit them:

bash

git commit -m 'Add feature'

Push to the branch:

bash

    git push origin feature-name

    Create a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.
