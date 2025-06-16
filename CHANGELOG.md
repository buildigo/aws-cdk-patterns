# Changelog

## [0.4.2](https://github.com/buildigo/aws-cdk-patterns/compare/v0.4.1...v0.4.2) (2025-06-16)


### Bug Fixes

* exports type for typescript 5+ ([09064b2](https://github.com/buildigo/aws-cdk-patterns/commit/09064b256ada6f90b5dfaace78deeacbfb39b822))

## [0.4.1](https://github.com/buildigo/aws-cdk-patterns/compare/v0.4.0...v0.4.1) (2024-11-11)


### Bug Fixes

* maintain EXIF orientation when resizing and reformatting image ([6230950](https://github.com/buildigo/aws-cdk-patterns/commit/6230950688508e3550b86785cf210e8b24cc52d8))
* maintain EXIF orientation when resizing and reformatting images ([6230950](https://github.com/buildigo/aws-cdk-patterns/commit/6230950688508e3550b86785cf210e8b24cc52d8))

## [0.4.0](https://github.com/buildigo/aws-cdk-patterns/compare/v0.3.3...v0.4.0) (2024-10-15)


### Miscellaneous Chores

* release 0.4.0 ([1f4a2bc](https://github.com/buildigo/aws-cdk-patterns/commit/1f4a2bc1e449c7d6b76fad549aa42f784ac7a7a6))

## [0.3.3](https://github.com/buildigo/aws-cdk-patterns/compare/v0.3.2...v0.3.3) (2024-10-10)


### Bug Fixes

* strong validation of fmt and don't carry over illegal values ([a3388bc](https://github.com/buildigo/aws-cdk-patterns/commit/a3388bc090dea14d2c474777f0aee1453bc5aecd))

## [0.3.2](https://github.com/buildigo/aws-cdk-patterns/compare/v0.3.1...v0.3.2) (2024-10-09)


### Bug Fixes

* preserve existing query params ([c06a7a0](https://github.com/buildigo/aws-cdk-patterns/commit/c06a7a0e2d3322e9a5d6519683da084acad4623d))

## [0.3.1](https://github.com/buildigo/aws-cdk-patterns/compare/v0.3.0...v0.3.1) (2024-10-09)


### Bug Fixes

* only generate one cache policy ([ec3e514](https://github.com/buildigo/aws-cdk-patterns/commit/ec3e514f5a02999a3492d38941dfb4183917f687))

## [0.3.0](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.7...v0.3.0) (2023-11-15)


### ⚠ BREAKING CHANGES

* default is now json based logging and no longer text based logging

### Features

* error-in-log alarm defaults for json-based logging, pattern and alarm name/description can be customised ([d061a35](https://github.com/buildigo/aws-cdk-patterns/commit/d061a3539e61c1edaf43ea16dd6570f26057d878))

## [0.2.7](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.6...v0.2.7) (2023-10-20)


### Bug Fixes

* fix issue where svg would be transformed to aviff ([a5a835f](https://github.com/buildigo/aws-cdk-patterns/commit/a5a835f0384e9e980f45754682834248435c42fc))

## [0.2.6](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.5...v0.2.6) (2023-09-29)


### Features

* add warning when lambda is low in memory ([05ae7be](https://github.com/buildigo/aws-cdk-patterns/commit/05ae7be79cd1db91e3c8b30fe2700a17caafc90b))

## [0.2.5](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.4...v0.2.5) (2023-08-16)


### Bug Fixes

* v0.2.5 ([bc2eb50](https://github.com/buildigo/aws-cdk-patterns/commit/bc2eb506fa911d037dd8086e29e6d4b02d7f47c8))

## [0.2.3](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.2...v0.2.3) (2023-07-28)


### Features

* don't enlarge image if smaller than requested size ([8b01b8c](https://github.com/buildigo/aws-cdk-patterns/commit/8b01b8cfcf82ac00966d50afeb4ff20a432533f5))
* introduce construct to add an image API to a cloudfront CDN, allowing to modify images on the fly ([929ae29](https://github.com/buildigo/aws-cdk-patterns/commit/929ae29124c90ce030b24743e18d7f3d38958b3d))


### Bug Fixes

* fix error when collecting coverage ([58806a8](https://github.com/buildigo/aws-cdk-patterns/commit/58806a832e90286dd599eb8ff2fd38e80fc6c6bb))

## [0.2.2](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.1...v0.2.2) (2023-06-29)


### Bug Fixes

* bump minor version ([47bc3a6](https://github.com/buildigo/aws-cdk-patterns/commit/47bc3a68c16ced5fe17b2edf000b4b268cce9532))

## [0.2.1](https://github.com/buildigo/aws-cdk-patterns/compare/v0.2.0...v0.2.1) (2022-09-20)


### Bug Fixes

* make monitored function alarm name readable ([21c8a59](https://github.com/buildigo/aws-cdk-patterns/commit/21c8a59a5bd15d31d8b3df1741477140f8c2dee2))

## [0.2.0](https://github.com/buildigo/aws-cdk-patterns/compare/v0.1.2...v0.2.0) (2022-07-23)


### Features

* rename error in log alarm name to avoid conflicts with existing stacks ([cac4e85](https://github.com/buildigo/aws-cdk-patterns/commit/cac4e85b39c0c6f35a4de92a6f7c228515c8d97e))

## [0.1.2](https://github.com/buildigo/aws-cdk-patterns/compare/v0.1.0...v0.1.2) (2022-07-22)


### Bug Fixes

* bump version for release ([d981a63](https://github.com/buildigo/aws-cdk-patterns/commit/d981a635537c143927653ecd0f9f01d4b67264e7))

## [0.1.0](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.11...v0.1.0) (2022-07-22)


### Bug Fixes

* remove duplicate identifier to monitored function id ([97acfaf](https://github.com/buildigo/aws-cdk-patterns/commit/97acfaf388f3820bec522571904ad9335a0e1bfd))


### Miscellaneous Chores

* add jest config to prettierignore ([6005ddd](https://github.com/buildigo/aws-cdk-patterns/commit/6005ddddaa69c7c2369b498921fb47112a6878aa))

## [0.0.11](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.10...v0.0.11) (2022-07-22)


### Bug Fixes

* jest config using esmodules ([02ff62b](https://github.com/buildigo/aws-cdk-patterns/commit/02ff62b207b854790e22eec32aea21b67982922e))

## [0.0.10](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.9...v0.0.10) (2022-07-22)


### Bug Fixes

* target module esnext with module interop ([33fb170](https://github.com/buildigo/aws-cdk-patterns/commit/33fb17038777818b69aaaae921e73b71386e93ba))

## [0.0.9](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.8...v0.0.9) (2022-07-22)


### Bug Fixes

* add missing id for release output ([763fe30](https://github.com/buildigo/aws-cdk-patterns/commit/763fe306b02985396d1392f4a9479d99a83032c5))

## [0.0.8](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.7...v0.0.8) (2022-07-22)


### Bug Fixes

* revert config change ([d6121bc](https://github.com/buildigo/aws-cdk-patterns/commit/d6121bc228c4729c43946f6927cee8b2ae2e5cb7))

## [0.0.7](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.6...v0.0.7) (2022-07-22)


### Bug Fixes

* use plural of "release" for if statements ([2297117](https://github.com/buildigo/aws-cdk-patterns/commit/22971173a2ff47e2c1a9706e0b87912c0bc806cc))

## [0.0.6](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.5...v0.0.6) (2022-07-22)


### Bug Fixes

* if statements in actions come after ([296ea97](https://github.com/buildigo/aws-cdk-patterns/commit/296ea979fdb8328a50d19ad1d1af15aed60c1ecf))

## [0.0.5](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.4...v0.0.5) (2022-07-22)


### Bug Fixes

* publish done as part of release workflow ([63ffbbb](https://github.com/buildigo/aws-cdk-patterns/commit/63ffbbbbf888653c5ac7ce1389a08798f21016c8))

## [0.0.4](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.3...v0.0.4) (2022-07-22)


### Bug Fixes

* fix typo ([ec3ab2a](https://github.com/buildigo/aws-cdk-patterns/commit/ec3ab2aa329891fa574fe28a8bb865496db3709b))

## [0.0.3](https://github.com/buildigo/aws-cdk-patterns/compare/v0.0.2...v0.0.3) (2022-07-22)


### Bug Fixes

* fix peer dependencies ([9e13cd6](https://github.com/buildigo/aws-cdk-patterns/commit/9e13cd6ce79cb6f1fc8a15cb50dd01ffe857d71c))

## [0.0.2](https://github.com/buildigo/aws-cdk-patterns/compare/0.0.1...v0.0.2) (2022-07-22)


### Features

* test PR release ([ef2e026](https://github.com/buildigo/aws-cdk-patterns/commit/ef2e0261fe21ded2ae8e2ddab0a26f98efd07e3b))
