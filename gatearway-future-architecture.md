# Architecture of GatearWayMan

It is expected to expose an API for service entrypoints definition.

This API is naturally used by the frontend in ReactJs.

But also the API is exported in openapi format.

The API provides:
- list services (entrypoint groups)
- get service definition
- insert new service (entrypoint group) definition

A service definition is a list of entrypoint each of whom are associated with a pipeline steps to be executed.

Since this is exposed behind an authorization bearer, and oauth, there is also an MCP exposed for it.

Each service (entrypoint groups) can define its own MCP.
Eacn of those service owned MCP is defined by:
- RabbitMQ message broker address
- RabbitMQ message exchange filter definition

Other entrypoints are defined by simple get/post.

After definition and starting the new service, all is documented automatically by the gclerk image serving it, and the newly defined MCP is available to some agent, also implementing oauth for access, etc.

This give the ability to an Intelligent Agent to define a new MCP by using the exposed API.

So, we have a controlling MCP from which is possible to define services providing MCP access with oauth.

This is the architecture:
```
                         +------------------+
                         | Intelligent Agent|
                         +--------+---------+
                                  |
                                  | OAuth-protected MCP access
                                  v
                    +-------------+--------------+
                    | Controlling MCP           |
                    | defines services via API  |
                    +-------------+--------------+
                                  |
                                  | OAuth / bearer authorization
                                  v
   +-------------------+   +------+--------------------+   +-------------------+
   | React frontend    +-->| GatearWayMan API          +-->| OpenAPI definition|
   | service management|   | list/get/insert services  |   +-------------------+
   +-------------------+   +-----------+---------------+
                                       |
                                       | define and start service
                                       v
                           +-----------+------------+
                           | Running service        |
                           | entrypoints + pipelines|
                           +------+-------------+--+
                                  |             |
                      GET/POST    |             | service-owned MCP
                      entrypoints |             | OAuth-protected
                                  |             v
                                  |      +------+------------------+
                                  |      | MCP message routing     |
                                  |      | RabbitMQ address +      |
                                  |      | exchange filter         |
                                  |      +-----------+--------------+
                                  |                  |
                                  |                  v
                                  |            +-----+------+
                                  |            | RabbitMQ   |
                                  |            +------------+
                                  v
                     +------------+------------+
                     | Pipeline steps execute  |
                     +-------------------------+

                     +--------------------+
                     | gclerk image serves|
                     | generated docs     |
                     +---------+----------+
                               |
                               | documents running service
                               +---------------------------> Agent
```