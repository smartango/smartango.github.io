# GatearwayMan Features Documentation

This YAML file defines the development status of GatearwayMan services and features.

## YAML Structure

```yaml
features:
  - name: Feature Name
    status: Status Value
    description: Feature description
```

## Status Values

- **Released**: Feature is production-ready and deployed
- **WIP**: Work in progress - actively being developed
- **Define Requirements**: Requirements gathering phase
- **Planned**: Planned for future development

## How to Update

1. Edit `data/gatearwayman-features.yaml`
2. Modify the `status`, `name`, or `description` fields
3. Add new features by adding new entries under `features:`
4. Remove features by deleting entries
5. Commit and push your changes
6. GitHub Actions will automatically rebuild and deploy the site

## Example

```yaml
features:
  - name: My New Feature
    status: WIP
    description: This is a new feature currently under development
```

## Notes

- The feature matrix table is automatically generated from this YAML file
- The table appears on the GatearwayMan product page
- Status badges are color-coded for easy visual identification
- Keep descriptions concise (1-2 sentences max)
