<h1 align="center">
  Cloud-Based Movie Management Platform
</h1>

<p align="center">
  A serverless movie streaming and management platform built entirely on AWS, with role-based access for admins (film catalog management) and clients (browsing, favourites, ratings, and notifications).
</p>

<div align="center">

![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900)
![API Gateway](https://img.shields.io/badge/AWS-API%20Gateway-FF4F8B)
![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-4053D6)
![S3](https://img.shields.io/badge/AWS-S3-569A31)
![Cognito](https://img.shields.io/badge/AWS-Cognito-DD344C)
![Serverless Framework](https://img.shields.io/badge/Serverless%20Framework-FD5750)
![Angular](https://img.shields.io/badge/Angular-19-DD0031)
![Python](https://img.shields.io/badge/Python-3.8-blue)

</div>

## About the Project

This project is a cloud-native platform for uploading, browsing, and managing a film catalog, built with a fully serverless AWS backend and an Angular frontend. It supports two separate user roles — **admins**, who manage the film catalog (upload, update, delete films and video files), and **clients**, who browse films, mark favourites, leave ratings, and receive notifications.

The backend is defined entirely as Infrastructure as Code using the Serverless Framework, provisioning AWS Lambda functions, API Gateway routes, DynamoDB tables, an S3 bucket for video storage, and separate Amazon Cognito user pools for admins and clients.

## Features

- Separate admin and client authentication via two independent Amazon Cognito user pools, with role-based route authorization

- Film catalog management — create, update, delete, and list films, including filtering/search

- Video file upload, download, update, and deletion, stored in an S3 bucket

- Favourites management for clients — add, list, and remove favourite films

- Film ratings system with an atomic counter table for generating sequential IDs

- Real-time notifications for clients, backed by a dedicated notifications table

- Custom Lambda authorizer that validates JWT tokens issued by Cognito against both the admin and client user pools

- Interactive Angular frontend with dedicated views for authentication, film browsing, film details, favourites, and admin film management

## Architecture

The backend follows a serverless, function-per-endpoint architecture:

- **API Gateway (HTTP API)** — routes incoming requests to the corresponding Lambda function, with `adminAuthorizer` / `clientAuthorizer` custom authorizers protecting restricted routes.
- **AWS Lambda (Python 3.8)** — one function per operation (e.g. `createFilms`, `updateFilm`, `deleteFilm`, `uploadFile`, `createFavourites`, `createRatings`, `getNotifications`, etc.).
- **Amazon DynamoDB** — stores films, favourites, ratings, notifications, and a counter table used to generate sequential numeric IDs.
- **Amazon S3** — stores the actual video files uploaded by admins.
- **Amazon Cognito** — two separate user pools (`ClientPool`, `AdminPool`), each with its own app client, used for authentication and issuing JWT tokens.
- **Amazon SES / SNS** — configured for email and notification delivery.

## Technologies

**Backend:** Python 3.8, AWS Lambda, Amazon API Gateway (HTTP API), Serverless Framework

**Data & Storage:** Amazon DynamoDB, Amazon S3

**Authentication:** Amazon Cognito (separate admin and client user pools), custom Lambda authorizer, JWT

**Messaging:** Amazon SES, Amazon SNS

**Frontend:** Angular 19, TypeScript, Axios

## Project Structure

```
📦 cloud-main
 ┣ 📂 cloud-back   — Serverless Framework project (Lambda functions, serverless.yml, IAM roles)
 ┃ ┣ 📂 login / register / authorizer   — authentication & authorization
 ┃ ┣ 📂 createFilms / updateFilm / deleteFilm / getFilms / getFilm / getFilteredFilms   — film catalog
 ┃ ┣ 📂 uploadFile / updateFile / downloadFile / deleteFile   — video file management (S3)
 ┃ ┣ 📂 createFavourites / getFavourites / deleteFavourites   — favourites
 ┃ ┣ 📂 createRatings / getRatings   — ratings
 ┃ ┣ 📂 getNotifications   — client notifications
 ┃ ┗ 📂 utility   — shared helper functions
 ┗ 📂 cloud-front  — Angular application
   ┣ 📂 auth        — login and registration
   ┣ 📂 films       — film listing, details, create/update views
   ┣ 📂 favourites  — favourites listing and management
   ┗ 📂 navbar       — navigation
```

## Running the Project

### Prerequisites

- Python 3.8
- Node.js
- An AWS account with configured credentials (`aws configure`)
- Serverless Framework CLI (`npm install -g serverless`)

### Backend

```bash
cd cloud-back
pip install -r requirements.txt
serverless deploy
```

This provisions all AWS resources defined in `serverless.yml` — Lambda functions, API Gateway routes, DynamoDB tables, the S3 bucket, and the Cognito user pools.

### Frontend

```bash
cd cloud-front
npm install
npm start
```

The application will be available at `http://localhost:4200`, communicating with the deployed API Gateway endpoint.

## Author

Andrija Slović, 2024.
