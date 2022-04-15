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
 ```

 ```bash
 sudo apt-get install nodejs
 ```

 ```bash
 sudo apt-get install build-essential
 ```
2. Verify installation
```bash
node -v
```

```bash
npm -v
```

Clone project
1. Run:
```bash
cd ~
git clone https://github.com/RemiBahar/matrix-calculations.git
```

Install Nginx
1. Run:
```bash
sudo apt-get update
sudo apt-get install nginx
```

Configure Nginx
1. Run
```bash
sudo ufw enable
```

```bash
sudo ufw allow 'Nginx Full'
```

2. The following command should output Nginx HTPP | allow
```bash 
sudo ufw status
```

3. Verify set-up: visit http://ip where ip is the ip address of your server. An Nginx page should display.

4. Run:
```bash
cd /
cd /etc/nginx/sites-available 
sudo chmod 777 default
```

5. Run sudo nano default and replace the location block with the following
location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

6. Test to see if everything is configured correctly
```bash
sudo nginx -t
```

```bash
sudo systemctl restart nginx
```
7. From project directory (matrix-calculations)@
```bash
node app.js
```

8. Finally: visit ip address in browser, the app's homepage should now be shown

## Set up server(s)

For each server

Install Node
1. From home directory, install Node:
```bash
 cd ~
 curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 ```

 ```bash
 sudo apt-get install nodejs
 ```

 ```bash
 sudo apt-get install build-essential
 ```
2. Verify installation
```bash
node -v
```

```bash
npm -v
```

Clone project
1. Run:
```bash
cd ~
git clone https://github.com/RemiBahar/matrix-calculations.git
```

Install Nginx
1. Run:
```bash
sudo apt-get update
sudo apt-get install nginx
```

Run server.js
1. Run:
```bash
cd ~
cd matrix-calculations
node server.js
```