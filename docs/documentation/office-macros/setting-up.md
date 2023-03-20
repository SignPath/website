---
main_header: Microsoft Office Macros
sub_header: Setting Up
layout: resources
toc: false
show_toc: 0
description: 
---

## Create Project

## Create Signing Policy

### Project Configuration

This are your general project settings.
The important settings are:

- Certificate
This configures which certificate is used.
- Submitters
This configures which users are allowed to submit documents for signing.

![Project Configuration](/assets/img/documentation/office-macros/project-configuration.png)

### Approval Process

Here you can configure how many people and which people are required to approve the signing process.

![Approval Process](/assets/img/documentation/office-macros/approval-process.png)

### Trusted Build System And Origin Verification

As you manually sign your Microsoft Office files, you don't need to configure here anything.

![Trusted Build System And Origin Verification](/assets/img/documentation/office-macros/tbs.png)

## Create Artifact Configuration

``` xml
<?xml version="1.0" encoding="utf-8"?>
<artifact-configuration xmlns="http://signpath.io/artifact-configuration/v1">
  <office-oxml-file>
    <office-macro-sign />
  </office-oxml-file>
</artifact-configuration>
```