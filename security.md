Two potential vulnerabilities addressed:
1. **NoSQL Injection**: Prevented by using Mongoose validation and sanitizing all queries
2. **CORS Misconfiguration**: Limited to trusted origins

Detailed mitigation for NoSQL Injection:
All user input is validated against strict schemas before database operations. We use Mongoose methods like `findById()` instead of raw queries, and escape special characters in search inputs. The API rejects malformed data with 400 errors.