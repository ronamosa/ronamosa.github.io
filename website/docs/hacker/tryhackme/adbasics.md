---
title: "Active Directory Basics - TryHackMe Walkthrough and Study Notes"
description: "Complete walkthrough of TryHackMe's Active Directory Basics room. Learn AD fundamentals, domain controllers, forests, authentication protocols, and Azure AD."
keywords: ["active directory", "tryhackme", "AD basics", "domain controller", "kerberos", "NTLM", "azure ad", "windows security"]
tags: ["active-directory", "tryhackme", "windows", "security", "authentication"]
sidebar_position: 1
---

:::info Description

These are my notes for the [Active Directory Basics Room](https://tryhackme.com/room/activedirectorybasics) on TryHackMe.

Credits: Me.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Easy|2/5|

:::

This room was mostly theory so these are notes on Active Directory Basics.

## Physcial AD

Domain Controllers (DC): _"A domain controller is a Windows server that has Active Directory Domain Services (AD DS) installed and has been promoted to a domain controller in the forest. "_

AD DS Data Store: _"The Active Directory Data Store holds the databases and processes needed to store and manage directory information such as users, groups, and services."_.

keywords: `NTDS.dit` database for AD data including hashes, stored in `%SystemRoot%\NTDS`, can only be accessed by the DC.

## Forest

The structure and hierarchy defining everything in AD. A forest is a collection of one or more domain trees inside an AD network.

keywords: `Domains`, `OU`, `Trusts`, `Objects`, `Domain Services`, `Domain Schema`.

## Users + Groups

2 types of groups

1. Security Groups: specifies permissions.
2. Distribution Groups: specifies email distribution lists.

### Default Security Groups

There are lots of them, examples: Domain Controllers, Domain Guests, Domain Admins etc.

## Trust + Policies

Together, allow domain + trees communicate and maintain "security" inside the network.

### Domain Trust

2 x types of trust mechanisms:

1. Directional: flow from trusting --> trusting domains
2. Transitive: "friend of a friend" trust i.e. not directly trusting, but trust by proxy, expanding to include other trusted domains.

## AD Domain Services + AuthN

### Services

Services provided include:

- LDAP
- Certificate Services (PKI)
- DNS, NBT-NS (all things domain management)

### AuthN

- Kerberos - ticket-granting tickets, service tickets
- NTLM

## Azure AD

i.e. AD in the cloud.

On-prem to Cloud equivalents

|On-Prem|AzureAD|
|---|---|
|LDAP|Rest API|
|NTLM|OAuth/SAML|
|Kerberos|OpenID|
|OU Tree|Flat Structure|
|Domains+Forests|Tenants|
|Trusts|Guests|

## Hands-on Lab

The lab was crap. Wrong `PowerView.ps1` version of script didn't match the instructions and then the instructions were easily confusing.
