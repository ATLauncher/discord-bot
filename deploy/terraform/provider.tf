variable "do_token" {
}

variable "do_data_volume_id" {
}

variable "do_floating_ip" {
}

variable "ssh_fingerprint" {
}

variable "ssh_private_key" {
}

provider "digitalocean" {
  token = var.do_token
}

