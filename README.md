# matrix-calculations
## Set-up

## Accessing the project as a client
1. Visit http://34.142.12.178/

## Set-up client server

Install Node
1. From home directory, install Node:
```bash
 cd ~
 curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 sudo apt-get install nodejs
 sudo apt-get install build-essential
 ```
2. Verify installation
```bash
node -v
npm -v
```

Clone project
1. Run:
```bash
git clone https://github.com/RemiBahar/matrix-calculations.git
```

Set-up pm2
1. Run 
```bash
sudo npm install -g pm2
pm2 start app.js
pm2 startup systemd
```
2. Run the last line of the previous command's output
5. Run: systemctl status pm2-u. Where u is the user

Adjust firewall
1. Run:
```bash 
sudo ufw enable
sudo ufw allow 'Nginx Full'
```
2. The following command should output Nginx HTPP | allow
```bash 
sudo ufw status
```

Set-up Nginx
1. Run:
```bash
sudo apt-get update
sudo apt-get install nginx
```
2. Verify set-up: visit http://ip where ip is the ip address of your server
3. Run:
```bash
cd /
cd /etc/nginx/sites-available 
chmod 777 default
```
4. Run sudo nano default and replace the location block with the following
location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

Finally
1. Visit ip address in browser

## Set up server(s)

For each server you want to split the matrix calculations amongst:

Install Node
1. From home directory, install Node:
```bash
 cd ~
 curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 sudo apt-get install nodejs
 sudo apt-get install build-essential
 ```
2. Verify installation
```bash
node -v
npm -v
```

Clone project
1. Run:
```bash
git clone https://github.com/RemiBahar/matrix-calculations.git
```


