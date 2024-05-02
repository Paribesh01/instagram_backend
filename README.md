# Instagram Backend API Documentation

## Introduction

This document outlines the API endpoints and functionalities of the Instagram backend built with NestJS.

## Authentication

The Instagram backend supports authentication using JWT (JSON Web Tokens). All authenticated routes require a valid JWT token to access.

### Authentication Endpoints

- **POST /auth/login**

  - Description: Authenticate user and generate JWT token.
  - Request Body:
    - `email`: User's email.
    - `password`: User's password.
  - Response: JWT token upon successful authentication.

- **POST /auth/register**

  - Description: Register a new user.
  - Request Body:
    - `email`: User's email.
    - `password`: User's password.
    - `name`:User's name
  - Response: Success message upon successful registration.

- **GET /auth/getProfile**
  - Description: Get user profile information.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: User profile information.

## User Management

These endpoints manage user-related functionalities such as profile management and following/unfollowing users.

- **GET /user/me**

  - Description: Get current user's profile.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Current user's profile information.

- **POST /user/prefence**

  - Description: Update user preferences.
  - Authorization Header: `Bearer <JWT Token>`
  - Request Body: User preference data.
  - Response: Success message upon successful update.

- **POST /user/:email/follow**

  - Description: Follow a user by email.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful follow.

- **POST /user/:email/unfollow**

  - Description: Unfollow a user by email.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful unfollow.

- **GET /user/:email/following**
  - Description: Get users followed by a specific user.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: List of users followed by the specified user.

## Post Management

These endpoints manage post-related functionalities such as creating, retrieving, updating, and deleting posts.

- **POST /post/create**

  - Description: Create a new post.
  - Authorization Header: `Bearer <JWT Token>`
  - Request Body: Post data.
  - Response: Success message upon successful post creation.

- **GET /post/allPost**

  - Description: Get all posts.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: List of all posts.

- **GET /post/:id**

  - Description: Get a specific post by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Details of the specified post.

- **PUT /post/updatePost/:id**

  - Description: Update a post by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Request Body: Updated post data.
  - Response: Success message upon successful update.

- **PUT /post/likePost/:id**

  - Description: Like a post by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful like.

- **PUT /post/removeLike/:id**

  - Description: Remove like from a post by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful removal of like.

- **DELETE /post/deletePost/:id**
  - Description: Delete a post by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful deletion.

## Comment Management

These endpoints manage comment-related functionalities such as posting, retrieving, updating, and deleting comments.

- **POST /comment/posComment/:postId**

  - Description: Post a comment on a specific post.
  - Authorization Header: `Bearer <JWT Token>`
  - Request Body: Comment data.
  - Response: Success message upon successful comment creation.

- **GET /comment/:id**

  - Description: Get a specific comment by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Details of the specified comment.

- **PATCH /comment/:id**

  - Description: Update a comment by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Request Body: Updated comment data.
  - Response: Success message upon successful update.

- **DELETE /comment/:id**

  - Description: Delete a comment by ID.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: Success message upon successful deletion.

- **GET /comment/post/:postId**
  - Description: Get all comments on a specific post.
  - Authorization Header: `Bearer <JWT Token>`
  - Response: List of comments on the specified post.
