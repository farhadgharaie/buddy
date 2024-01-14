# buddy
Buddy is a social networking application with a modular and scalable architecture designed following the principles of Onion Architecture. The architecture promotes separation of concerns and modularity to ensure maintainability and extensibility.

## Architecture Overview

### 1. Core Domain

The core domain encapsulates entities and value objects that form the foundation of the application. Entities, such as User, embody the business logic, while value objects represent immutable, interchangeable components.

### 2. Domain Services

- **User Service:** Manages user-related business logic, including registration, profile management, and search functionalities.
- **Friend Service:** Handles operations related to friendships, invitations, and interactions between users.
- **Authentication Service:** Manages user authentication, authorization, and token generation.

### 3. Application Services

- **User Service:** Implements use cases for user registration, profile management, and search functionalities.
- **Friend Service:** Implements use cases for friend invitations, acceptances, and rejections.
- **Authentication Service:** Implements use cases for user login and token generation.

### 4. Infrastructure

- **User Repository (MongoDB):** Provides concrete implementations of repository interfaces to interact with the MongoDB database. Utilizes Mongoose for seamless integration with MongoDB features.
- **Dependency Injection (Future Enhancement):** Consideration for introducing a Dependency Injection framework to improve decoupling and facilitate better testability.

### 5. Interfaces

- **Controllers (Express.js):** Define HTTP endpoints for user, friend, and authentication operations.
- **Routes:** Map HTTP requests to appropriate application service methods.

### 6. Decoupling and SOLID Principles

- **Dependency Inversion Principle (DIP):** Achieved by having high-level modules (application services) depend on abstractions (interfaces), while low-level modules (repositories) implement these abstractions.
- **Single Responsibility Principle (SRP):** Each service is dedicated to a specific aspect of the application, promoting separation of concerns.

### 7. Future Improvements

- **Dependency Injection:** Consider incorporating a Dependency Injection framework to enhance the inversion of control and facilitate unit testing.

## Database

For the social medias, we can use range of databases to get much performances. Here, I used an unstructured database, mongodb, which is a good choice for storing social media data due to its flexibility and scalability. MongoDB is a NoSQL database that allows for the storage of unstructured or semi-structured data, making it suitable for applications with varying and evolving data structures, common in social media platforms.

### MongoDB Database
Key Features:

#### Flexible Schema: 
MongoDB's schema-less design accommodates dynamic and evolving data structures.Ideal for social media platforms where data formats may change frequently.

#### Scalability: 
MongoDB provides horizontal scalability, allowing the platform to handle increasing data loads by adding more servers. Suited for applications with growing user bases and data volume.

#### Document-Oriented:
Data is stored in BSON (Binary JSON) documents, resembling JSON objects.
Documents can contain nested arrays and subdocuments, facilitating complex data structures.
High Performance:

### Use Case:
The choice of MongoDB as the database for Buddy provides a robust and scalable foundation for managing user profiles, relationships, and various interactions within the social networking platform. The unstructured nature of the data allows for easy adaptation to changing requirements and user behaviors.

## Technologies Used
Here are some key technologies employed in the development:

### 1. TypeScript
Buddy is developed using TypeScript, a statically typed superset of JavaScript. TypeScript enhances code quality and maintainability by introducing static typing, interfaces, and other features, making it a suitable choice for large-scale applications.

### 2. Express.js
Express.js is used as the web application framework for Buddy. It simplifies the creation of APIs and handles various aspects of web application development, ensuring a streamlined and organized code structure.

### 3. Jest
Jest is the chosen testing framework for Buddy. It is a delightful JavaScript testing library that emphasizes simplicity while providing powerful testing capabilities. Jest ensures the reliability and correctness of the application through unit and integration tests.

### 4. Mongoose
Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js, is utilized for database interactions in Buddy. It simplifies the process of connecting to MongoDB and provides an elegant way to define schemas, models, and perform database operations.

### 5. Other Dependencies
Various other dependencies and tools are used to enhance the development workflow, manage dependencies, and ensure code quality. These are listed in the project's package.json file.

## Getting Started

### Installation

First, clone this repository:

git clone https://github.com/farhadgharaie/buddy.git
cd buddy

### Install dependencies
npm install

### Copy the example .env file
cp .env.example .env

### Initialize the database
npx prisma generate
npx prisma db push

### Run the app
npm run dev

### Access APIs on http://localhost:3000
call http://localhost:3000