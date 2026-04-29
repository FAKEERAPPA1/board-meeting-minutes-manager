# 📋 Board Meeting Minutes Manager

> A Spring Boot + PostgreSQL backend for managing board meeting minutes with AI-assisted summaries and recommendations.

---

## 📁 Project Structure

```
Board Meeting Minutes Manager/
├── backend/                          # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/                 # Java source code
│   │       └── resources/
│   │           ├── application.yml   # App configuration
│   │           └── db/migration/
│   │               └── V1__init.sql  # Flyway migration
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml                # Docker orchestration
├── .env.example                      # Environment variable template
└── README.md
```

---

## ⚙️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Language    | Java 17                           |
| Framework   | Spring Boot 3.x                   |
| Database    | PostgreSQL 15                     |
| Migrations  | Flyway                            |
| ORM         | Spring Data JPA / Hibernate       |
| AI          | OpenAI API (GPT-4o)               |
| Containers  | Docker + Docker Compose           |

---

## 🗄️ Database Schema

**Table: `board_meeting_minutes`**

| Column               | Type          | Description                              |
|----------------------|---------------|------------------------------------------|
| `id`                 | BIGSERIAL     | Auto-increment primary key               |
| `title`              | VARCHAR(255)  | Meeting title (required)                 |
| `meeting_date`       | DATE          | Date of the meeting (required)           |
| `attendees`          | TEXT          | Comma-separated list of attendees        |
| `agenda`             | TEXT          | Meeting agenda                           |
| `minutes_text`       | TEXT          | Full meeting minutes (required)          |
| `status`             | VARCHAR(50)   | Workflow status — default `DRAFT`        |
| `ai_description`     | TEXT          | AI-generated summary                     |
| `ai_recommendations` | TEXT          | AI-generated action items                |
| `ai_report`          | TEXT          | Full AI-generated report                 |
| `is_fallback`        | BOOLEAN       | True if AI used a fallback response      |
| `created_by`         | VARCHAR(100)  | Creator's username                       |
| `created_at`         | TIMESTAMP     | Record creation time                     |
| `updated_at`         | TIMESTAMP     | Last update time                         |
| `deleted`            | BOOLEAN       | Soft-delete flag — default `false`       |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Java 17+ (for local development without Docker)
- Maven 3.8+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/board-meeting-minutes-manager.git
cd board-meeting-minutes-manager
```

---

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values
notepad .env        # Windows
# or
nano .env           # Linux / macOS
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

### 3. Run with Docker Compose

```bash
# Start all services (PostgreSQL + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (fresh DB)
docker-compose down -v
```

---

### 4. Run Locally (without Docker)

Make sure PostgreSQL is running locally, then:

```bash
cd backend

# Set environment variables (Windows PowerShell)
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/board_meeting_db"
$env:SPRING_DATASOURCE_USERNAME="board_user"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
$env:OPENAI_API_KEY="sk-your-key"

# Run the application
./mvnw spring-boot:run
```

---

### 5. Verify Application is Running

```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{ "status": "UP" }
```

---

## 🛢️ Database Migrations (Flyway)

Flyway runs automatically on startup. Migration files are located at:

```
backend/src/main/resources/db/migration/
```

| File           | Description          |
|----------------|----------------------|
| `V1__init.sql` | Initial schema setup |

To add a new migration, create `V2__<description>.sql` in the same directory.

---

## 🤖 AI Features

The application integrates with OpenAI to provide:

- **`ai_description`** — Auto-generated meeting summary
- **`ai_recommendations`** — Action items extracted from minutes
- **`ai_report`** — Full structured AI report
- **`is_fallback`** — Indicates if AI used a fallback due to API issues

Configure your API key in `.env`:
```
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o
```

---

## 🔐 Security

- JWT-based authentication
- Passwords hashed with BCrypt
- Soft delete pattern (`deleted = true`) instead of hard deletes
- Environment variables used for all secrets — no hardcoded credentials

---

## 📜 License

This project is licensed under the MIT License.
