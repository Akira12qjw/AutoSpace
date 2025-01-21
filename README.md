# Autospace Workshop

This is a project that helps users choose and rent garages on the map.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (>= 14.x)
- Yarn (>= 1.22.x)
- Docker
- Git

## Some images
### 1. Login and Register
![image](https://github.com/user-attachments/assets/652c9538-2416-428f-a69a-268364e40ca6)

![image](https://github.com/user-attachments/assets/15b1cd2a-e860-4ecb-8a35-db6620ad5156)

### 2. Home page
![image](https://github.com/user-attachments/assets/de53b732-ea9e-47c6-9169-e348ef047d4d)

### 3. List garage
![image](https://github.com/user-attachments/assets/6e0d5aa7-6ac5-4e3b-877c-f05fe8d7c052)

### 4. Add garage
![image](https://github.com/user-attachments/assets/aae9c200-edb4-4054-af58-b513d96bdd32)

### 5. Valet info
![image](https://github.com/user-attachments/assets/a61492e0-7350-4881-822a-c0a5498e0d57)

### 6. Vehicle pick-up and delivery interface (Valet)
![image](https://github.com/user-attachments/assets/b8908ac3-954f-4fe0-9dea-8dbc07693ff2)

### 7. Home page admin
![image](https://github.com/user-attachments/assets/db41587a-af1d-475f-8943-bd24b7862841)

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine using Git.

```bash
git clone https://github.com/Akira12qjw/Autospace.git
cd autospace-workshop
```

### 2. Install Dependencies

Install the project dependencies using Yarn.

```
yarn install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory and add the necessary environment variables. Refer to .env.example for the required variables.

### 4. Run the Database with Docker Compose

Start the PostgreSQL database using Docker Compose.

```
docker-compose up -d
```

### 5. Run Prisma Migrations

After the database is running, apply Prisma migrations to set up the database schema.

```
yarn prisma migrate dev
```

### 6. Run the Applications

You can run the individual applications using the following commands:

#### API Application

Navigate to the apps/api directory and start the API server.

```
cd apps/api
yarn dev
```

#### WEB Applications

Navigate to the apps/web directory and start the WEB server.

```
cd apps/web
yarn dev
```

License
This project is licensed under the MIT License.
