# Troubleshooting

In this guide, you will learn how to fix known errors with this service.

::: danger Could not open the database file. Maybe it is damaged?
There can be several solutions to this error. Just work through all possibilities and your problem should be solved. :)

1. **Set the required permissions**  
   To set the permissions, enter the command `chmod 700 /opt/pixies`. (Replace /opt/pixies with your installation location).

2. **Perform a new installation of the dependencies**  
   First, run `bun install` in the installation folder to refresh all dependencies.
   :::

::: danger This Pixies instance is currently in development mode
This means the client build folder was not found. If you installed from source, make sure to build the client first:
```sh
cd client && npm install && npm run build && cd .. && mv client/build .
```
Alternatively, download a pre-built release or use Docker.
Also, read the [guide for 24/7 installation](setup/linux) if you plan to run Pixies in the background and start it automatically at system startup.
:::