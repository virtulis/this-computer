# This Computer

Shows your IP address(es). Powered by a single static file and a Nginx config.

Available at [this.computer](https://this.computer).

## Make your own

* Install Nginx, Certbot and Node.js (for the "build script").
* Have a hostname for the website.
* Have two hostnames for the IP checks, one with just an A record, one with just AAAA.

Copy `config.example.js` to `config.js` and edit as needed.

```bash
# install the few dependencies (pnpm is preferred but npm will work too)
pnpm install

# this generates `dist/index.html` and nginx configs in conf/
node build.js

# LetsEncrypt setup (skip and edit the main config if you prefer handling it yourself)

# If target does not exist, try /etc/nginx/sites or /etc/nginx/conf.d 
sudo mkdir -p /srv/tmp
sudo cp conf/this-computer-certbot.conf /etc/nginx/sites-enabled/
sudo systemctl reload nginx
sudo certbot certonly --webroot -w /srv/tmp -d this.computer -d 4.this.computer -d 6.this.computer
# Assuming the above worked!
echo 'systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/nginx.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx.sh

# After certificates are ready:
sudo cp conf/this-computer.conf /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Enable the pinger service
sudo systemctl enable --now $PWD/conf/this-computer-pong.service


```



## License

MIT