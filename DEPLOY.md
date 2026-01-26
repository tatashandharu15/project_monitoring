# Monitoring Pengadaan - Deployment Guide

## Prerequisites
- Docker & Docker Compose installed on your Rocky Linux server.

## Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository_url>
   cd monitoring_pengadaan
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys (GROQ_API_KEY, GEMINI_API_KEY)
   nano .env
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the Application**
   - Frontend: http://<your-server-ip>:3333
   - Backend API: http://<your-server-ip>:9000/docs

## Troubleshooting
- If frontend cannot connect to backend, check logs:
  ```bash
  docker-compose logs -f
  ```
- Ensure port 3333 and 9000 are open in firewall:
  ```bash
  firewall-cmd --permanent --add-port=3333/tcp
  firewall-cmd --permanent --add-port=9000/tcp
  firewall-cmd --reload
  ```
