workflow "Build and push Docker image" {
  on = "push"
  resolves = [
    "Tag with latest",
    "Push commit hash image",
    "Push latest image",
  ]
}

action "Login to Docker registry" {
  uses = "actions/docker/login@c08a5fc9e0286844156fefff2c141072048141f6"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Build Docker image" {
  uses = "actions/docker/cli@c08a5fc9e0286844156fefff2c141072048141f6"
  args = "build -t build ."
  needs = ["Login to Docker registry"]
}

action "Tag with latest" {
  uses = "actions/docker/tag@c08a5fc9e0286844156fefff2c141072048141f6"
  needs = ["Build Docker image"]
  args = "build atlauncher/discord-bot:latest"
}

action "Push latest image" {
  uses = "actions/docker/cli@c08a5fc9e0286844156fefff2c141072048141f6"
  args = "push atlauncher/discord-bot:latest"
  needs = [
    "Login to Docker registry",
    "Tag with latest",
  ]
}

action "Tag with commit hash" {
  uses = "actions/docker/tag@c08a5fc9e0286844156fefff2c141072048141f6"
  needs = ["Build Docker image"]
  args = "build atlauncher/discord-bot:$GITHUB_SHA"
}

action "Push commit hash image" {
  uses = "actions/docker/cli@c08a5fc9e0286844156fefff2c141072048141f6"
  args = "push atlauncher/discord-bot:$GITHUB_SHA"
  needs = ["Tag with commit hash"]
}
