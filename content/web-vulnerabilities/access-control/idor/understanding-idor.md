# Understanding IDOR

**Insecure Direct Object Reference (IDOR)** occurs when an application exposes a
reference to an internal object and fails to verify the requester is authorized
to access it.

## The pattern

```http
GET /api/invoices/1024 HTTP/1.1
Authorization: Bearer <alice-token>
```

If Alice can retrieve invoice `1023` (Bob's invoice), the server is trusting the
identifier without checking ownership.

## Where it hides

- Sequential numeric IDs (`/users/42`)
- Predictable UUIDs or hashes
- Filenames and storage keys
- Hidden form fields and JSON bodies
