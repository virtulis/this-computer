# This Computer

Shows your IP address(es). Powered by a single static file and a Nginx config.

Available at [this.computer](https://this.computer).

## Make your own

* Install Nginx, Certbot and Node.js (for the "build script").
* Have a hostname for the website.
* Have two hostnames for the IP checks, one with just an A record, one with just AAAA.

Do this (substitute the hostnames):

```bash

# substitute the hostnames. $PWD/dist is where the html file is
node build.js this.computer 4.this.computer 6.this.computer $PWD/dist

# LetsEncrypt setup (skip and edit the main config if you prefer handling it yourself)

# If target does not exist, try /etc/nginx/sites or /etc/nginx/conf.d 
sudo mkdir -p /srv/tmp
sudo cp conf/this-computer-certbot.conf /etc/nginx/sites-enabled
sudo systemctl reload nginx
sudo certbot certonly --webroot -w /srv/tmp -d this.computer -d 4.this.computer -d 6.this.computer
# Assuming the above worked!
echo 'systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/nginx.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx.sh

# After certificates are ready:
sudo cp conf/this-computer.conf /etc/nginx/sites-enabled
sudo systemctl reload nginx

```

## License

MIT