# Queue Based Architecture

The booking system uses asynchronous processing for
notifications.

```text
                  Booking API
                       |
                       v
                    MySQL
                       |
                       v
                Booking Event
                       |
                       v
                  Message Queue
                       |
                       v
             Notification Worker
                  /         \
                 /           \
                v             v
             Email           SMS