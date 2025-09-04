# This is a script to setup my website.
#!/usr/bin/env bash

mkdir -p public/images/projects
ln -sf $(realpath personal/projects/*) public/images/projects/
ln -sf $(realpath personal/data.yml) public/data.yml