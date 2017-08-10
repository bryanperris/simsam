#!/bin/bash
./coffeebuild.sh
cd automata
vagrant rsync
vagrant ssh -c "export PATH=$PATH:/usr/local/bin; sudo pkill supervisord; sudo supervisord -c /etc/supervisord.conf; echo done"