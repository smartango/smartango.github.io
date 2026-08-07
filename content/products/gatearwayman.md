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

GatearwayMan is organized into multiple services and features, each at different stages of development.

<div class="feature-matrix">

<table>
<thead>
<tr>
<th>Service/Feature</th>
<th>Status</th>
<th>Description</th>
</tr>
</thead>
<tbody>
{{ range .Site.Data.gatearwayman_features.features }}
<tr>
<td><strong>{{ .name }}</strong></td>
<td>
{{ if eq .status "Released" }}
<span class="status-badge status-released">✅ Released</span>
{{ else if eq .status "WIP" }}
<span class="status-badge status-wip">🚧 WIP</span>
{{ else if eq .status "Define Requirements" }}
<span class="status-badge status-requirements">📝 Define Requirements</span>
{{ else if eq .status "Planned" }}
<span class="status-badge status-planned">📋 Planned</span>
{{ end }}
</td>
<td>{{ .description }}</td>
</tr>
{{ end }}
</tbody>
</table>

</div>

**Status Legend:**
- ✅ **Released**: Feature is production-ready and deployed
- 🚧 **WIP**: Work in progress - actively being developed
- 📝 **Define Requirements**: Requirements gathering phase
- 📋 **Planned**: Planned for future development

> **Note**: To update the feature status, edit the `data/gatearwayman-features.yaml` file.

## Deployment Configuration Generator

Create your custom Docker Swarm deployment configuration using our interactive YAML generator below.

<div id="yaml-generator-root"></div>

---

## Get Started

Ready to deploy GatearwayMan? Use the configuration generator above or check out our [GitHub repository](https://github.com/smartango/gatearwayman) for manual deployment instructions.
