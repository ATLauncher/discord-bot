terraform {
  backend "remote" {
    organization = "atlauncher"

    workspaces {
      name = "docker-bot"
    }
  }
}
