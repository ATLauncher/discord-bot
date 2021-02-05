resource "digitalocean_droplet" "discord-bot" {
  image              = "ubuntu-18-04-x64"
  name               = "discord-bot"
  region             = "sfo2"
  size               = "s-1vcpu-1gb"
  private_networking = false
  monitoring         = true
  ssh_keys           = [var.ssh_fingerprint]
  user_data          = <<-EOT
    #cloud-config
    # Set up non-root sudo account.
    users:
    - name: node
      groups: sudo
      shell: /bin/bash
      sudo: ALL=(ALL) NOPASSWD:ALL

    write_files:
    - encoding: b64
      content: ${base64encode(var.ssh_private_key)}
      owner: root:root
      path: /root/id_rsa
      permissions: '0600'

    # apt update and upgrade
    package_update: true
    package_upgrade: true

    # Install the following packages
    packages:
    - git
    - gcc
    - g++
    - curl
    - dirmngr
    - apt-transport-https
    - lsb-release
    - ca-certificates

    runcmd:
    # Environment variables
    - export HOME=/home/node

    # Install Node.js
    - curl -sL https://deb.nodesource.com/setup_14.x | bash
    - apt -y install nodejs

    # Copy over ssh key
    - mkdir /home/node/.ssh
    - cp /root/.ssh/authorized_keys /home/node/.ssh/authorized_keys
    - mv /root/id_rsa /home/node/.ssh/id_rsa
    - echo "" >> /home/node/.ssh/id_rsa

    # Add github.com ssh key to known_hosts
    - ssh-keyscan -t rsa github.com > /home/node/.ssh/known_hosts

    # Use local path for global NPM modules
    - su -c "mkdir /home/node/.npm-global"
    - su -c "npm config set prefix '/home/node/.npm-global'"
    - su -c "sed -i '1i PATH=/home/node/.npm-global/bin:\$PATH' /home/node/.bashrc"
    - su -c "source /home/node/.profile"

    # Install PM2 and add to systemd
    - su -c "npm install pm2 -g"
    - env PATH=$PATH:/usr/bin /home/node/.npm-global/bin/pm2 startup systemd -u node --hp /home/node

    # Setup git global config
    - echo "[user]" > /home/node/.gitconfig
    - echo "        name = ATLauncher Bot" >> /home/node/.gitconfig
    - echo "        email = atlauncher-bot@atlauncher.com" >> /home/node/.gitconfig

    # Fix permissions
    - chown -R node:node /home/node
  EOT

  provisioner "remote-exec" {
    inline = [
      "cloud-init status --wait"
    ]

    connection {
      host  = "${digitalocean_droplet.discord-bot.ipv4_address}"
      user  = "root"
      agent = true
    }
  }
}
