---
layout: home

hero:
  name: Pixies
  text: Automate Speedtests
  tagline: A self-hosted speedtest tracking tool that allows you to monitor your internet connection.
  actions:
    - theme: brand
      text: Get started
      link: /setup/linux
    - theme: alt
      text: GitHub
      link: https://github.com/ikhsanddy/pixies
  image:
    src: /logo.png
    alt: Pixies

features:
  - icon: 📊
    title: Detailed statistics
    details: Pixies generates clear statistics on speed, ping, and more.
  - icon: ⏰
    title: Test automation
    details: Pixies automates speed tests and allows you to set the time between tests using Cron expressions.
  - icon: 🗄️
    title: Add multiple servers
    details: Add multiple servers to your Pixies instance and switch between them.
  - icon: 🩺
    title: Use Health Checks
    details: Configure health checks to notify you via email, Signal, WhatsApp, or Telegram in case of errors or downtime.
  - icon: 🔥
    title: Support for Prometheus and Grafana
    details: Integrate directly with Prometheus and Grafana to monitor your Pixies instance.
  - icon: 🗳️
    title: Choose your provider
    details: Choose between Ookla, LibreSpeed and Cloudflare speed test servers.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #456ac6 30%, #46CA5A);

  --vp-home-hero-image-background-image: linear-gradient(#1C2232 50%, #1C2232);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>