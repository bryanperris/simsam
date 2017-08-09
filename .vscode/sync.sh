#!/bin/bash
./coffeebuild.sh
cd automata
vagrant rsync
vagrant ssh -c "sudo pkill supervisord; sudo /usr/local/bin/supervisord -c /etc/supervisord.conf; echo done"