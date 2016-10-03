# Contributing
So you want to contribute to ATLauncher? Well here are a few ways you can help make this project better!

## Branching structure
When contributing please follow our branching structure when making a PR. Not following this will result in automatic closure of the PR.

Our branching structure is based on [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

 - **master** will always contain the code for the latest production release
 - **develop** will contain the latest alpha/beta version used for testing
 - **feature/*** will contain single issues being developed. Once developed they're merged into develop and tagged with a beta release version. They should be named 'feature/22-some-brief-description'
 - **release/*** will contain all the code from each feature branch that are going out in the next release and should all be merged into the branch. Once approved and tested it gets merged into master
                 and tagged. They should be named 'release/4-1-1-release'
 - **hotfix/*** will contain hotfixes going to be merged directly into master then tagged. Hotfixes should only need to occur when there is a very critical bug in the current release that needs to be
                fixed ASAP. All hotfix branches should be branched off of master.

All tags are done on release of a beta or a production version and should be in format **v(version number)** and the version number being that of a semver number.

All develop beta releases should be tagged with **alpha** and **beta** versions. For instance **v4.1.1-alpha.1.6** where the NPM package version would be **4.1.1-alpha.1.6**.

Feature branches are deleted once in a release branch. Any issues that come up after the features branch has been merged into a release branch should be resolved by creating a new feature branch off
the release branch.

An example of a good name for a feature branch is say we have an issue (#44) which is about not being able to delete a pack. A good name for a feature branch would be
`feature/44-unable-to-delete-packs` and go from there.

While the initial development goes on, a temporary 'initial-code' branch will be used them merged into develop when testing is ready.

## Code styling
When creating a PR all code you've commited will be linted against our defined eslint rules. You can check if your code follows our standards by running the `npm run lint` command.

In short please note the following:

 - All line lengths should be under 200 lines long.
 - 4 spaces in all files (other than json files).
 - Unix newlines should always be used.
 - Single quotes should be used everywhere when possible except for JSON.
 - All code should contain correct JSDoc documentation.
 
## Testing
All new code created should be properly tested with both unit and end to end tests where appropriate.

Please don't over test your code, we don't aim for complete code coverage and don't even use that as a metric, we simply want to make sure all code is tested for both happy and sad paths, making sure
as many use cases are accounted for.

## Discord
If you wish to join our Discord channel please do so [here](https://atl.pw/discord). There is a channel specifically for NEXT discussion called **#atlauncher-next** which you can feel free to
contribute to.