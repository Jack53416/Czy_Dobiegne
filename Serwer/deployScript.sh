
#! /bin/bash

#node git forever installs

apt-get -y update
apt-get -y install nodejs npm git
ln -s /usr/bin/nodejs /usr/bin/node
npm install -g forever

#firebird install, requires user for now

apt-get -y install firebird2.5-superclassic
dpkg-reconfigure firebird2.5-superclassic
isql-fb

CREATE DATABASE '/home/ubuntu/Toilets.fdb' page_size 8192
user '<user>' password '<Pass>';

#isql.exe -q -i script.sql

cat <<EOF > ./fdb-config.json
{"host":'localhost',"port":3050,"database":'Toilets.fdb',"user":<user>,"password":<pass>,"lowercase_keys":false,"role":null,"pageSize":8192}
EOF

sudo ufw allow 3050/tcp
#edit /usr/lib/firebird/2.5/firebird.conf
#Replace RemoteBindAddress = localhost
#With RemoteBindAddress = 
