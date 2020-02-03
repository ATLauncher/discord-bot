resource "digitalocean_droplet" "discord-bot" {
  image              = "ubuntu-18-04-x64"
  name               = "discord-bot"
  region             = "sfo2"
  size               = "s-1vcpu-1gb"
  private_networking = false
  monitoring         = true
  user_data          = "${file("droplet.conf")}"
  ssh_keys           = [var.ssh_fingerprint]

  provisioner "remote-exec" {
    inline = [
      "cloud-init status --wait"
    ]
  }
}
