# matrix-calculations
## Set-up

## Accessing the project as a client
1. Visit http://34.142.12.178/

## Copying the project to your own server

Install Node
1. From home directory run: curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
2. Run script: sudo bash nodesource_setup.sh
3. sudo apt-get install nodejs
4. sudo apt-get install build-essential
5. Verify installation: node -v, npm -v

Clone project
1. git clone https://github.com/RemiBahar/matrix-calculations.git

Set-up pm2
1. sudo npm install -g pm2
2. pm2 start app.js
3. pm2 startup systemd
4. Run the last line of the previous command's output
5. Run: systemctl status pm2-u. Where u is the user

Adjust firewall
1. sudo ufw enable
2. sudo ufw allow 'Nginx Full'
3. The following command: sudo ufw status should output Nginx HTPP | allow

Set-up Nginx
1. sudo apt-get update
2. sudo apt-get install nginx
3. Verify set-up: visit http://ip where ip is the ip address of your server
3. cd /
4. cd /etc/nginx/sites-available 
5. chmod 777 default
6. Run sudo nano default and replace the location block with the following
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


