# Pruebas de Carga — RNF01

Simulación de 50 usuarios concurrentes según RNF01.

## Requisitos

- [k6](https://k6.io/docs/get-started/installation/) instalado
- Backend corriendo en localhost:3001

## Ejecución local

```bash
k6 run k6/load-test.js
```

## Ejecución contra staging

```bash
k6 run -e BASE_URL=http://tu-servidor:3001 k6/load-test.js
```

## Umbrales definidos (RNF01)

| Métrica | Umbral |
|---------|--------|
| p(95) tiempo de respuesta | < 2000ms |
| Tasa de errores | < 1% |
| Requests fallidos | < 1% |
| Usuarios concurrentes | 50 |

## Resultado esperado

El sistema debe mantener uptime 99.9% y tiempo de respuesta
menor a 2 segundos con 50 usuarios simultáneos.