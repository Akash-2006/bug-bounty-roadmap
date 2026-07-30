# Anatomy of an HTTP Request

Every web attack begins with a single HTTP request. Before you can break a
request, you have to understand it completely.

```http
GET /account?id=1337 HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0
Cookie: session=eyJ1c2VyIjoiYWxpY2UifQ
Accept: application/json
```

## The request line

The first line carries three attacker-relevant primitives:

- **Method** — `GET`, `POST`, `PUT`, `DELETE`, … Each has different semantics
  and different security assumptions.
- **Path + query** — `/account?id=1337` is where most user-controlled input
  enters the application.
- **Version** — `HTTP/1.1` vs `HTTP/2` affects request-smuggling surface.

## Why it matters

The `id=1337` parameter is a textbook **IDOR** candidate. Change it to `1338`
and observe whether the server enforces authorization.

> Tip: Treat every request parameter, header, and cookie as an untrusted input
> that the server *might* trust.
