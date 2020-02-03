output "ip" {
  value = "${digitalocean_droplet.discord-bot.ipv4_address}"
}
