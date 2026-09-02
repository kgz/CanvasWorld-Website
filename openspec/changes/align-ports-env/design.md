| Context | Backend | Frontend | `FRONTEND_URL` (screenshots) |
|---------|---------|----------|------------------------------|
| Local (`air` + `pnpm dev`) | `8080` | `5173` | `http://localhost:5173/chaos` |
| `docker-compose` | `8080` | `5173` | `http://frontend:5173/chaos` (backend container) |
| Production image | `8080` | static via backend | `https://matf.dev/chaos` |

- `VITE_BACKEND_URL`: leave unset in dev; Vite proxies `/api` and `/chaos/icons` to `BACKEND_PORT` (default 8080).
- Remove stale `9090` and `3002` references.
