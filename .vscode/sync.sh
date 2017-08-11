#!/bin/bash
./coffeebuild.sh
cd automata
vagrant rsync
vagrant ssh -c "sudo su -c 'export PATH=$PATH:/usr/local/bin; pkill supervisord; supervisord -c /etc/supervisord.conf'; echo done"