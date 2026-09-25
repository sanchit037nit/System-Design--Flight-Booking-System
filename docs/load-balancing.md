# Load Balancing Strategy

The load balancer distributes requests across multiple
Node.js application instances.

```text
Client
  |
  v
Load Balancer
  |
  +------> Node 1
  |
  +------> Node 2
  |
  +------> Node 3