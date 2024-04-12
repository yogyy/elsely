# Elysia + Kysely

This project combines Elysia with Kysely for building a web application with a PostgreSQL database backend.

## Getting Started

### Prerequisites

Before starting the project, ensure you have the following installed on your machine:

- Bun
- PostgreSQL

### Setup

#### 1. Clone the Repository

```sh
git clone https://github.com/yogyy/elsely.git elsely
```

#### 2. Install Dependencies

```sh
cd elsely
bun install
```

#### 3. Create Database Table

Execute the following SQL commands to create the necessary table in your PostgreSQL database:

```sql
CREATE TYPE UserType AS ENUM ('user', 'developer', 'verified');

CREATE TABLE ely_userr(
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role "UserType" NOT NULL DEFAULT 'user'::"UserType",
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON ely_user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

CREATE TABLE "ely_post" (
    id VARCHAR(50) PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    author_id VARCHAR REFERENCES "ely_user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON ely_post
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();
```

#### 4. Create .env File

Copy the sample .env file and update it with your database connection details:

```sh
cp .env.sample .env
```

#### 5. Generate Database Types

Run the following command to generate TypeScript types for your database:

```sh
bun run db:type
```

#### 6. Run Tests

Execute the following command to run the tests:

```sh
bun run test
```

Now you're ready to start developing your Elysia + Kysely project!
