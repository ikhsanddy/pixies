# Setting up HTTPS

::: tip Why use HTTPS?
HTTPS encrypts the connection between your browser and Pixies, protecting your data from being intercepted.
This is especially important if you access Pixies over a network or the internet.
:::

## Overview

Pixies supports HTTPS natively without requiring a reverse proxy. Simply place your SSL certificates in the `data/certs` directory, and Pixies will automatically start an HTTPS server.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HTTPS_PORT` | `5217` | The port for the HTTPS server |

### Certificate Files

Place your SSL certificates in the `data/certs` directory:

- `cert.pem` - Your SSL certificate
- `key.pem` - Your private key

The folder structure should look like this:

```
Pixies/
├── data/
│   ├── certs/
│   │   ├── cert.pem
│   │   └── key.pem
│   └── ...
└── ...
```

## Using Your Own Certificates

If you already have SSL certificates (e.g., from Let's Encrypt or a certificate authority), copy them to the `data/certs` directory:

```sh
cp /path/to/your/certificate.pem /path/to/pixies/data/certs/cert.pem
cp /path/to/your/private-key.pem /path/to/pixies/data/certs/key.pem
```

## Generating a Self-Signed Certificate

For testing or internal use, you can generate a self-signed certificate:

```sh
openssl req -x509 -newkey rsa:4096 \
  -keyout data/certs/key.pem \
  -out data/certs/cert.pem \
  -sha256 -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"
```

::: warning Self-Signed Certificates
Self-signed certificates will show a security warning in browsers. This is normal for self-signed certificates.
For production use, we recommend using certificates from a trusted certificate authority like Let's Encrypt.
:::

## Using Let's Encrypt Certificates

If you're using Let's Encrypt with certbot, your certificates are typically stored in `/etc/letsencrypt/live/your-domain.com/`. You can either copy or symlink them:

```sh
# Copy the certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /path/to/pixies/data/certs/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /path/to/pixies/data/certs/key.pem

# Make sure Pixies can read them
sudo chown $USER:$USER /path/to/pixies/data/certs/*.pem
```

::: tip Certificate Renewal
Remember to update your certificates in the `data/certs` directory when they are renewed.
You can automate this with a post-renewal hook in certbot.
:::

## Verifying HTTPS is Working

After placing your certificates and starting Pixies, you should see in the console:

```
Server listening on port 5216
HTTPS server listening on port 5217
```

You can then access Pixies via:
- HTTP: `http://localhost:5216`
- HTTPS: `https://localhost:5217`

## Docker Configuration

When using Docker, mount the certificates directory:

```yaml
version: "3"
services:
  pixies:
    image: ghcr.io/ikhsanddy/pixies
    ports:
      - "5216:5216"
      - "5217:5217"  # HTTPS port
    volumes:
      - /path/to/pixies:/pixies/data
      # Certificates will be in /path/to/pixies/certs/
    environment:
      - HTTPS_PORT=5217  # Optional, 5217 is default
```

