---
title: "GatearwayMan"
date: 2026-08-07
draft: false
layout: "gatearwayman"
---

# GatearwayMan

The key feature of this service is to deal with **Expose**, **Authenticate**, and **Route** requests in your cloud-native environment.

## Overview

GatearwayMan simplifies the management of your application gateway layer, providing:

- **Request Routing**: Intelligent traffic routing based on rules and conditions
- **Authentication**: Integrated authentication mechanisms for secure access
- **Service Exposure**: Simplified service exposure to external clients

## Development Status

<div class="feature-matrix">

| Feature | Status | Description |
|---------|--------|-------------|
| Basic Routing | ✅ Complete | Route requests to backend services |
| Path-based Routing | ✅ Complete | Route based on URL paths |
| Host-based Routing | ✅ Complete | Route based on host headers |
| JWT Authentication | ✅ Complete | JSON Web Token authentication |
| OAuth2 Integration | 🚧 In Development | OAuth2 authentication provider |
| Rate Limiting | 🚧 In Development | Request rate limiting per client |
| Circuit Breaker | 🚧 In Development | Fault tolerance patterns |
| Metrics & Monitoring | ✅ Complete | Prometheus metrics export |
| Health Checks | ✅ Complete | Backend health monitoring |
| TLS Termination | ✅ Complete | HTTPS/TLS support |
| WebSocket Support | 🚧 In Development | WebSocket proxy support |
| gRPC Support | 📋 Planned | gRPC protocol support |
| Load Balancing | ✅ Complete | Round-robin and weighted balancing |
| Session Affinity | 🚧 In Development | Sticky session support |
| Request Transformation | 📋 Planned | Header and body transformations |
| Response Caching | 📋 Planned | Response cache layer |

</div>

**Legend:**
- ✅ Complete: Feature is production-ready
- 🚧 In Development: Feature is currently being developed
- 📋 Planned: Feature is planned for future release

## Deployment Configuration Generator

Create your custom Docker Swarm deployment configuration using our interactive YAML generator below.

<div id="yaml-generator-root"></div>

---

## Get Started

Ready to deploy GatearwayMan? Use the configuration generator above or check out our [GitHub repository](https://github.com/smartango/gatearwayman) for manual deployment instructions.
