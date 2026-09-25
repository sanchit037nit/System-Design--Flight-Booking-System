# Horizontal Scaling Architecture

The flight booking backend is designed to support horizontal scaling.

```text
                    Client
                      |
                      v
                Load Balancer
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Node 1      Node 2      Node 3
          |           |           |
          +-----------+-----------+
                      |
                      v
                    Redis
                      |
                      v
                    MySQL