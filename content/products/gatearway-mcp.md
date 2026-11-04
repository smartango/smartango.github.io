---
title: "Gatearway + MCP"
date: 2026-11-03
draft: false
url: "/products/gatearway-mcp/"
---

Gatearway lets teams define and run service entrypoints with pipelines, then expose selected services as OAuth-protected Model Context Protocol (MCP) endpoints for AI agents.

## Join the waiting list

Interested in trying Gatearway + MCP? Sign up to register your interest and request early access.

<p><a class="btn btn-primary waiting-list-cta" href="https://docs.google.com/forms/d/e/1FAIpQLScQ51gWNGuDGqJkSnoxp--Vb9z5A1DzKyF6QhcjndfuK1kedQ/viewform?usp=header">Join the waiting list</a></p>

![Gatearway MCP generator and integration architecture](/mcp-architecture-mockup-v2.png)

## Define services through an API

The Gatearway API supports listing services, retrieving a service definition, and inserting a new service definition. A service groups entrypoints and the pipeline steps executed for each entrypoint. The API is designed for a React frontend and is also published in OpenAPI format.

Entrypoints can use ordinary GET or POST requests. A service can also define its own MCP endpoint, configured with a RabbitMQ broker address and an exchange filter.

## A controlling MCP for service creation

The API is protected by bearer authorization and OAuth, and is exposed through a controlling MCP. An authorized intelligent agent can use it to define a service and make that service's own MCP available. The service MCP also uses OAuth for agent access.

## Automatic service documentation

Once a service is defined and started, the gclerk image serves its documentation automatically. Agents can use the generated documentation to discover the running service's capabilities.

The architecture image above shows the relationship between the frontend, Gatearway API, controlling MCP, service entrypoints, RabbitMQ-backed MCP routing, and agent access.