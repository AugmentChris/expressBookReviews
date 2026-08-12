# Express Book Reviews

Node.js / Express final project for bookshop APIs.

## Features

- Register and login with JWT + session
- Public book listing (all, by ISBN, author, title)
- Book reviews (read publicly; add/update/delete when authenticated)
- Async helpers for book lookups

## Run

```bash
cd final_project
npm install
npm start
```

Server listens on port 5000.

## Example endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/register` | No |
| POST | `/customer/login` | No |
| GET | `/` | No |
| GET | `/isbn/:isbn` | No |
| GET | `/author/:author` | No |
| GET | `/title/:title` | No |
| GET | `/review/:isbn` | No |
| PUT | `/customer/auth/review/:isbn?review=...` | Yes |
| DELETE | `/customer/auth/review/:isbn` | Yes |
