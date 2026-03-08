# JWT & HTTPS Integration Guide

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Update these critical values in `.env`:
- `JWT_SECRET`: Use a strong, unique secret (min 32 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `PORT`: Default is 5000
- `SSL_CERT_PATH` and `SSL_KEY_PATH`: Paths to SSL certificates

### 3. Generate Self-Signed SSL Certificates (Development)
For local development, create self-signed certificates:

```bash
mkdir -p certs
cd certs

# Generate private key
openssl genrsa -out server.key 2048

# Generate certificate (valid for 365 days)
openssl req -new -x509 -key server.key -out server.crt -days 365 \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

cd ..
```

Update `.env`:
```
SSL_CERT_PATH=./certs/server.crt
SSL_KEY_PATH=./certs/server.key
USE_HTTPS=true
```

### 4. Running the Server

**Development (HTTP):**
```bash
npm start
```

**Development (HTTPS with self-signed cert):**
```bash
# Ensure SSL_CERT_PATH and SSL_KEY_PATH are set in .env
npm start
```

**Production (HTTPS with real certificates):**
- Obtain real SSL certificates from Let's Encrypt, AWS ACM, or similar
- Update `SSL_CERT_PATH` and `SSL_KEY_PATH` in `.env`
- Run: `npm start`

---

## API Endpoints

### Authentication (Public)

#### Register
**POST** `/api/auth/register`
```json
{
  "username": "user@example.com",
  "password": "securepassword123"
}
```
Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
**POST** `/api/auth/login`
```json
{
  "username": "user@example.com",
  "password": "securepassword123"
}
```
Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Protected Routes (Requires JWT Token)

#### Analyze Repository
**POST** `/api/analyze`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "repo": "owner/repository"
}
```

Response:
```json
{
  "issues": [...],
  "duplicates": [...],
  "firstTimer": [...]
}
```

### Health Check
**GET** `/api/health`
- No authentication required
- Returns: `{ "status": "OK" }`

---

## Frontend Integration

### Update API Service (Frontend)

Edit `frontend/src/api/analyzeApi.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:5000/api";

// Store token (after login/register)
const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Get token for requests
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Register user
export const registerUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.token) setAuthToken(data.token);
  return data;
};

// Login user
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.token) setAuthToken(data.token);
  return data;
};

// Existing analyzeRepo with token
export const analyzeRepo = async (repo) => {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ repo })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};
```

### Handle HTTPS Locally

For development with self-signed certificates in the browser, you may need to:
1. Accept the self-signed certificate warning in browser
2. Or use `fetch` with `credentials: 'include'`

---

## Production Deployment Checklist

- [ ] Generate real SSL certificates (Let's Encrypt, AWS ACM, etc.)
- [ ] Set strong `JWT_SECRET` (min 32 random characters)
- [ ] Use a production database instead of in-memory user storage
- [ ] Update CORS origins to your frontend domain
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for all sensitive data
- [ ] Implement rate limiting on auth endpoints
- [ ] Add refresh token mechanism
- [ ] Log authentication attempts
- [ ] Use HTTPS_ONLY flag

---

## Security Best Practices

1. **JWT Secret**: Use strong, random secret
2. **Password Hashing**: Already using bcryptjs (10 salt rounds)
3. **Token Expiration**: Currently 24 hours (adjust as needed)
4. **HTTPS**: Always use in production
5. **Database**: Replace in-memory storage with proper database
6. **CORS**: Configure to allow only your frontend origin
7. **Rate Limiting**: Add to prevent brute force attacks
8. **Token Refresh**: Implement refresh tokens for better security

---

## Troubleshooting

### "SSL_ERROR_BAD_CERT_DOMAIN" (Firefox)
Self-signed certificates trigger this. Click "Advanced" → "Accept Risk and Continue"

### "ERR_SSL_PROTOCOL_ERROR" (Chrome)
Self-signed cert issue. Open `https://localhost:5000/api/health` directly and accept the certificate.

### "Unauthorized" responses
- Verify token is in `Authorization: Bearer <token>` header
- Check token hasn't expired (24h default)
- Ensure JWT_SECRET matches in server and token generation

### Certificate file not found
- Verify `SSL_CERT_PATH` and `SSL_KEY_PATH` in `.env` are correct
- Server will fall back to HTTP with a warning if certs are missing
